import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faClipboardList,
  faUsers,
  faCheckCircle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

function SystemDetail() {
  const { id } = useParams(); // URL에서 시스템 ID 가져오기
  const navigate = useNavigate();
  const [system, setSystem] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ 시스템 상세 정보 불러오기
  useEffect(() => {
    const fetchSystemDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/system/${id}`, {
          withCredentials: true,
        });
        console.log("✅ 시스템 상세 API 응답:", response.data);
        setSystem(response.data);
      } catch (error) {
        console.error("❌ 시스템 상세 정보 불러오기 오류:", error);
        setErrorMessage("시스템 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };
    fetchSystemDetail();
  }, [id]);

  // ✅ 평가 상태별 색상 스타일
  const getStatusColor = (status) => {
    switch (status) {
      case "진행 중":
        return "text-yellow-500";
      case "완료됨":
        return "text-green-500";
      case "미완료":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
        {/* ✅ 헤더 */}
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center">
          <FontAwesomeIcon
            icon={faClipboardList}
            className="text-blue-600 mr-3"
          />
          시스템 상세 정보
        </h1>

        {/* ✅ 오류 메시지 */}
        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}

        {/* ✅ 시스템 정보 표시 */}
        {system ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="text-blue-500 mr-2"
                />
                {system.system_name}
              </h2>
              <p className="text-gray-600">📌 목적: {system.purpose}</p>
              <p className="text-gray-600 flex items-center">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="mr-2 text-green-500"
                />
                기관명: {system.institution_name}
              </p>
              <p className="text-gray-600">
                👤 대표자: {system.representative_name}
              </p>
              <p
                className={`text-gray-600 flex items-center ${getStatusColor(
                  system.assessment_status
                )}`}
              >
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                평가 상태: {system.assessment_status}
              </p>
              <p className="text-gray-600">
                📌 최소 대상 수: {system.min_subjects}
              </p>
              <p className="text-gray-600">
                📌 최대 대상 수: {system.max_subjects}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            📌 시스템 정보를 불러오는 중...
          </p>
        )}

        {/* ✅ 뒤로가기 버튼 */}
        <button
          onClick={() => navigate("/ViewSystems")}
          className="mt-6 w-full px-5 py-3 bg-blue-600 text-white rounded-md font-semibold text-lg flex items-center justify-center hover:bg-blue-700 transition-all"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-3" />
          시스템 목록으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default SystemDetail;
