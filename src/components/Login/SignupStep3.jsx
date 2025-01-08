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

  const handleRoleChange = (e) => {
    setFormData({ ...formData, member_type: e.target.value }); // 회원 유형 설정
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
    <div className="bg-white p-6 rounded-lg shadow-md w-3/4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">회원가입</h1>
      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium">기관명</label>
          <input
            type="text"
            name="institution_name"
            value={formData.institution_name || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="기관명을 입력해 주세요"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">기관 주소</label>
          <input
            type="text"
            name="institution_address"
            value={formData.institution_address || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="기관 주소를 입력해 주세요"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">대표자 이름</label>
          <input
            type="text"
            name="representative_name"
            value={formData.representative_name || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="대표자 이름을 입력해 주세요"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">이메일</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="이메일을 입력해 주세요"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="비밀번호를 입력해 주세요"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">회원 유형</label>
          <select
            name="member_type"
            value={formData.member_type || ""}
            onChange={handleRoleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="">회원 유형을 선택해 주세요</option>
            <option value="기관회원">기관회원</option>
            <option value="전문가">전문가</option>
          </select>
        </div>
      </div>
      {errorMessage && (
        <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
      )}
      <div className="flex justify-between mt-8">
        <button
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md"
          onClick={prevStep}
        >
          이전
        </button>
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleSignupSubmit}
        >
          완료
        </button>
      </div>
    </div>
  );
}

export default SignupStep3;
