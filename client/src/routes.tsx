import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<div>Not Found!!!</div>} />
      </Routes>
    </BrowserRouter>
  );
}
