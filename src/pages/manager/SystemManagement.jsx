import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { authState } from "../../state/authState";
import { systemsState } from "../../state/system";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function SystemManagement() {
  const auth = useRecoilValue(authState); // 로그인 정보
  const [systems, setSystems] = useRecoilState(systemsState); // 시스템 데이터
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedSystems = async () => {
      if (!auth.user || !auth.user.id) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/assigned-systems?expertId=${auth.user.id}`,
          { withCredentials: true }
        );
        console.log("✅ 매칭된 시스템 데이터:", response.data);

        const uniqueSystems = response.data.data.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.system_id === value.system_id)
        );
        setSystems(uniqueSystems || []);
      } catch (error) {
        console.error("❌ 매칭된 시스템 가져오기 실패:", error);
      }
    };

    fetchAssignedSystems();
  }, [auth.user, setSystems]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/logout/expert",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert(response.data.msg || "로그아웃 성공");
        navigate("/login");
      } else {
        alert("로그아웃 실패");
      }
    } catch (error) {
      console.error("❌ 로그아웃 요청 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const handleViewResults = (system) => {
    navigate("/completion", {
      state: {
        userId: auth.user?.id,
        systemId: system.system_id,
      },
    });
  };

  const handleProvideFeedback = (system) => {
    navigate("/DiagnosisfeedbackPage", {
      state: {
        userId: auth.user?.id,
        systemId: system.system_id,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <header className="w-full bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1>전문가 대시보드</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
        >
          로그아웃
        </button>
      </header>

      <div className="bg-white p-4 w-full max-w-4xl shadow-md">
        <h2 className="text-xl font-bold mb-4">배정된 시스템</h2>
        <ul>
          {systems.length > 0 ? (
            systems.map((system) => (
              <li key={system.system_id} className="border-b p-2">
                <p>시스템명: {system.system_name}</p>
                <p>기관명: {system.institution_name}</p>
                <p>
                  진단 상태:{" "}
                  {system.feedback_status === "전문가 자문이 반영되었습니다" ? (
                    <span className="text-green-600">
                      전문가 자문이 반영되었습니다
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      전문가 자문이 반영되기 전입니다
                    </span>
                  )}
                </p>
                <p>점수: {system.score || "N/A"}</p>
                <p>등급: {system.grade || "N/A"}</p>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => handleViewResults(system)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    결과 보기
                  </button>
                  {system.feedback_status === "전문가 자문이 반영되었습니다" ? (
                    <button
                      onClick={() => handleProvideFeedback(system)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    >
                      피드백 수정하기
                    </button>
                  ) : (
                    <button
                      onClick={() => handleProvideFeedback(system)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      피드백 하기
                    </button>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500">
              배정된 시스템이 없습니다.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default SystemManagement;
