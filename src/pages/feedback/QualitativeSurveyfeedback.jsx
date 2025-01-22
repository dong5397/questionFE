import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function QualitativeSurveyFeedback() {
  const [qualitativeData, setQualitativeData] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { systemId } = location.state || {};

  useEffect(() => {
    const fetchQualitativeData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/selftest/qualitative",
          { params: { systemId }, withCredentials: true }
        );
        setQualitativeData(response.data || []);

        const initialFeedbacks = (response.data || []).reduce((acc, item) => {
          acc[item.question_number] = {
            feedback: item.feedback || "",
            additionalComment: item.additional_comment || "",
            response: item.response || "",
            file: item.file_path || "",
          };
          return acc;
        }, {});
        setFeedbacks(initialFeedbacks);
      } catch (error) {
        console.error("Error fetching qualitative data:", error);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchQualitativeData();
  }, [systemId]);

  const handleFeedbackChange = (field, questionNumber, value) => {
    setFeedbacks((prev) => ({
      ...prev,
      [questionNumber]: {
        ...prev[questionNumber],
        [field]: value,
      },
    }));
  };

  const handleNextClick = async () => {
    if (currentStep < qualitativeData.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        // 상태 업데이트 요청
        const response = await axios.post(
          "http://localhost:3000/selftest/qualitative/update-status",
          { systemId },
          { withCredentials: true }
        );
        console.log("Feedback status updated:", response.data.msg);
        alert("피드백 상태가 성공적으로 업데이트되었습니다.");
        navigate("/system-management");
      } catch (error) {
        console.error(
          "Error updating feedback status:",
          error.response?.data || error.message
        );
        alert("피드백 상태 업데이트 중 오류가 발생했습니다.");
      }
    }
  };

  const handlePreviousClick = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderCurrentStep = () => {
    if (qualitativeData.length === 0) {
      return <p>데이터를 불러오는 중입니다...</p>;
    }

    const currentData = qualitativeData.find(
      (item) => item.question_number === currentStep
    ) || {
      question_number: currentStep,
      indicator: "질문 없음",
      indicator_definition: "",
      evaluation_criteria: "",
      reference_info: "",
    };

    return (
      <table className="w-full border-collapse border border-gray-300 mb-6">
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2 bg-gray-200 w-1/5">
              지표 번호
            </td>
            <td className="border border-gray-300 p-2 w-4/5">{currentStep}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 bg-gray-200">지표</td>
            <td className="border border-gray-300 p-2">
              {currentData.indicator || "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 bg-gray-200">
              지표 정의
            </td>
            <td className="border border-gray-300 p-2 h-24">
              {currentData.indicator_definition || "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 bg-gray-200">
              평가기준 (착안사항)
            </td>
            <td className="border border-gray-300 p-2 h-24">
              {currentData.evaluation_criteria || "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 bg-gray-200">참고사항</td>
            <td className="border border-gray-300 p-2 h-20">
              {currentData.reference_info || "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 bg-gray-200">
              파일첨부(선택)
            </td>
            <td className="border border-gray-300 p-2">
              <div className="flex items-center">
                <input
                  type="file"
                  className="w-full p-2 border rounded-md"
                  disabled
                />
                <p className="text-sm text-gray-500 mt-2">
                  파일 첨부는 비활성화되었습니다.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 bg-gray-200">평가</td>
            <td className="border border-gray-300 p-2">
              <div className="flex items-center space-x-4">
                <label>
                  <input
                    type="radio"
                    name={`response-${currentStep}`}
                    value="자문 필요"
                    checked={feedbacks[currentStep]?.response === "자문 필요"}
                    readOnly
                    disabled
                    className="mr-2"
                  />
                  자문 필요
                </label>
                <label>
                  <input
                    type="radio"
                    name={`response-${currentStep}`}
                    value="해당 없음"
                    checked={feedbacks[currentStep]?.response === "해당 없음"}
                    readOnly
                    disabled
                    className="mr-2"
                  />
                  해당 없음
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 bg-gray-200">
              자문 내용
            </td>
            <td className="border border-gray-300 p-2">
              <textarea
                placeholder="자문 내용을 입력하세요"
                value={feedbacks[currentStep]?.additionalComment || ""}
                readOnly
                disabled
                className="w-full p-2 border rounded-md"
              ></textarea>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 bg-gray-200">피드백</td>
            <td className="border border-gray-300 p-2">
              <textarea
                placeholder="피드백을 입력하세요"
                value={feedbacks[currentStep]?.feedback || ""}
                onChange={(e) =>
                  handleFeedbackChange("feedback", currentStep, e.target.value)
                }
                className="w-full p-2 border rounded-md"
              ></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        정성 피드백 작성 ({currentStep}/{qualitativeData.length})
      </h2>
      {renderCurrentStep()}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePreviousClick}
          disabled={currentStep === 1}
          className="px-6 py-2 bg-gray-400 text-white rounded-md shadow hover:bg-gray-500"
        >
          이전
        </button>
        <button
          onClick={handleNextClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
        >
          {currentStep === qualitativeData.length ? "저장 후 완료" : "다음"}
        </button>
      </div>
    </div>
  );
}

export default QualitativeSurveyFeedback;
