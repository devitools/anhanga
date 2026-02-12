import { personHandlers, personHooks } from "@/demo";
import { scopes } from "@/pages/person/@routes";
import { Scope } from "@ybyra/core";
import { allPermissions, personEvents, PersonSchema } from "@ybyra/demo";
import { DataForm, DataPage, useComponent } from "@ybyra/react-web";
import { useNavigate, useParams } from "react-router-dom";

export function PersonView () {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const component = useComponent(Scope.view, scopes, navigate);
  const person = PersonSchema.provide();

  return (
    <DataPage
      domain={person.domain}
      scope={Scope.view}
      permissions={allPermissions(person)}
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
