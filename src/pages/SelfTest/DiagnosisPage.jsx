import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import {
  quantitativeDataState,
  responsesState,
  currentStepState,
} from "../../state/selfTestState";

function DiagnosisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, systemId } = location.state || {};

  const [quantitativeData, setQuantitativeData] = useRecoilState(
    quantitativeDataState
  );
  const [responses, setResponses] = useRecoilState(responsesState);
  const [currentStep, setCurrentStep] = useRecoilState(currentStepState);

  useEffect(() => {
    if (!userId || !systemId) {
      console.error("Missing userId or systemId:", { userId, systemId });
      alert("시스템 또는 사용자 정보가 누락되었습니다. 대시보드로 이동합니다.");
      navigate("/dashboard");
      return;
    }

    const fetchQuantitativeData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/selftest/quantitative",
          { params: { systemId }, withCredentials: true }
        );

        const data = response.data.filter(
          (item) => item.question_number >= 1 && item.question_number <= 43
        );

        setQuantitativeData(data);

        const initialResponses = data.reduce((acc, item) => {
          acc[item.question_number] = {
            response: item.response || "",
            additionalComment: item.additional_comment || "",
          };
          return acc;
        }, {});
        setResponses(initialResponses);

        console.log("Initialized Responses:", initialResponses);
      } catch (error) {
        console.error("Error fetching quantitative data:", error);
        alert("정량 데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.");
      }
    };

    fetchQuantitativeData();
  }, [userId, systemId, navigate, setQuantitativeData, setResponses]);

  const validateResponses = (data) => {
    return data.every(
      (item) =>
        item.questionNumber &&
        item.response &&
        item.systemId &&
        typeof item.questionNumber === "number"
    );
  };

  const saveAllResponses = async () => {
    const requestData = Array.from({ length: 43 }, (_, index) => {
      const questionNumber = index + 1;
      return {
        questionNumber, // 문항 번호
        response: responses[questionNumber]?.response || "N/A", // 기본값 설정
        additionalComment:
          responses[questionNumber]?.additionalComment || "추가 의견 없음", // 기본값 설정
        systemId,
      };
    });

    console.log("Sending quantitative responses:", requestData); // 디버깅용

    try {
      await axios.post(
        "http://localhost:3000/selftest/quantitative",
        { quantitativeResponses: requestData },
        { withCredentials: true }
      );
      alert("모든 응답이 저장되었습니다.");
      navigate("/qualitative-survey", { state: { systemId, userId } });
    } catch (error) {
      console.error(
        "Error saving all responses:",
        error.response?.data || error
      );
      alert(
        error.response?.data?.message ||
          "응답 저장 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  const handleNextClick = async () => {
    if (currentStep < 43) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await saveAllResponses();
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
      response: "",
      additional_comment: "",
      feedback: "",
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
            <td className="bg-gray-200 p-2 border">파일첨부</td>
            <td colSpan="3" className="p-2 border">
              <input type="file" className="w-full p-1 border rounded" />
            </td>
          </tr>
          <tr>
            <td className="bg-gray-200 p-2 border">평가</td>
            <td colSpan="3" className="p-2 border">
              <select
                value={responses[currentStep]?.response || ""}
                onChange={(e) =>
                  setResponses((prev) => ({
                    ...prev,
                    [currentStep]: {
                      ...prev[currentStep],
                      response: e.target.value,
                    },
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">선택</option>
                <option value="이행">이행</option>
                <option value="미이행">미이행</option>
                <option value="해당없음">해당없음</option>
                <option value="자문 필요">자문 필요</option>
              </select>
            </td>
          </tr>
          {responses[currentStep]?.response === "자문 필요" && (
            <tr>
              <td className="bg-gray-200 p-2 border">자문 필요 사항</td>
              <td colSpan="3" className="p-2 border">
                <textarea
                  value={responses[currentStep]?.additional_comment || ""}
                  onChange={(e) =>
                    setResponses((prev) => ({
                      ...prev,
                      [currentStep]: {
                        ...prev[currentStep],
                        additional_comment: e.target.value,
                      },
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="추가 의견을 입력하세요"
                ></textarea>
              </td>
            </tr>
          )}
          <tr>
            <td className="bg-gray-200 p-2 border">피드백</td>
            <td colSpan="3" className="p-2 border">
              {currentData.feedback || "N/A"}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="container mx-auto max-w-5xl bg-white mt-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-6">정량 설문조사</h2>
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

export default DiagnosisPage;
