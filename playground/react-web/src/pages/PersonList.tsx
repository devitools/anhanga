import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Scope } from "@anhanga/core";
import { useSchemaTable } from "@anhanga/react";
import { PersonSchema, personHandlers, personHooks } from "@anhanga/demo";
import { createComponent, setNavigate } from "../presentation/contracts/component";
import type { ResolvedAction } from "@anhanga/react";

const scopes = {
  [Scope.index]: { path: "/person" },
  [Scope.add]: { path: "/person/add" },
  [Scope.view]: { path: "/person/view/:id" },
  [Scope.edit]: { path: "/person/edit/:id" },
};

const dialog = {
  async confirm(message: string) {
    return window.confirm(message);
  },
  async alert(message: string) {
    window.alert(message);
  },
};

function ActionBar({ actions, position, domain }: { actions: ResolvedAction[]; position: string; domain: string }) {
  const { t } = useTranslation();
  const filtered = actions.filter((a) => a.config.positions?.includes(position as any));
  if (filtered.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
      {filtered.map((action) => (
        <button
          key={action.name}
          onClick={() => action.execute()}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: 4,
            border: "1px solid #ccc",
            cursor: "pointer",
            backgroundColor: action.config.variant === "primary" ? "#2563eb" : undefined,
            color: action.config.variant === "primary" ? "#fff" : undefined,
          }}
        >
          {t(`common.actions.${action.name}`, { defaultValue: t(`${domain}.actions.${action.name}`, { defaultValue: action.name }) })}
        </button>
      ))}
    </div>
  );
}

export function PersonList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  setNavigate(navigate);

  const component = useMemo(
    () => createComponent(Scope.index, scopes, dialog),
    [],
  );

  const table = useSchemaTable({
    schema: PersonSchema.provide(),
    scope: Scope.index,
    handlers: personHandlers,
    hooks: personHooks,
    component,
    translate: t,
    pageSize: 10,
  });

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
        {t("person.title")}
      </h1>

      <ActionBar actions={table.actions} position="top" domain={PersonSchema.domain} />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {table.columns.map((col) => (
              <th
                key={col.name}
                style={{
                  textAlign: "left",
                  padding: "0.5rem",
                  borderBottom: "2px solid #e5e7eb",
                  cursor: "pointer",
                }}
                onClick={() => table.setSort(col.name)}
              >
                {t(`person.fields.${col.name}`, { defaultValue: col.name })}
                {table.sortField === col.name && (table.sortOrder === "asc" ? " ↑" : " ↓")}
              </th>
            ))}
            <th style={{ textAlign: "right", padding: "0.5rem", borderBottom: "2px solid #e5e7eb" }}>
              {t("common.table.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {table.empty && (
            <tr>
              <td
                colSpan={table.columns.length + 1}
                style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}
              >
                {t("common.table.empty")}
              </td>
            </tr>
          )}
          {table.rows.map((row) => (
            <tr key={table.getIdentity(row)} style={{ borderBottom: "1px solid #e5e7eb" }}>
              {table.columns.map((col) => (
                <td key={col.name} style={{ padding: "0.5rem" }}>
                  {table.formatValue(col.name, row[col.name], row)}
                </td>
              ))}
              <td style={{ padding: "0.5rem", textAlign: "right" }}>
                {table.getRowActions(row).map((action) => (
                  <button
                    key={action.name}
                    onClick={() => action.execute()}
                    style={{
                      marginLeft: "0.25rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: 4,
                      border: "1px solid #ccc",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                    }}
                  >
                    {t(`common.actions.${action.name}`, { defaultValue: action.name })}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {table.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem", alignItems: "center" }}>
          <button
            disabled={table.page <= 1}
            onClick={() => table.setPage(table.page - 1)}
            style={{ padding: "0.25rem 0.75rem", borderRadius: 4, border: "1px solid #ccc", cursor: "pointer" }}
          >
            {t("common.table.previous")}
          </button>
          <span style={{ fontSize: "0.875rem" }}>
            {t("common.table.page", { page: table.page, total: table.totalPages })}
          </span>
          <button
            disabled={table.page >= table.totalPages}
            onClick={() => table.setPage(table.page + 1)}
            style={{ padding: "0.25rem 0.75rem", borderRadius: 4, border: "1px solid #ccc", cursor: "pointer" }}
          >
            {t("common.table.next")}
          </button>
        </div>
      )}
    </div>
  );
}
