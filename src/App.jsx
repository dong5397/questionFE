import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import SelfTestStart from "./pages/SelfTest/SelfTestStart";
import DiagnosisPage from "./pages/SelfTest/DiagnosisPage";
import QualitativeSurvey from "./pages/SelfTest/QualitativeSurvey";
import Login from "./components/Login/Login";
import SignupStep1 from "./components/Login/SignupStep1";
import SignupStep2 from "./components/Login/SignupStep2";
import SignupStep3 from "./components/Login/SignupStep3";
import SignupStep3_expert from "./components/Login/SignupStep3_expert";
import Signup from "./pages/Login/Signup";
import SignupComplet from "./components/Login/SignupComplete";
import Dashboard from "./pages/SelfTest/Dashboard";
import SystemRegistration from "./components/System/SystemRegistration";
import CompletionPage from "./pages/SelfTest/CompletionPage";
import MainPage from "./pages/MainPage";
import SystemManagement from "./pages/manager/SystemManagement";
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/SelfTestStart" element={<SelfTestStart />} />
          <Route path="/DiagnosisPage" element={<DiagnosisPage />} />
          <Route path="/qualitative-survey" element={<QualitativeSurvey />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/signup/step1" element={<SignupStep1 />} />
          <Route path="/signup/step2" element={<SignupStep2 />} />
          <Route path="/signup/step3" element={<SignupStep3 />} />
          <Route path="/signup/step3_expert" element={<SignupStep3_expert />} />
          <Route path="/signup-complete" element={<SignupComplet />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/system-register" element={<SystemRegistration />} />
          <Route path="/completion" element={<CompletionPage />} />
          <Route path="/system-management" element={<SystemManagement />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
