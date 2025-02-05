import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  quantitativeDataState,
  quantitativeResponsesState,
  qualitativeDataState,
  qualitativeResponsesState,
} from "../../state/selfTestState";
import {
  qualitativeFeedbackState,
  quantitativeFeedbackState,
} from "../../state/feedback";

function DiagnosisView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { systemId, userId } = location.state || {};

  const [questions, setQuestions] = useRecoilState(quantitativeDataState);
  const [responses, setResponses] = useRecoilState(quantitativeResponsesState);
  const [qualitativeData, setQualitativeData] =
    useRecoilState(qualitativeDataState);
  const [qualitativeResponses, setQualitativeResponses] = useRecoilState(
    qualitativeResponsesState
  );

  const [quantitativeFeedbacks, setQuantitativeFeedbacks] = useRecoilState(
    quantitativeFeedbackState
  );
  const [qualitativeFeedbacks, setQualitativeFeedbacks] = useRecoilState(
    qualitativeFeedbackState
  );

  useEffect(() => {
    if (!systemId || !userId) {
      alert("🚨 시스템 또는 사용자 정보가 누락되었습니다.");
      navigate("/dashboard");
      return;
    }
  }, [systemId, userId, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!systemId || !userId) return;

      try {
        const [
          questionsRes,
          responsesRes,
          quantFeedbackRes,
          qualRes,
          qualResponsesRes,
          qualFeedbackRes,
        ] = await Promise.all([
          axios.get("http://localhost:3000/selftest/quantitative", {
            params: { systemId },
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/selftest/quantitative/responses", {
            params: { systemId, userId },
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/selftest/feedback", {
            params: { systemId, type: "quantitative" },
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/selftest/qualitative", {
            params: { systemId },
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/selftest/qualitative/responses", {
            params: { systemId, userId },
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/selftest/feedback", {
            params: { systemId, type: "qualitative" },
            withCredentials: true,
          }),
        ]);

        setQuestions(questionsRes.data ?? []);
        setResponses(responsesRes.data ?? []);
        setQuantitativeFeedbacks(
          Array.isArray(quantFeedbackRes.data?.data)
            ? quantFeedbackRes.data.data
            : []
        );
        setQualitativeData(qualRes.data ?? []);
        setQualitativeResponses(qualResponsesRes.data ?? []);
        setQualitativeFeedbacks(
          Array.isArray(qualFeedbackRes.data?.data)
            ? qualFeedbackRes.data.data
            : []
        );

        console.log("📡 [DEBUG] 질문 데이터:", questionsRes.data);
        console.log("📡 [DEBUG] 정성 데이터:", qualRes.data);
      } catch (err) {
        console.error("❌ 데이터 조회 오류:", err);
      }
    };

    fetchData();
  }, [
    systemId,
    userId,
    setQuestions,
    setResponses,
    setQuantitativeFeedbacks,
    setQualitativeData,
    setQualitativeResponses,
    setQualitativeFeedbacks,
  ]);

  // ✅ 피드백 필터링 함수
  const getAllFeedbacks = (feedbackList, questionNumber, type) => {
    if (!Array.isArray(feedbackList)) {
      console.warn(
        "⚠️ feedbackList is not an array, converting it:",
        feedbackList
      );
      return [];
    }

    return feedbackList.filter((f) => {
      if (type === "quantitative") {
        return Number(f.quantitative_question_id) === Number(questionNumber);
      } else {
        return Number(f.qualitative_question_id) === Number(questionNumber);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        진단 결과 보기
      </h1>

      {/* ✅ 정량 평가 결과 */}
      <div className="mb-10 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          정량 평가 결과
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg text-left">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3">지표 번호</th>
                <th className="p-3">질문</th>
                <th className="p-3">응답</th>
                <th className="p-3">추가 의견</th>
                <th className="p-3">피드백</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => {
                const responseObj = responses.find(
                  (r) => Number(r.question_number) === Number(q.question_number)
                ) ?? { response: "-", additional_comment: "-" };

                const feedbackList = getAllFeedbacks(
                  quantitativeFeedbacks,
                  q.question_number,
                  "quantitative"
                );

                return (
                  <tr
                    key={q.question_number}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 text-center">{q.question_number}</td>
                    <td className="p-3">{q.question ?? "-"}</td>
                    <td className="p-3">{responseObj.response ?? "-"}</td>
                    <td className="p-3">
                      {responseObj.additional_comment ?? "-"}
                    </td>
                    <td className="p-3">
                      {feedbackList.length > 0 ? (
                        <ul>
                          {feedbackList.map((fb, index) => (
                            <li key={index}>
                              {fb.feedback} ({fb.expert_name})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "등록된 피드백 없음"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ 정성 평가 결과 */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">
          정성 평가 결과
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg text-left">
            <thead>
              <tr className="bg-green-500 text-white">
                <th className="p-3">지표 번호</th>
                <th className="p-3">지표</th>
                <th className="p-3">피드백</th>
              </tr>
            </thead>
            <tbody>
              {qualitativeData.map((q) => {
                const feedbackList = getAllFeedbacks(
                  qualitativeFeedbacks,
                  q.question_number,
                  "qualitative"
                );

                return (
                  <tr
                    key={q.question_number}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 text-center">{q.question_number}</td>
                    <td className="p-3">{q.indicator ?? "-"}</td>
                    <td className="p-3">
                      {feedbackList.length > 0 ? (
                        <ul>
                          {feedbackList.map((fb, index) => (
                            <li key={index}>
                              {fb.feedback} ({fb.expert_name})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "등록된 피드백 없음"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DiagnosisView;
