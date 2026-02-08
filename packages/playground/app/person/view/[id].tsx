import { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Scope } from "@anhanga/core";
import { PersonSchema } from "../../../src/domain/person/schema";
import { personEvents } from "../../../src/domain/person/events";
import { personHandlers } from "../../../src/domain/person/handlers";
import { personHooks } from "../../../src/domain/person/hooks";
import { createComponent } from "../../../src/presentation/contracts/component";
import { useDialog } from "../../../src/presentation/components/Dialog";
import { SchemaForm } from "../../../src/presentation/components/SchemaForm";
import { Page } from "../../../src/presentation/components/Page";
import { scopes } from "../@routes";

export default function PersonViewPage () {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const dialog = useDialog();
  const component = useMemo(
    () => createComponent(Scope.view, scopes, dialog),
    [dialog],
  );

  return (
    <Page
      domain={PersonSchema.domain}
      scope={Scope.view}
    >
      <SchemaForm
        schema={PersonSchema.provide()}
        scope={Scope.view}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        context={{ id }}
        component={component}
        translate={t}
      />
    </Page>
  );
}
