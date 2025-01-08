import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import SelfTestStart from "./pages/SelfTestStart";
import DiagnosisPage from "./pages/DiagnosisPage";
import QualitativeSurvey from "./pages/QualitativeSurvey";
import Login from "./components/Login/Login";
import SignupStep1 from "./components/Login/SignupStep1";
import SignupStep2 from "./components/Login/SignupStep2";
import SignupStep3 from "./components/Login/SignupStep3";
import Signup from "./pages/Signup";
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" />
          <Route path="/SelfTestStart" element={<SelfTestStart />} />
          <Route path="/DiagnosisPage" element={<DiagnosisPage />} />
          <Route path="/qualitative-survey" element={<QualitativeSurvey />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/signup" element={<SignupStep1 />} />
          <Route path="/signup/step2" element={<SignupStep2 />} />
          <Route path="/signup/step3" element={<SignupStep3 />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
