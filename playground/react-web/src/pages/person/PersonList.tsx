import { personHandlers, personHooks } from "@/demo";
import { scopes } from "@/pages/person/@routes";
import { Scope } from "@ybyra/core";
import { allPermissions, PersonSchema } from "@ybyra/demo";
import { DataTable, DataPage, useComponent } from "@ybyra/react-web";
import { useNavigate } from "react-router-dom";

export function PersonList () {
  const navigate = useNavigate();
  const component = useComponent(Scope.index, scopes, navigate);
  const person = PersonSchema.provide();

  return (
    <DataPage
      domain={person.domain}
      scope={Scope.index}
      permissions={allPermissions(person)}
    >
      <DataTable
        schema={person}
        scope={Scope.index}
        handlers={personHandlers}
        hooks={personHooks}
        component={component}
        permissions={allPermissions(person)}
        pageSize={3}
        debug={true}
      />
    </DataPage>
  );
}
