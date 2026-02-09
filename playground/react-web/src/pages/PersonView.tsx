import { scopes } from "@/pages/@routes";
import { personHandlers, personHooks } from "@/setup";
import { Scope } from "@anhanga/core";
import { personEvents, PersonSchema } from "@anhanga/demo";
import { DataForm, Page, useComponent } from "@anhanga/react-web";
import { useNavigate, useParams } from "react-router-dom";

export function PersonView () {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const component = useComponent(Scope.view, scopes, navigate);

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
