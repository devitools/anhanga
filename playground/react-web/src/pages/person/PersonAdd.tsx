import { personHandlers, personHooks } from "@/demo";
import { scopes } from "@/pages/person/@routes";
import { Scope } from "@anhanga/core";
import { allPermissions, personEvents, PersonSchema } from "@anhanga/demo";
import { DataForm, DataPage, useComponent } from "@anhanga/react-web";
import { useNavigate } from "react-router-dom";

export function PersonAdd () {
  const navigate = useNavigate();
  const component = useComponent(Scope.add, scopes, navigate);
  const person = PersonSchema.provide();

  return (
    <DataPage
      domain={person.domain}
      scope={Scope.add}
    >
      <DataForm
        schema={person}
        scope={Scope.add}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        component={component}
        permissions={allPermissions(person)}
        debug={true}
      />
    </DataPage>
  );
}
