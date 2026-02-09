import { Scope } from "@anhanga/core";
import { allPermissions, PersonSchema } from "@anhanga/demo";
import { DataTable, Page, useComponent } from "@anhanga/react-native";
import { personHandlers, personHooks } from "../../src/demo";
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
        permissions={allPermissions(PersonSchema.provide())}
        pageSize={3}
        debug={true}
      />
    </Page>
  );
}
