import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user", {
        withCredentials: true,
      });
      setUserId(response.data.id);
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
    }
  };

  // 시스템 목록 가져오기
  const fetchSystems = async () => {
    try {
      const response = await axios.get("http://localhost:3000/systems", {
        withCredentials: true,
      });
      setSystems(response.data);
    } catch (error) {
      console.error("시스템 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userId) fetchSystems();
  }, [userId]);

  const handleRegisterClick = () => {
    navigate("/system-register", { state: { userId } });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center my-8">
        기관회원 마이페이지
      </h1>

      <div className="my-8 px-8">
        <h2 className="text-2xl font-bold mb-4">등록된 시스템</h2>
        {loading ? (
          <p>로딩 중...</p>
        ) : systems.length === 0 ? (
          <p>등록된 시스템이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {systems.map((system) => (
              <div
                key={system.system_id}
                className="p-4 bg-white shadow-md rounded-md border"
              >
                <h3 className="font-bold text-lg">{system.system_name}</h3>
                <p>처리 목적: {system.purpose}</p>
                <p>평가 상태: {system.assessment_status}</p>
                <p>기관명: {system.institution_name}</p>
                <p>대표자: {system.representative_name}</p>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleRegisterClick}
          className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
        >
          시스템 등록
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
