import { Scope } from "@anhanga/core";
import { allPermissions, PersonSchema } from "@anhanga/demo";
import { DataTable, DataPage, useComponent } from "@anhanga/react-native";
import { personHandlers, personHooks } from "../../src/demo";
import { scopes } from "./@routes";

export default function PersonIndexPage () {
  const component = useComponent(Scope.index, scopes);
  const person = PersonSchema.provide();

  return (
    <DataPage
      domain={person.domain}
      scope={Scope.index}
    >
      <DataTable
        schema={person}
        scope={Scope.index}
        handlers={personHandlers}
        hooks={personHooks}
        component={component}
        permissions={allPermissions(person)}
        pageSize={3}
        debug={true}
      />
    </DataPage>
  );
}
