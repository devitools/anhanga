import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PersonList } from "./pages/PersonList";
import { PersonAdd } from "./pages/PersonAdd";
import "./presentation/components/renderers";

export function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/person" replace />} />
          <Route path="/person" element={<PersonList />} />
          <Route path="/person/add" element={<PersonAdd />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
