import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Scope } from "@anhanga/core";
import { PersonSchema, personEvents } from "@anhanga/demo";
import { personHandlers, personHooks } from "@/setup";
import { createComponent, setNavigate } from "@/presentation/contracts/component";
import { SchemaForm } from "@/presentation/components/SchemaForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export function PersonEdit() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  setNavigate(navigate);

  const component = useMemo(
    () => createComponent(Scope.edit, scopes, dialog),
    [],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {t("person.title")} — {t("common.scopes.edit")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SchemaForm
          schema={PersonSchema.provide()}
          scope={Scope.edit}
          events={personEvents}
          handlers={personHandlers}
          hooks={personHooks}
          context={{ id }}
          component={component}
          translate={t}
        />
      </CardContent>
    </Card>
  );
}
