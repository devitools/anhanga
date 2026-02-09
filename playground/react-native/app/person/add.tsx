import { Scope } from "@anhanga/core";
import { personEvents, PersonSchema } from "@anhanga/demo";
import { DataForm, Page, useComponent } from "@anhanga/react-native";
import { personHandlers, personHooks } from "../../src/demo";
import { scopes } from "./@routes";

export default function PersonAddPage () {
  const component = useComponent(Scope.add, scopes);

  return (
    <Page
      domain={PersonSchema.domain}
      scope={Scope.add}
    >
      <DataForm
        schema={PersonSchema.provide()}
        scope={Scope.add}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        component={component}
        debug={true}
      />
    </Page>
  );
}
