import { useLocalSearchParams } from "expo-router";
import { Scope } from "@anhanga/core";
import { PersonSchema, personEvents } from "@anhanga/demo";
import { Page, DataForm, useComponent } from "@anhanga/react-native";
import { personHandlers, personHooks } from "../../../src/setup";
import { scopes } from "../@routes";

export default function PersonEditPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const component = useComponent(Scope.edit, scopes);

  return (
    <Page domain={PersonSchema.domain} scope={Scope.edit}>
      <DataForm
        schema={PersonSchema.provide()}
        scope={Scope.edit}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        context={{ id }}
        component={component}
      />
    </Page>
  );
}
