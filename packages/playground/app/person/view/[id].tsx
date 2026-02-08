import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Scope } from "@anhanga/core";
import { PersonSchema } from "../../../src/domain/person/schema";
import { personEvents } from "../../../src/domain/person/events";
import { personHandlers } from "../../../src/domain/person/handlers";
import { createComponent } from "../../../src/presentation/contracts/component";
import { SchemaForm } from "../../../src/presentation/components/SchemaForm";
import { Page } from "../../../src/presentation/components/Page";
import { scopes } from "../@routes";

export default function PersonViewPage () {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const component = useMemo(
    () => createComponent(Scope.view, scopes, () => console.log("[reload]")),
    [],
  );

  const [initialValues, setInitialValues] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!id) return;
    PersonSchema.getServices().default.read(id).then(setInitialValues);
  }, [id]);

  return (
    <Page
      domain={PersonSchema.domain}
      scope={Scope.view}
      loading={!initialValues}
    >
      <SchemaForm
        schema={PersonSchema.provide()}
        scope={Scope.view}
        services={PersonSchema.getServices()}
        events={personEvents}
        handlers={personHandlers}
        component={component}
        initialValues={initialValues!}
        translate={t}
      />
    </Page>
  );
}
