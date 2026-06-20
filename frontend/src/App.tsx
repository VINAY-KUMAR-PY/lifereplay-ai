import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import AnalyzePage from "./pages/AnalyzePage";
import ComparePage from "./pages/ComparePage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>
    </Routes>
  );
}
