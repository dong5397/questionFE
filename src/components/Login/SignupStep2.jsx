import React, { useState } from "react";

function SignupStep2({ formData, setFormData, prevStep, nextStep }) {
  const [phone, setPhone] = useState(formData.phone || "");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setVerificationMessage("");
    setIsVerified(false);
  };

  const handlePhoneVerification = () => {
    if (!phone.trim()) {
      setVerificationMessage("전화번호를 입력해 주세요.");
      return;
    }
    setVerificationMessage(
      "인증번호가 발송되었습니다. 인증번호는 '1234'입니다."
    );
  };

  const handleVerificationCodeCheck = () => {
    if (verificationCode === "1234") {
      setFormData({ ...formData, phone }); // 폰 번호 저장
      setIsVerified(true);
      setVerificationMessage("인증 성공!");
    } else {
      setVerificationMessage("인증번호가 잘못되었습니다.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-3/4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">회원가입</h1>
      <div className="mb-6">
        <label>전화번호</label>
        <input
          type="text"
          value={phone}
          onChange={handlePhoneChange}
          className="w-full p-3 border rounded-md"
        />
        <button
          onClick={handlePhoneVerification}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          인증
        </button>
      </div>
      <div className="mb-6">
        <label>인증번호</label>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="w-full p-3 border rounded-md"
        />
        <button
          onClick={handleVerificationCodeCheck}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md"
        >
          확인
        </button>
      </div>
      {verificationMessage && <p>{verificationMessage}</p>}
      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded-md">
          이전
        </button>
        <button
          onClick={nextStep}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={!isVerified}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default SignupStep2;
