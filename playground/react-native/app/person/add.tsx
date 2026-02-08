import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Scope } from "@anhanga/core";
import { PersonSchema, personEvents } from "@anhanga/demo";
import { personHandlers, personHooks } from "../../src/setup";
import { createComponent } from "../../src/presentation/contracts/component";
import { useDialog, SchemaForm, Page } from "../../src/presentation/components";
import { scopes } from "./@routes";

export default function PersonAddPage () {
  const { t } = useTranslation();
  const dialog = useDialog();
  const component = useMemo(
    () => createComponent(Scope.add, scopes, dialog),
    [dialog],
  );

  return (
    <Page
      domain={PersonSchema.domain}
      scope={Scope.add}
    >
      <SchemaForm
        schema={PersonSchema.provide()}
        scope={Scope.add}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        component={component}
        translate={t}
      />
    </Page>
  );
}
