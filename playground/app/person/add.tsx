import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Scope } from "@anhanga/core";
import { PersonSchema } from "../../src/domain/person/schema";
import { personEvents } from "../../src/domain/person/events";
import { personHandlers } from "../../src/domain/person/handlers";
import { personHooks } from "../../src/domain/person/hooks";
import { createComponent } from "../../src/presentation/contracts/component";
import { useDialog } from "../../src/presentation/components/Dialog";
import { SchemaForm } from "../../src/presentation/components/SchemaForm";
import { Page } from "../../src/presentation/components/Page";
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
