import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PersonList } from "./pages/PersonList";
import { PersonAdd } from "./pages/PersonAdd";
import { PersonView } from "./pages/PersonView";
import { PersonEdit } from "./pages/PersonEdit";
import { Toaster } from "@/components/ui/sonner";
import "./presentation/components/renderers";

export function App() {
  return (
    <BrowserRouter>
      <div className="max-w-4xl mx-auto px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/person" replace />} />
          <Route path="/person" element={<PersonList />} />
          <Route path="/person/add" element={<PersonAdd />} />
          <Route path="/person/view/:id" element={<PersonView />} />
          <Route path="/person/edit/:id" element={<PersonEdit />} />
        </Routes>
      </div>
      <Toaster />
    </BrowserRouter>
  );
}
