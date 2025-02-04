import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import { systemsState } from "../../state/system"; // Recoil 상태 가져오기
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function ViewSystems() {
  const navigate = useNavigate();
  const [systems, setSystems] = useRecoilState(systemsState); // Recoil로 상태 관리

  // ✅ 전체 시스템 목록 가져오기
  useEffect(() => {
    const fetchSystems = async () => {
      if (systems.length === 0) {
        try {
          const response = await axios.get(
            "http://localhost:3000/all-systems",
            {
              withCredentials: true,
            }
          );

          setSystems(response.data.data || []);
        } catch (error) {
          console.error("❌ 시스템 목록 불러오기 오류:", error);
        }
      }
    };

    fetchSystems();
  }, [systems, setSystems]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center">
          <FontAwesomeIcon icon={faBuilding} className="text-blue-600 mr-3" />
          전체 시스템 목록
        </h1>

        {/* ✅ 시스템 목록 */}
        {systems.length > 0 ? (
          <ul className="space-y-4">
            {systems.map((system) => (
              <li
                key={system.systems_id}
                className="p-6 border rounded-lg shadow-md bg-gray-50 transition-transform transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/SystemDetail/${system.systems_id}`)}
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {system.system_name}
                </h2>
                <p className="text-gray-600">
                  기관명: {system.institution_name}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            📌 등록된 시스템이 없습니다.
          </p>
        )}

        {/* ✅ 뒤로가기 버튼 */}
        <button
          onClick={() => navigate("/SuperDashboard")}
          className="mt-6 w-full px-5 py-3 bg-blue-600 text-white rounded-md font-semibold text-lg flex items-center justify-center hover:bg-blue-700 transition-all"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-3" />
          대시보드로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default ViewSystems;
