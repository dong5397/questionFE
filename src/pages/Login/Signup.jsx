import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignupStep1 from "../../components/Login/SignupStep1";
import SignupStep2 from "../../components/Login/SignupStep2";
import SignupStep3 from "../../components/Login/SignupStep3";
import axios from "axios";

function Signup() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    agreement: false,
    email: "",
    password: "",
    institution_name: "",
    institution_address: "",
    representative_name: "",
    phone: "", // 전화번호 추가
    role: "user", // 기본 역할 추가
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        formData
      );
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "회원가입 실패");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      {step === 1 && (
        <SignupStep1
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
        />
      )}
      {step === 2 && (
        <SignupStep2
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {step === 3 && (
        <SignupStep3
          formData={formData}
          setFormData={setFormData}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default Signup;
