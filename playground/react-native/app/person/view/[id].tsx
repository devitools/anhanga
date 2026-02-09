import { useLocalSearchParams } from "expo-router";
import { Scope } from "@anhanga/core";
import { PersonSchema, personEvents } from "@anhanga/demo";
import { Page, DataForm, useComponent } from "@anhanga/react-native";
import { personHandlers, personHooks } from "../../../src/setup";
import { scopes } from "../@routes";

export default function PersonViewPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const component = useComponent(Scope.view, scopes);

  return (
    <Page domain={PersonSchema.domain} scope={Scope.view}>
      <DataForm
        schema={PersonSchema.provide()}
        scope={Scope.view}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        context={{ id }}
        component={component}
      />
    </Page>
  );
}
