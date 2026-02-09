import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DialogProvider } from "@anhanga/react-web";
import { PersonList } from "./pages/PersonList";
import { PersonAdd } from "./pages/PersonAdd";
import { PersonView } from "./pages/PersonView";
import { PersonEdit } from "./pages/PersonEdit";
import { Toaster } from "sonner";

export function App() {
  return (
    <DialogProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/person" replace />} />
          <Route path="/person" element={<PersonList />} />
          <Route path="/person/add" element={<PersonAdd />} />
          <Route path="/person/view/:id" element={<PersonView />} />
          <Route path="/person/edit/:id" element={<PersonEdit />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </DialogProvider>
  );
}
