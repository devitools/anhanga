import { Scope } from "@anhanga/core";
import { allPermissions, personEvents, PersonSchema } from "@anhanga/demo";
import { DataForm, DataPage, useComponent } from "@anhanga/react-native";
import { useLocalSearchParams } from "expo-router";
import { personHandlers, personHooks } from "../../../src/demo";
import { scopes } from "../@routes";

export default function PersonEditPage () {
  const { id } = useLocalSearchParams<{ id: string }>();
  const component = useComponent(Scope.edit, scopes);
  const schema = PersonSchema.provide();
  return (
    <DataPage
      domain={PersonSchema.domain}
      scope={Scope.edit}
    >
      <DataForm
        schema={schema}
        scope={Scope.edit}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        context={{ id }}
        component={component}
        permissions={allPermissions(schema)}
        debug={true}
      />
    </DataPage>
  );
}
