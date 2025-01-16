import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupStep0 from "../../components/Login/SignupStep0";
import SignupStep1 from "../../components/Login/SignupStep1";
import SignupStep2 from "../../components/Login/SignupStep2";
import SignupStep3 from "../../components/Login/SignupStep3";
import SignupStep3Admin from "../../components/Login/SignupStep3_expert";
import axios from "axios";

function Signup() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    agreement: false, // 동의 여부 초기값
    role: "", // 일반/관리자 구분
    email: "",
    password: "",
    institution_name: "",
    institution_address: "",
    representative_name: "",
    phone: "",
    name: "",
    ofcps: "",
    major_carrea: "",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const endpoint =
      formData.role === "user"
        ? "http://localhost:3000/register"
        : "http://localhost:3000/register/expert";

    try {
      console.log("Submitting data:", formData); // 데이터 확인
      const response = await axios.post(endpoint, formData);
      alert(response.data.message || "회원가입 성공!");
      navigate("/");
    } catch (error) {
      console.error("Error during signup:", error.response || error);
      alert(error.response?.data?.message || "회원가입 실패");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <SignupStep0
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
          />
        );
      case 1:
        return (
          <SignupStep1
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <SignupStep2
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return formData.role === "expert" ? (
          <SignupStep3Admin
            formData={formData}
            setFormData={setFormData}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        ) : (
          <SignupStep3
            formData={formData}
            setFormData={setFormData}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      {renderStep()}
    </div>
  );
}

export default Signup;
