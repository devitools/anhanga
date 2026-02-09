import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { FieldConfig, ScopeValue, TableContract } from "@anhanga/core";
import { Position, isInScope, isScopePermitted } from "@anhanga/core";
import type {
  UseDataTableOptions,
  UseDataTableReturn,
  ResolvedColumn,
  ResolvedAction,
} from "./types";

export function useDataTable (options: UseDataTableOptions): UseDataTableReturn {
  const { schema, scope, handlers, hooks, component, pageSize = 10, permissions } = options;

  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimitState] = useState(pageSize);
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>();
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const fetchIdRef = useRef(0);

  const getIdentity = useCallback(
    (record: Record<string, unknown>): string => {
      const identity = schema.identity;
      if (Array.isArray(identity)) {
        return identity.map((k) => record[k]).join(":");
      }
      return String(record[identity] ?? "");
    },
    [schema.identity],
  );

  const scopedFields = useMemo(() => {
    const result: Record<string, FieldConfig> = {};
    for (const [name, config] of Object.entries(schema.fields)) {
      if (isInScope(config, scope)) {
        result[name] = config;
      }
    }
    return result;
  }, [schema.fields, scope]);

  const availableColumns = useMemo((): ResolvedColumn[] => {
    return Object.entries(scopedFields).map(([name, config]) => ({
      name,
      config,
      table: config.table,
    }));
  }, [scopedFields]);

  const [visibleColumns, setVisibleColumns] = useState<string[]>(() =>
    availableColumns.filter((c) => c.table.show).map((c) => c.name),
  );

  const columns = useMemo((): ResolvedColumn[] => {
    return availableColumns
      .filter((c) => visibleColumns.includes(c.name))
      .sort((a, b) => a.table.order - b.table.order);
  }, [availableColumns, visibleColumns]);

  const toggleColumn = useCallback((name: string) => {
    setVisibleColumns((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  }, []);

  const filtersKey = JSON.stringify(filters);

  const reload = useCallback(() => {
    const id = ++fetchIdRef.current;
    const fetchHook = hooks?.fetch?.[scope];
    if (!fetchHook) return;

    setLoading(true);
    fetchHook({ params: { page, limit, sort: sortField, order: sortOrder, filters }, component })
      .then((result: { data: Record<string, unknown>[]; total: number }) => {
        if (fetchIdRef.current !== id) return;
        setRows(result.data);
        setTotal(result.total);
      })
      .finally(() => {
        if (fetchIdRef.current !== id) return;
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hooks?.fetch, scope, page, limit, sortField, sortOrder, filtersKey, component]);

  useEffect(() => {
    reload();
  }, [reload]);

  const empty = !loading && rows.length === 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const setSort = useCallback((field: string) => {
    setSortField((prev) => {
      if (prev !== field) {
        setSortOrder("asc");
        setPage(1);
        return field;
      }
      setSortOrder((prevOrder) => {
        if (prevOrder === "asc") return "desc";
        setSortField(undefined);
        setPage(1);
        return undefined;
      });
      return prev;
    });
  }, []);

  const setFilter = useCallback((field: string, value: unknown) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === "" || value === undefined || value === null) {
        delete next[field];
      } else {
        next[field] = value;
      }
      return next;
    });
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  const setLimit = useCallback((value: number) => {
    setLimitState(value);
    setPage(1);
  }, []);

  const selected = useMemo(
    () => rows.filter((r) => selectedIds.has(getIdentity(r))),
    [rows, selectedIds, getIdentity],
  );

  const isSelected = useCallback(
    (record: Record<string, unknown>) => selectedIds.has(getIdentity(record)),
    [selectedIds, getIdentity],
  );

  const toggleSelect = useCallback(
    (record: Record<string, unknown>) => {
      const id = getIdentity(record);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [getIdentity],
  );

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(rows.map(getIdentity)));
  }, [rows, getIdentity]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const formatValue = useCallback(
    (name: string, value: unknown, record: Record<string, unknown>): string => {
      const config = scopedFields[name];
      if (config?.table.format) {
        return config.table.format(value, record);
      }
      return String(value ?? "");
    },
    [scopedFields],
  );

  const tableContract = useMemo((): TableContract => ({
    page,
    limit,
    total,
    sort: sortField,
    order: sortOrder,
    filters,
    selected,
    reload,
    setPage,
    setFilters,
    clearSelection,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [page, limit, total, sortField, sortOrder, filtersKey, selected, reload]);

  const actions = useMemo((): ResolvedAction[] => {
    return Object.entries(schema.actions)
      .filter(([, config]) => !config.hidden && isInScope(config, scope))
      .filter(() => isScopePermitted(schema.domain, scope, permissions))
      .filter(([, config]) => !config.positions.includes(Position.row))
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([name, config]) => ({
        name,
        config,
        execute: async () => {
          const handler = handlers?.[name];
          if (!handler) return;
          await handler({
            state: {},
            component,
            table: tableContract,
          });
        },
      }));
  }, [schema.actions, scope, handlers, component, tableContract, permissions]);

  const getRowActions = useCallback(
    (record: Record<string, unknown>): ResolvedAction[] => {
      return Object.entries(schema.actions)
        .filter(([, config]) => !config.hidden && isInScope(config, scope))
        .filter(() => isScopePermitted(schema.domain, scope, permissions))
        .filter(([, config]) => config.positions.includes(Position.row))
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([name, config]) => ({
          name,
          config,
          execute: async () => {
            const handler = handlers?.[name];
            if (!handler) return;
            await handler({
              state: { ...record },
              component,
              table: tableContract,
            });
          },
        }));
    },
    [schema.actions, scope, handlers, component, tableContract, permissions],
  );

  return {
    rows,
    loading,
    empty,
    columns,
    availableColumns,
    visibleColumns,
    toggleColumn,
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit,
    sortField,
    sortOrder,
    setSort,
    filters,
    setFilter,
    clearFilters,
    selected,
    isSelected,
    toggleSelect,
    selectAll,
    clearSelection,
    actions,
    getRowActions,
    reload,
    formatValue,
    getIdentity,
  };
}
