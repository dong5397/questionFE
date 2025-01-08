import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DiagnosisPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 43; // Total number of quantitative steps
  const qualitativeStepsStart = 1;
  const qualitativeStepsEnd = 8;

  const handleNextClick = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      navigate("/qualitative-survey"); // Navigate to qualitative survey after the last step
    }
  };

  const handlePreviousClick = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderQualitativeStep = () => (
    <div>
      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">지표 번호</th>
            <th className="border border-gray-300 p-2">값</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2">
              {currentStep - totalSteps}번
            </td>
            <td className="border border-gray-300 p-2">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="답변을 입력하세요"
              ></textarea>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">파일 첨부</td>
            <td className="border border-gray-300 p-2">
              <input
                type="file"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="container mx-auto max-w-5xl bg-white mt-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-6">
          {currentStep <= totalSteps ? "정량 설문조사" : "정성 설문조사"}
        </h2>
        <h3 className="text-lg font-medium mb-4">
          현재 지표 번호:{" "}
          {currentStep <= totalSteps ? currentStep : currentStep - totalSteps}
        </h3>

        {currentStep <= totalSteps ? (
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">지표 번호</th>
                <th className="border border-gray-300 p-2">값</th>
                <th className="border border-gray-300 p-2">단위</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">{currentStep}번</td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">근거법령</td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">평가기준</td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  평가기준 세부사항
                </td>
                <td className="border border-gray-300 p-2">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  ></textarea>
                </td>
                <td className="border border-gray-300 p-2"></td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">최종평가결과</td>
                <td className="border border-gray-300 p-2">
                  <div className="flex items-center space-x-4">
                    <label>
                      <input
                        type="radio"
                        name="evaluation"
                        value="적합"
                        className="mr-1"
                      />{" "}
                      적합
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="evaluation"
                        value="부적합"
                        className="mr-1"
                      />{" "}
                      부적합
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="evaluation"
                        value="기준 없음"
                        className="mr-1"
                      />{" "}
                      기준 없음
                    </label>
                  </div>
                </td>
                <td className="border border-gray-300 p-2"></td>
              </tr>
            </tbody>
          </table>
        ) : (
          renderQualitativeStep()
        )}

        <div className="flex justify-between">
          <button
            className="px-6 py-2 bg-gray-400 text-white rounded-md shadow hover:bg-gray-500"
            onClick={handlePreviousClick}
            disabled={currentStep === 1}
          >
            이전
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
            onClick={handleNextClick}
          >
            {currentStep === totalSteps + qualitativeStepsEnd ? "완료" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiagnosisPage;
