import { personHandlers, personHooks } from "@/demo";
import { scopes } from "@/pages/person/@routes";
import { Scope } from "@anhanga/core";
import { allPermissions, PersonSchema } from "@anhanga/demo";
import { DataTable, DataPage, useComponent } from "@anhanga/react-web";
import { useNavigate } from "react-router-dom";

export function PersonList () {
  const navigate = useNavigate();
  const component = useComponent(Scope.index, scopes, navigate);

  return (
    <DataPage
      domain={PersonSchema.domain}
      scope={Scope.index}
    >
      <DataTable
        schema={PersonSchema.provide()}
        scope={Scope.index}
        handlers={personHandlers}
        hooks={personHooks}
        component={component}
        permissions={allPermissions(PersonSchema.provide())}
        pageSize={3}
        debug={true}
      />
    </DataPage>
  );
}
