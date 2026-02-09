import { personHandlers, personHooks } from "@/demo";
import { scopes } from "@/pages/person/@routes";
import { Scope } from "@anhanga/core";
import { personEvents, PersonSchema } from "@anhanga/demo";
import { DataForm, Page, useComponent } from "@anhanga/react-web";
import { useNavigate, useParams } from "react-router-dom";

export function PersonEdit () {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const component = useComponent(Scope.edit, scopes, navigate);

  return (
    <Page
      domain={PersonSchema.domain}
      scope={Scope.edit}
    >
      <DataForm
        schema={PersonSchema.provide()}
        scope={Scope.edit}
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
