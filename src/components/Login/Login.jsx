import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 요청 중 상태
  const navigate = useNavigate();

  const handleLogin = async () => {
    // 입력값 검증
    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true); // 요청 상태 설정
    setErrorMessage(""); // 이전 오류 메시지 초기화

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      alert(response.data.message); // 로그인 성공 메시지
      navigate("/dashboard"); // 대시보드 페이지로 이동
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "로그인 실패");
    } finally {
      setIsSubmitting(false); // 요청 완료 후 상태 복구
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-3/4 max-w-md">
        <h1 className="text-2xl font-bold mb-6">로그인</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="이메일을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
          <button
            onClick={handleLogin}
            className={`w-full px-4 py-3 font-bold rounded-md ${
              isSubmitting
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
