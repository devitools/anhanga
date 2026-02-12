import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { withProviders } from "@ybyra/react-web";
import { PersonList } from "./pages/person/PersonList";
import { PersonAdd } from "./pages/person/PersonAdd";
import { PersonView } from "./pages/person/PersonView";
import { PersonEdit } from "./pages/person/PersonEdit";
import { Toaster } from "sonner";
import { theme } from "./settings/theme";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Navigate to="/person" replace />} />
        <Route path="/person" element={<PersonList />} />
        <Route path="/person/add" element={<PersonAdd />} />
        <Route path="/person/view/:id" element={<PersonView />} />
        <Route path="/person/edit/:id" element={<PersonEdit />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default withProviders(App, { theme });
