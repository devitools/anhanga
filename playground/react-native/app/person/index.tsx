import { Scope } from "@ybyra/core";
import { allPermissions, PersonSchema } from "@ybyra/demo";
import { DataTable, DataPage, useComponent } from "@ybyra/react-native";
import { personHandlers, personHooks } from "../../src/demo";
import { scopes } from "./@routes";

export default function PersonIndexPage () {
  const component = useComponent(Scope.index, scopes);
  const person = PersonSchema.provide();

  return (
    <DataPage
      domain={person.domain}
      scope={Scope.index}
      permissions={allPermissions(person)}
    >
      <DataTable
        schema={person}
        scope={Scope.index}
        permissions={allPermissions(person)}
        handlers={personHandlers}
        hooks={personHooks}
        component={component}
        pageSize={3}
        debug={true}
      />
    </DataPage>
  );
}
