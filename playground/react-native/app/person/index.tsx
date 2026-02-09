import { Scope } from "@anhanga/core";
import { PersonSchema } from "@anhanga/demo";
import { Page, DataTable, useComponent } from "@anhanga/react-native";
import { personHandlers, personHooks } from "../../src/setup";
import { scopes } from "./@routes";

export default function PersonIndexPage () {
  const component = useComponent(Scope.index, scopes);

  return (
    <Page
      domain={PersonSchema.domain}
      scope={Scope.index}
    >
      <DataTable
        schema={PersonSchema.provide()}
        scope={Scope.index}
        handlers={personHandlers}
        hooks={personHooks}
        component={component}
        pageSize={3}
      />
    </Page>
  );
}
