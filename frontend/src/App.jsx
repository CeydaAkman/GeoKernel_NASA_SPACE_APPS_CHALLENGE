import { useCallback, useState } from "react";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StrategyPage from "./pages/StrategyPage";
import PlanPage from "./pages/PlanPage";
import ExperiencesPage from "./pages/ExperiencesPage"; // <-- Eksik olan import buraya eklendi

const SESSION_KEY = "geokernel_active_user_v1";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authView, setAuthView] = useState("login");
  const [activePage, setActivePage] = useState("dashboard");

  const [strategyData, setStrategyData] = useState({
    field: null,
    analysis: null,
  });

  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleAuthSuccess = (userData) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    setUser(userData);
    setAuthView("login");
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setAuthView("login");
    setActivePage("dashboard");
    setSelectedPlan(null);
  };

  const handleSyncActiveData = useCallback((field, analysis) => {
    setStrategyData({ field, analysis });
  }, [],);

  const handleOpenStrategyPage = (field, analysis) => {
    setStrategyData({ field, analysis });
    setActivePage("strategy");
    window.scrollTo(0, 0);
  };

  const handleOpenPlan = ({ field, crop, operations }) => {
    setSelectedPlan({
      field,
      crop,
      operations,
    });

    setActivePage("plan");
    window.scrollTo(0, 0);
  };

  const handleBackFromPlan = () => {
    setActivePage("strategy");
    window.scrollTo(0, 0);
  };

  if (!user) {
    if (authView === "register") {
      return (
        <Register
          onRegisterSuccess={handleAuthSuccess}
          onSwitchToLogin={() => setAuthView("login")}
        />
      );
    }

    return (
      <Login
        onLoginSuccess={handleAuthSuccess}
        onSwitchToRegister={() => setAuthView("register")}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <Header
        user={user}
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo(0, 0);
        }}
        onLogout={handleLogout}
      />

      {activePage === "strategy" ? (
        <StrategyPage
          field={strategyData.field}
          analysis={strategyData.analysis}
          onBack={() => setActivePage("dashboard")}
          onOpenPlan={handleOpenPlan}
        />
      ) : activePage === "plan" ? (
        <PlanPage
          user={user}
          field={selectedPlan?.field}
          crop={selectedPlan?.crop}
          operations={selectedPlan?.operations || []}
          onBack={handleBackFromPlan}
        />
      ) : activePage === "experiences" ? (
        <ExperiencesPage
          user={user}
          onBack={() => setActivePage("dashboard")}
        />
      ) : (
        <Dashboard
          user={user}
          onOpenStrategyPage={handleOpenStrategyPage}
          onSyncActiveData={handleSyncActiveData}
        />
      )}
    </div>
  );
}