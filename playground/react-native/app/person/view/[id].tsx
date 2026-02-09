import { Scope } from "@anhanga/core";
import { personEvents, PersonSchema } from "@anhanga/demo";
import { DataForm, Page, useComponent } from "@anhanga/react-native";
import { useLocalSearchParams } from "expo-router";
import { personHandlers, personHooks } from "../../../src/demo";
import { scopes } from "../@routes";

export default function PersonViewPage () {
  const { id } = useLocalSearchParams<{ id: string }>();
  const component = useComponent(Scope.view, scopes);

  return (
    <Page
      domain={PersonSchema.domain}
      scope={Scope.view}
    >
      <DataForm
        schema={PersonSchema.provide()}
        scope={Scope.view}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        context={{ id }}
        component={component}
        debug={true}
      />
    </Page>
  );
}
