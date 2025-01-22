import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import {
  quantitativeDataState,
  currentStepState,
} from "../../state/selfTestState";
import { quantitativeFeedbackState } from "../../state/feedback";

function DiagnosisFeedbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { systemId } = location.state || {};

  const [quantitativeData, setQuantitativeData] = useRecoilState(
    quantitativeDataState
  );
  const [feedbacks, setFeedbacks] = useRecoilState(quantitativeFeedbackState);
  const [currentStep, setCurrentStep] = useRecoilState(currentStepState);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    if (!systemId) {
      console.error("System ID가 누락되었습니다.");
      alert("시스템 정보가 없습니다. 대시보드로 이동합니다.");
      navigate("/dashboard");
      return;
    }

    const fetchQuantitativeData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/selftest/quantitative",
          { params: { systemId }, withCredentials: true }
        );
        const data = response.data || [];
        setQuantitativeData(data);

        const initialResponses = data.reduce((acc, item) => {
          acc[item.question_number] = {
            response: item.response || "",
            feedback: item.feedback || "피드백 없음",
          };
          return acc;
        }, {});
        setResponses(initialResponses);
      } catch (error) {
        console.error("Error fetching quantitative data:", error);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchQuantitativeData();
  }, [systemId, navigate, setQuantitativeData]);

  const handleFeedbackChange = (questionNumber, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionNumber]: {
        ...prev[questionNumber],
        feedback: value,
      },
    }));
  };

  const saveAllFeedbacks = async () => {
    const feedbackData = quantitativeData.map((item) => ({
      questionNumber: item.question_number,
      systemId,
      feedback: responses[item.question_number]?.feedback || "피드백 없음",
    }));

    console.log("Sending feedback data:", feedbackData);

    try {
      const response = await axios.post(
        "http://localhost:3000/selftest/quantitative/feedback",
        { systemId, feedbackResponses: feedbackData },
        { withCredentials: true }
      );

      alert(response.data.msg || "모든 피드백이 저장되었습니다.");
      console.log(
        "Navigating to /QualitativeSurveyfeedback with systemId:",
        systemId
      );

      // Navigate with systemId in state
      navigate("/QualitativeSurveyfeedback", { state: { systemId } });
    } catch (error) {
      console.error("Error saving feedback:", error.response?.data || error);
      alert(
        error.response?.data?.msg ||
          "피드백 저장 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  const handleNextClick = () => {
    if (currentStep < 43) {
      setCurrentStep((prev) => prev + 1);
    } else {
      saveAllFeedbacks();
    }
  };

  const handlePreviousClick = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const renderCurrentStep = () => {
    const currentData = quantitativeData.find(
      (item) => item.question_number === currentStep
    ) || {
      question_number: currentStep,
      unit: "",
      evaluation_method: "",
      score: "",
      question: "질문 없음",
      legal_basis: "",
      criteria_and_references: "",
      feedback: "피드백 없음",
    };

    return (
      <table className="w-full border-collapse border border-gray-300 mb-6">
        <tbody>
          <tr>
            <td className="bg-gray-200 p-2 border">지표 번호</td>
            <td className="p-2 border">{currentData.question_number}</td>
            <td className="bg-gray-200 p-2 border">단위</td>
            <td className="p-2 border">{currentData.unit || "N/A"}</td>
          </tr>
          <tr>
            <td className="bg-gray-200 p-2 border">평가방법</td>
            <td className="p-2 border">
              {currentData.evaluation_method || "N/A"}
            </td>
            <td className="bg-gray-200 p-2 border">배점</td>
            <td className="p-2 border">{currentData.score || "N/A"}</td>
          </tr>
          <tr>
            <td className="bg-gray-200 p-2 border">지표</td>
            <td colSpan="3" className="p-2 border">
              {currentData.question}
            </td>
          </tr>
          <tr>
            <td className="bg-gray-200 p-2 border">근거법령</td>
            <td colSpan="3" className="p-2 border">
              {currentData.legal_basis || "N/A"}
            </td>
          </tr>
          <tr>
            <td className="bg-gray-200 p-2 border">평가기준 (착안 사항)</td>
            <td colSpan="3" className="p-2 border">
              {currentData.criteria_and_references || "N/A"}
            </td>
          </tr>
          <tr>
            <td className="bg-gray-200 p-2 border">피드백</td>
            <td colSpan="3" className="p-2 border">
              <textarea
                value={responses[currentStep]?.feedback || "피드백 없음"}
                onChange={(e) =>
                  handleFeedbackChange(currentStep, e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="피드백을 입력하세요"
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="container mx-auto max-w-5xl bg-white mt-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-6">
          정량 피드백 작성 ({currentStep}/43)
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
            {currentStep === 43 ? "완료" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiagnosisFeedbackPage;
