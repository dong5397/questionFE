import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faUserTie,
  faSignOutAlt,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRecoilState } from "recoil";
import { superUserAuthState } from "../../state/authState"; // Recoil 상태 가져오기
const getCsrfToken = async () => {
  try {
    const response = await axios.get("http://localhost:3000/csrf-token", {
      withCredentials: true, // ✅ 세션 쿠키 포함
    });
    return response.data.csrfToken;
  } catch (error) {
    console.error("❌ CSRF 토큰 가져오기 실패:", error);
    return null;
  }
};
function SuperDashboard() {
  const navigate = useNavigate();
  const [superUser, setSuperUser] = useRecoilState(superUserAuthState); // Recoil 상태
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };
    fetchCsrfToken();
  }, []);

  // ✅ 로그아웃 기능
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/logout/SuperUser",
        {},
        { withCredentials: true, headers: { "X-CSRF-Token": csrfToken } }
      );

      // ✅ 세션 및 Recoil 상태 초기화
      sessionStorage.removeItem("superUserData");
      setSuperUser({ isLoggedIn: false, user: null });

      navigate("/login");
    } catch (error) {
      console.error("❌ 로그아웃 실패:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {superUser?.user?.name || "슈퍼유저"} 대시보드
        </h1>

        {/* ✅ 버튼 목록 */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/ViewSystems")}
            className="w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg text-lg flex items-center justify-center hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
          >
            <FontAwesomeIcon icon={faList} className="mr-3" />
            전체 시스템 보기
          </button>

          <button
            onClick={() => navigate("/MatchExperts")}
            className="w-full px-5 py-3 bg-green-600 text-white font-semibold rounded-lg text-lg flex items-center justify-center hover:bg-green-700 transition-transform transform hover:scale-105 shadow-md"
          >
            <FontAwesomeIcon icon={faUserTie} className="mr-3" />
            매칭하러 가기
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-5 py-3 bg-red-600 text-white font-semibold rounded-lg text-lg flex items-center justify-center hover:bg-red-700 transition-transform transform hover:scale-105 shadow-md"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
            로그아웃
          </button>
          <button
            onClick={() => navigate("/SuperManageQuestions")}
            className="w-full px-5 py-3 bg-purple-600 text-white font-semibold rounded-lg text-lg flex items-center justify-center hover:bg-purple-700 transition-transform transform hover:scale-105 shadow-md"
          >
            <FontAwesomeIcon icon={faClipboardList} className="mr-3" />
            자가진단 문항 관리
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuperDashboard;
