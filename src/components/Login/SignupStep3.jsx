import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignupStep3({ formData, setFormData, prevStep }) {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignupSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        formData
      );

      alert(response.data.message);
      navigate("/signup-complete", { state: formData }); // formData 전달
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "회원가입 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-3/4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
      <div className="border-b border-gray-300 mb-6 pb-2 flex justify-between">
        <button
          className="text-blue-600 font-medium"
          onClick={() => alert("개인정보 약관동의 내용")}
        >
          개인정보 약관동의
        </button>
        <button className="text-blue-600 font-medium">이메일 인증</button>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium">기관명</label>
          <input
            type="text"
            name="institution_name"
            value={formData.institution_name || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="기관명을 입력해 주세요"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">기관 주소</label>
          <input
            type="text"
            name="institution_address"
            value={formData.institution_address || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="기관 주소를 입력해 주세요"
          />
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md"
            onClick={() => alert("기관 확인 API 호출")}
          >
            기관 확인
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium">대표 사용자</label>
          <input
            type="text"
            name="representative_name"
            value={formData.representative_name || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="대표사용자를 입력해 주세요"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="영문자, 숫자, 특수문자 포함 8~20자"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">비밀번호 확인</label>
          <input
            type="password"
            name="password_confirm"
            value={formData.password_confirm || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="비밀번호를 확인해 주세요"
          />
        </div>
      </div>
      {errorMessage && (
        <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
      )}
      <div className="flex justify-between mt-8">
        <button
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md"
          onClick={prevStep}
        >
          이전
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleSignupSubmit}
        >
          완료
        </button>
      </div>
    </div>
  );
}

export default SignupStep3;
