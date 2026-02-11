import { Scope } from "@anhanga/core";
import { allPermissions, personEvents, PersonSchema } from "@anhanga/demo";
import { DataForm, DataPage, useComponent } from "@anhanga/react-native";
import { useLocalSearchParams } from "expo-router";
import { personHandlers, personHooks } from "../../../src/demo";
import { scopes } from "../@routes";

export default function PersonViewPage () {
  const { id } = useLocalSearchParams<{ id: string }>();
  const component = useComponent(Scope.view, scopes);
  const person = PersonSchema.provide();

  return (
    <DataPage
      domain={person.domain}
      scope={Scope.view}
    >
      <DataForm
        schema={person}
        scope={Scope.view}
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
