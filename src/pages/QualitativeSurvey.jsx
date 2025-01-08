import React, { useState } from "react";

function QualitativeSurvey() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  const handleNextClick = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousClick = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="container mx-auto max-w-5xl bg-white mt-10 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-6">
          정성 설문조사 ({currentStep}/{totalSteps}번)
        </h2>
        {/* 설문 항목 */}
        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">항목</th>
              <th className="border border-gray-300 p-2">내용</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">지표 번호</td>
              <td className="border border-gray-300 p-2">{currentStep}번</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">지표</td>
              <td className="border border-gray-300 p-2">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="지표 내용을 입력하세요"
                ></textarea>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">평가기준</td>
              <td className="border border-gray-300 p-2">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="평가기준 내용을 입력하세요"
                ></textarea>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">참고사항</td>
              <td className="border border-gray-300 p-2">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="참고사항 내용을 입력하세요"
                ></textarea>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">파일첨부</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="file"
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">평가</td>
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
                      value="미흡"
                      className="mr-1"
                    />{" "}
                    미흡
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-between">
          <button
            className="px-6 py-2 bg-gray-400 text-white rounded-md shadow hover:bg-gray-500"
            onClick={handlePreviousClick}
            disabled={currentStep === 1}
          >
            이전
          </button>
          {currentStep === totalSteps ? (
            <button className="px-6 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700">
              완료
            </button>
          ) : (
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
              onClick={handleNextClick}
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QualitativeSurvey;
