import { Scope } from "@ybyra/core";
import { allPermissions, personEvents, PersonSchema } from "@ybyra/demo";
import { DataForm, DataPage, useComponent } from "@ybyra/react-native";
import { personHandlers, personHooks } from "../../src/demo";
import { scopes } from "./@routes";

export default function PersonAddPage () {
  const component = useComponent(Scope.add, scopes);
  const person = PersonSchema.provide();

  return (
    <DataPage
      domain={person.domain}
      scope={Scope.add}
      permissions={allPermissions(person)}
    >
      <DataForm
        schema={person}
        scope={Scope.add}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        component={component}
        permissions={allPermissions(person)}
        debug={true}
      />
    </DataPage>
  );
}
