import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Scope } from "@anhanga/core";
import { PersonSchema } from "../../src/domain/person/schema";
import { personHandlers } from "../../src/domain/person/handlers";
import { createComponent } from "../../src/presentation/contracts/component";
import { SchemaTable } from "../../src/presentation/components/SchemaTable";
import { Page } from "../../src/presentation/components/Page";
import { scopes } from "./@routes";

export default function PersonIndexPage () {
  const { t } = useTranslation();
  const component = useMemo(
    () => createComponent(Scope.index, scopes, () => console.log("[reload]")),
    [],
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
        services={PersonSchema.getServices()}
        handlers={personHandlers}
        component={component}
        translate={t}
        pageSize={3}
        debug={false}
      />
    </Page>
  );
}
