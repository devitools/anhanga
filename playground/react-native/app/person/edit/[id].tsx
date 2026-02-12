import { Scope } from "@ybyra/core";
import { allPermissions, personEvents, PersonSchema } from "@ybyra/demo";
import { DataForm, DataPage, useComponent } from "@ybyra/react-native";
import { useLocalSearchParams } from "expo-router";
import { personHandlers, personHooks } from "../../../src/demo";
import { scopes } from "../@routes";

export default function PersonEditPage () {
  const { id } = useLocalSearchParams<{ id: string }>();
  const component = useComponent(Scope.edit, scopes);
  const person = PersonSchema.provide();
  return (
    <DataPage
      domain={person.domain}
      scope={Scope.edit}
      permissions={allPermissions(person)}
    >
      <DataForm
        schema={person}
        scope={Scope.edit}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        context={{ id }}
        component={component}
        permissions={allPermissions(person)}
        debug={true}
      />
    </DataPage>
  );
}
