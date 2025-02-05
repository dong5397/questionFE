import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import {
  qualitativeDataState,
  qualitativeResponsesState,
  qualitativeCurrentStepState,
} from "../../state/selfTestState";

function QualitativeSurvey() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, systemId } = location.state || {};

  const [currentStep, setCurrentStep] = useRecoilState(
    qualitativeCurrentStepState
  );
  const [responses, setResponses] = useRecoilState(qualitativeResponsesState);
  const [qualitativeData, setQualitativeData] =
    useRecoilState(qualitativeDataState);

  const resetQualitativeResponses = useResetRecoilState(
    qualitativeResponsesState
  );
  const resetCurrentStep = useResetRecoilState(qualitativeCurrentStepState);
  const resetQualitativeData = useResetRecoilState(qualitativeDataState);

  // ✅ 시스템 변경 시 상태 초기화
  useEffect(() => {
    if (!systemId || !userId) {
      alert("🚨 시스템 또는 사용자 정보가 누락되었습니다.");
      navigate("/dashboard");
      return;
    }

    console.log("🔄 [INFO] 새로운 시스템 감지 → 정성 평가 상태 초기화");
    resetQualitativeResponses();
    resetCurrentStep();
    resetQualitativeData();

    setCurrentStep(1);
  }, [
    systemId,
    userId,
    navigate,
    resetQualitativeResponses,
    resetCurrentStep,
    resetQualitativeData,
  ]);

  useEffect(() => {
    const fetchQualitativeData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/selftest/qualitative",
          {
            params: { systemId },
            withCredentials: true,
          }
        );

        const data = response.data || [];
        setQualitativeData(data);

        // ✅ 기존 응답 데이터가 없으면 1~8까지 초기화
        const initialResponses = {};
        for (let i = 1; i <= 8; i++) {
          initialResponses[i] = {
            response: "해당없음",
            additionalComment: "",
            filePath: null,
          };
        }
        setResponses(initialResponses);
      } catch (error) {
        console.error("❌ 정성 데이터를 불러오는 중 오류 발생:", error);
        alert("정성 데이터를 불러오는 데 실패했습니다.");
      }
    };

    fetchQualitativeData();
  }, [systemId, userId, setQualitativeData, setResponses]);

  const handleNextClick = () => {
    if (currentStep < 8) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!systemId || !userId) {
      alert("🚨 시스템 또는 사용자 정보가 없습니다.");
      return;
    }

    const formattedResponses = Object.entries(responses).map(
      ([question_number, responseData]) => ({
        systemId,
        userId,
        questionId: Number(question_number),
        response: ["자문필요", "해당없음"].includes(
          responseData.response?.trim()
        )
          ? responseData.response.trim()
          : "해당없음",
        additionalComment:
          responseData.response === "자문필요"
            ? responseData.additionalComment?.trim() || "추가 의견 없음"
            : "",
        filePath: responseData.filePath || null,
      })
    );

    try {
      await axios.post(
        "http://localhost:3000/selftest/qualitative",
        { responses: formattedResponses },
        { withCredentials: true }
      );
      await axios.post(
        "http://localhost:3000/assessment/complete",
        { userId, systemId },
        { withCredentials: true }
      );

      alert("✅ 정성 평가가 완료되었습니다!");
      navigate("/completion", { state: { userId, systemId } });
    } catch (error) {
      console.error("❌ [ERROR] 정성 평가 저장 실패:", error);
      alert("정성 평가 저장 중 오류가 발생했습니다.");
    }
  };

  const handleResponseChange = (questionNumber, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionNumber]: {
        ...prev[questionNumber],
        response: value,
        additionalComment:
          value === "자문필요"
            ? prev[questionNumber]?.additionalComment || ""
            : "",
      },
    }));
  };

  const handleAdditionalCommentChange = (questionNumber, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionNumber]: {
        ...prev[questionNumber],
        additionalComment: value,
      },
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("systemId", systemId);
    formData.append("questionId", currentStep);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResponses((prev) => ({
        ...prev,
        [currentStep]: {
          ...prev[currentStep],
          filePath: response.data.filePath,
        },
      }));
    } catch (error) {
      console.error("❌ 파일 업로드 실패:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="container mx-auto max-w-5xl bg-white mt-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-6">
          정성 평가 ({currentStep}/8번)
        </h2>

        {/* ✅ 현재 문항 표시 */}
        {qualitativeData.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 bg-gray-200">
                  지표 번호
                </td>
                <td className="border border-gray-300 p-2">
                  {qualitativeData[currentStep - 1]?.question_number ||
                    currentStep}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 bg-gray-200">지표</td>
                <td className="border border-gray-300 p-2">
                  {qualitativeData[currentStep - 1]?.indicator || "질문 없음"}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 bg-gray-200">
                  평가기준
                </td>
                <td className="border border-gray-300 p-2">
                  {qualitativeData[currentStep - 1]?.evaluation_criteria ||
                    "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 bg-gray-200">평가</td>
                <td className="border border-gray-300 p-2">
                  <select
                    value={responses[currentStep]?.response || "해당없음"}
                    onChange={(e) =>
                      handleResponseChange(currentStep, e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="자문필요">자문필요</option>
                    <option value="해당없음">해당없음</option>
                  </select>
                </td>
              </tr>
              {responses[currentStep]?.response === "자문필요" && (
                <tr>
                  <td className="border border-gray-300 p-2 bg-gray-200">
                    자문 필요 사항
                  </td>
                  <td className="border border-gray-300 p-2">
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={responses[currentStep]?.additionalComment || ""}
                      onChange={(e) =>
                        handleAdditionalCommentChange(
                          currentStep,
                          e.target.value
                        )
                      }
                    ></textarea>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">로딩 중...</p>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
          >
            이전
          </button>
          <button onClick={handleNextClick}>
            {currentStep === 8 ? "완료" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QualitativeSurvey;
