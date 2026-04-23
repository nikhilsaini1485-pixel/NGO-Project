import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@/App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MemberDashboard from "./pages/MemberDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/member-dashboard" element={<MemberDashboard />} />
          <Route path="/coordinator-dashboard" element={<CoordinatorDashboard />} />
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;