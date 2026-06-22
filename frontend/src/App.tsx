import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import AnalyzePage from "./pages/AnalyzePage";
import CareerReplayPage from "./pages/CareerReplayPage";
import ComparePage from "./pages/ComparePage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import LandingPage from "./pages/LandingPage";
import SharedDecisionPage from "./pages/SharedDecisionPage";
import FutureSimulationPage from "./pages/FutureSimulationPage";
import RecruiterViewPage from "./pages/RecruiterViewPage";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary><Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/career-replay" element={<CareerReplayPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/decision/:id" element={<SharedDecisionPage />} />
        <Route path="/future-simulation" element={<FutureSimulationPage />} />
        <Route path="/recruiter-view" element={<RecruiterViewPage />} />
      </Route>
    </Routes></ErrorBoundary>
  );
}
