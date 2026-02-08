import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Scope } from "@anhanga/core";
import { PersonSchema } from "@anhanga/demo";
import { personHandlers, personHooks } from "../../src/setup";
import { createComponent } from "../../src/presentation/contracts/component";
import { useDialog, SchemaTable, Page } from "../../src/presentation/components";
import { scopes } from "./@routes";

export default function PersonIndexPage () {
  const { t } = useTranslation();
  const dialog = useDialog();
  const component = useMemo(
    () => createComponent(Scope.index, scopes, dialog),
    [dialog],
  );

  return (
    <Page
      domain={PersonSchema.domain}
      scope={Scope.index}
    >
      <SchemaTable
        grid={false}
        schema={PersonSchema.provide()}
        scope={Scope.index}
        handlers={personHandlers}
        hooks={personHooks}
        component={component}
        translate={t}
        pageSize={3}
        debug={false}
      />
    </Page>
  );
}
