import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Scope } from "@anhanga/core";
import { PersonSchema, personEvents, personHandlers, personHooks } from "@anhanga/demo";
import { createComponent, setNavigate } from "../presentation/contracts/component";
import { SchemaForm } from "../presentation/components/SchemaForm";

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

export function PersonAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  setNavigate(navigate);

  const component = useMemo(
    () => createComponent(Scope.add, scopes, dialog),
    [],
  );

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
        {t("person.title")} — {t("common.scopes.add")}
      </h1>
      <SchemaForm
        schema={PersonSchema.provide()}
        scope={Scope.add}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        component={component}
        translate={t}
      />
    </div>
  );
}
