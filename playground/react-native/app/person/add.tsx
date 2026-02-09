import { Scope } from "@anhanga/core";
import { PersonSchema, personEvents } from "@anhanga/demo";
import { Page, DataForm, useComponent } from "@anhanga/react-native";
import { personHandlers, personHooks } from "../../src/setup";
import { scopes } from "./@routes";

export default function PersonAddPage() {
  const component = useComponent(Scope.add, scopes);

  return (
    <Page domain={PersonSchema.domain} scope={Scope.add}>
      <DataForm
        schema={PersonSchema.provide()}
        scope={Scope.add}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        component={component}
      />
    </Page>
  );
}
