import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Scope } from "@anhanga/core";
import type { PositionValue } from "@anhanga/core";
import { useDataTable } from "@anhanga/react";
import { PersonSchema } from "@anhanga/demo";
import { personHandlers, personHooks } from "../setup";
import { createComponent, setNavigate } from "../presentation/contracts/component";
import type { ResolvedAction } from "@anhanga/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const scopes = {
  [Scope.index]: { path: "/person" },
  [Scope.add]: { path: "/person/add" },
  [Scope.view]: { path: "/person/view/:id" },
  [Scope.edit]: { path: "/person/edit/:id" },
};

const dialog = {
  async confirm (message: string) {
    return window.confirm(message);
  },
  async alert (message: string) {
    window.alert(message);
  },
};

function ActionBar ({ actions, position, domain }: { actions: ResolvedAction[]; position: PositionValue; domain: string }) {
  const { t } = useTranslation();
  const filtered = actions.filter((a) => a.config.positions?.includes(position));
  if (filtered.length === 0) return null;

  return (
    <div className="flex gap-2 mb-4">
      {filtered.map((action) => (
        <Button
          key={action.name}
          onClick={() => action.execute()}
          variant={action.config.variant === "primary" ? "default" : action.config.variant === "destructive" ? "destructive" : "outline"}
          size="sm"
        >
          {t(`common.actions.${action.name}`, { defaultValue: t(`${domain}.actions.${action.name}`, { defaultValue: action.name }) })}
        </Button>
      ))}
    </div>
  );
}

export function PersonList () {
  const { t } = useTranslation();
  const navigate = useNavigate();
  setNavigate(navigate);

  const component = useMemo(
    () => createComponent(Scope.index, scopes, dialog),
    [],
  );

  const table = useDataTable({
    schema: PersonSchema.provide(),
    scope: Scope.index,
    handlers: personHandlers,
    hooks: personHooks,
    component,
    translate: t,
    pageSize: 10,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t("person.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ActionBar
          actions={table.actions}
          position="top"
          domain={PersonSchema.domain}
        />

        <Table>
          <TableHeader>
            <TableRow>
              {table.columns.map((col) => (
                <TableHead
                  key={col.name}
                  className="cursor-pointer select-none"
                  onClick={() => table.setSort(col.name)}
                >
                  {t(`person.fields.${col.name}`, { defaultValue: col.name })}
                  {table.sortField === col.name && (table.sortOrder === "asc" ? " ↑" : " ↓")}
                </TableHead>
              ))}
              <TableHead className="text-right">
                {t("common.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.empty && (
              <TableRow>
                <TableCell
                  colSpan={table.columns.length + 1}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t("common.table.empty")}
                </TableCell>
              </TableRow>
            )}
            {table.rows.map((row) => (
              <TableRow key={table.getIdentity(row)}>
                {table.columns.map((col) => (
                  <TableCell key={col.name}>
                    {table.formatValue(col.name, row[col.name], row)}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {table.getRowActions(row).map((action) => (
                      <Button
                        key={action.name}
                        onClick={() => action.execute()}
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        {t(`common.actions.${action.name}`, { defaultValue: action.name })}
                      </Button>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {table.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4 items-center">
            <Button
              variant="outline"
              size="sm"
              disabled={table.page <= 1}
              onClick={() => table.setPage(table.page - 1)}
            >
              {t("common.table.previous")}
            </Button>
            <span className="text-sm text-muted-foreground">
              {t("common.table.page", { page: table.page, total: table.totalPages })}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={table.page >= table.totalPages}
              onClick={() => table.setPage(table.page + 1)}
            >
              {t("common.table.next")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
