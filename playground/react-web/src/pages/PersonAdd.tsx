import { scopes } from "@/pages/@routes";
import { personHandlers, personHooks } from "@/setup";
import { Scope } from "@anhanga/core";
import { personEvents, PersonSchema } from "@anhanga/demo";
import { DataForm, Page, useComponent } from "@anhanga/react-web";
import { useNavigate } from "react-router-dom";

export function PersonAdd () {
  const navigate = useNavigate();
  const component = useComponent(Scope.add, scopes, navigate);

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
