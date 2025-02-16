import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import {
  quantitativeQuestionsState,
  qualitativeQuestionsState,
} from "../../state/selfTestState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faSave,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import TiptapEditor from "../../components/Super/TiptapEditor";
const getCsrfToken = async () => {
  try {
    const response = await axios.get("http://localhost:3000/csrf-token", {
      withCredentials: true, // ✅ 세션 쿠키 포함
    });
    return response.data.csrfToken;
  } catch (error) {
    console.error("❌ CSRF 토큰 가져오기 실패:", error);
    return null;
  }
};
function SuperManageQuestions() {
  const [quantitativeQuestions, setQuantitativeQuestions] = useRecoilState(
    quantitativeQuestionsState
  );
  const [qualitativeQuestions, setQualitativeQuestions] = useRecoilState(
    qualitativeQuestionsState
  );
  const [newQuestion, setNewQuestion] = useState({
    type: "quantitative",
    question_number: "",
    question: "",
    indicator: "",
    indicator_definition: "",
    evaluation_criteria: "", // ✅ 기본값을 빈 문자열로 설정
    reference_info: "",
    legal_basis: "",
    score: "",
  });
  const [selectedQuestion, setSelectedQuestion] = useState(null); // 수정할 문항 저장
  const [editedData, setEditedData] = useState({}); // 수정 데이터 저장
  const quillRef = useRef(null); // ✅ Quill ref 추가
  const [csrfToken, setCsrfToken] = useState("");
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };
    fetchCsrfToken();
  }, []);
  // ✅ 문항 목록 API 요청
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const [quantitativeRes, qualitativeRes] = await Promise.all([
          axios.get("http://localhost:3000/super/selftest/quantitative", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/super/selftest/qualitative", {
            withCredentials: true,
          }),
        ]);

        console.log("🔍 [DEBUG] 정량 문항 응답 데이터:", quantitativeRes.data);
        console.log("🔍 [DEBUG] 정성 문항 응답 데이터:", qualitativeRes.data);

        // ✅ API 응답에서 `data` 키를 추출하여 설정
        setQuantitativeQuestions(
          Array.isArray(quantitativeRes.data.data)
            ? quantitativeRes.data.data
            : []
        );
        setQualitativeQuestions(
          Array.isArray(qualitativeRes.data.data)
            ? qualitativeRes.data.data
            : []
        );
      } catch (error) {
        console.error("❌ 문항 불러오기 오류:", error);
      }
    };

    fetchQuestions();
  }, []);

  // 문항 추가 요청
  const handleAddQuestion = async () => {
    try {
      const endpoint =
        newQuestion.type === "quantitative"
          ? "http://localhost:3000/super/selftest/quantitative/add"
          : "http://localhost:3000/super/selftest/qualitative/add";

      const questionData =
        newQuestion.type === "quantitative"
          ? {
              question_number: newQuestion.question_number,
              question: newQuestion.question,
              evaluation_criteria: newQuestion.evaluation_criteria,
              legal_basis: newQuestion.legal_basis,
              score: newQuestion.score,
            }
          : {
              question_number: newQuestion.question_number,
              indicator: newQuestion.indicator,
              indicator_definition: newQuestion.indicator_definition,
              evaluation_criteria: newQuestion.evaluation_criteria,
              reference_info: newQuestion.reference_info,
            };

      const response = await axios.post(endpoint, questionData, {
        withCredentials: true,
        headers: { "X-CSRF-Token": csrfToken },
      });

      alert("✅ 문항이 추가되었습니다!");
      if (newQuestion.type === "quantitative") {
        setQuantitativeQuestions([...quantitativeQuestions, response.data]);
      } else {
        setQualitativeQuestions([...qualitativeQuestions, response.data]);
      }

      setNewQuestion({
        type: "quantitative",
        question_number: "",
        question: "",
        indicator: "",
        indicator_definition: "",
        evaluation_criteria: "",
        reference_info: "",
        legal_basis: "",
        score: "",
      });
    } catch (error) {
      console.error("❌ 문항 추가 실패:", error);
      alert("문항 추가 중 오류가 발생했습니다.");
    }
  };
  // ✅ 수정 버튼 클릭 시 문항 정보 불러오기
  const handleEditStart = (question, type) => {
    console.log("📝 수정할 문항 데이터:", question); // 🔥 디버깅

    setSelectedQuestion({ ...question, type });

    setEditedData({
      ...question,
      evaluation_criteria: question.evaluation_criteria || "<p><br></p>", // ✅ 빈 값 방지
    });
  };

  // ✅ 수정 저장 버튼 클릭
  const handleEditSave = async (id, type) => {
    const endpoint =
      type === "quantitative"
        ? `http://localhost:3000/super/selftest/quantitative/put/${id}`
        : `http://localhost:3000/super/selftest/qualitative/put/${id}`;

    try {
      await axios.put(endpoint, editedData, {
        withCredentials: true,
        headers: { "X-CSRF-Token": csrfToken },
      });

      alert("✅ 문항이 수정되었습니다!");
      setSelectedQuestion(null); // 폼 닫기

      if (type === "quantitative") {
        setQuantitativeQuestions((prev) =>
          prev.map((q) => (q.id === id ? editedData : q))
        );
      } else {
        setQualitativeQuestions((prev) =>
          prev.map((q) => (q.id === id ? editedData : q))
        );
      }
    } catch (error) {
      console.error("❌ 문항 수정 실패:", error);
      alert("문항 수정 중 오류가 발생했습니다.");
    }
  };
  // 문항 삭제 요청
  const handleDeleteQuestion = async (id, type) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const endpoint =
        type === "quantitative"
          ? `http://localhost:3000/super/selftest/quantitative/del/${id}`
          : `http://localhost:3000/super/selftest/qualitative/del/${id}`;

      await axios.delete(endpoint, {
        withCredentials: true,
        headers: { "X-CSRF-Token": csrfToken },
      });

      alert("✅ 문항이 삭제되었습니다!");
      if (type === "quantitative") {
        setQuantitativeQuestions(
          quantitativeQuestions.filter((q) => q.id !== id)
        );
      } else {
        setQualitativeQuestions(
          qualitativeQuestions.filter((q) => q.id !== id)
        );
      }
    } catch (error) {
      console.error("❌ 문항 삭제 실패:", error);
      alert("문항 삭제 중 오류가 발생했습니다.");
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="max-w-6xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          슈퍼유저 문항 관리
        </h1>
        {/* ✅ 문항 추가 폼 */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">새로운 문항 추가</h2>

          <select
            value={newQuestion.type}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, type: e.target.value })
            }
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="quantitative">정량 문항</option>
            <option value="qualitative">정성 문항</option>
          </select>

          {newQuestion.type === "quantitative" ? (
            <>
              <input
                type="number"
                placeholder="문항 번호"
                value={newQuestion.question_number}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    question_number: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                placeholder="문항 내용"
                value={newQuestion.question}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    question: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <TiptapEditor
                value={newQuestion.evaluation_criteria}
                onChange={(content) =>
                  setNewQuestion({
                    ...newQuestion,
                    evaluation_criteria: content,
                  })
                }
              />

              <input
                type="text"
                placeholder="법적 근거"
                value={newQuestion.legal_basis}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    legal_basis: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="number"
                placeholder="배점"
                value={newQuestion.score}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    score: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border rounded"
              />
            </>
          ) : (
            <>
              <input
                type="number"
                placeholder="문항 번호"
                value={newQuestion.question_number}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    question_number: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                placeholder="지표"
                value={newQuestion.indicator}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    indicator: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                placeholder="지표 정의"
                value={newQuestion.indicator_definition}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    indicator_definition: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <TiptapEditor
                value={newQuestion.evaluation_criteria}
                onChange={(content) =>
                  setNewQuestion({
                    ...newQuestion,
                    evaluation_criteria: content,
                  })
                }
              />

              <input
                type="text"
                placeholder="참고 정보"
                value={newQuestion.reference_info}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    reference_info: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border rounded"
              />
            </>
          )}

          <button onClick={handleAddQuestion} className="w-full btn-add">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            문항 추가하기
          </button>
        </div>
        {/* ✅ 수정 폼 (선택된 문항이 있을 때만 표시) */}
        {selectedQuestion && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">문항 수정</h2>
            <input
              type="number"
              placeholder="문항 번호"
              value={editedData.question_number}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  question_number: e.target.value,
                })
              }
              className="w-full p-2 mb-2 border rounded"
            />

            {/* ✅ 정량 문항 입력 필드 */}
            {selectedQuestion.type === "quantitative" ? (
              <>
                <input
                  type="text"
                  placeholder="문항 내용"
                  value={editedData.question}
                  onChange={(e) =>
                    setEditedData({ ...editedData, question: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                />
                <TiptapEditor
                  value={editedData.evaluation_criteria || ""} // ✅ 빈 값 방지
                  onChange={(content) => {
                    console.log("🔥 저장되는 HTML (수정폼):", content); // ✅ 디버깅 로그 추가
                    setEditedData({
                      ...editedData,
                      evaluation_criteria: content,
                    });
                  }}
                />

                <input
                  type="text"
                  placeholder="법적 근거"
                  value={editedData.legal_basis}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      legal_basis: e.target.value,
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="배점"
                  value={editedData.score}
                  onChange={(e) =>
                    setEditedData({ ...editedData, score: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                />
              </>
            ) : (
              // ✅ 정성 문항 입력 필드
              <>
                <input
                  type="text"
                  placeholder="지표"
                  value={editedData.indicator}
                  onChange={(e) =>
                    setEditedData({ ...editedData, indicator: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="지표 정의"
                  value={editedData.indicator_definition}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      indicator_definition: e.target.value,
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                />
                <TiptapEditor
                  value={editedData.evaluation_criteria || ""} // ✅ 빈 값 방지
                  onChange={(content) => {
                    console.log("🔥 저장되는 HTML (수정폼):", content); // ✅ 디버깅 로그 추가
                    setEditedData({
                      ...editedData,
                      evaluation_criteria: content,
                    });
                  }}
                />

                <input
                  type="text"
                  placeholder="참고 정보"
                  value={editedData.reference_info}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      reference_info: e.target.value,
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                />
              </>
            )}

            <button
              onClick={() =>
                handleEditSave(selectedQuestion.id, selectedQuestion.type)
              }
              className="w-full btn-save"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              수정된 문항 저장
            </button>
          </div>
        )}
        {/* ✅ 문항 리스트 */}
        <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">
          정량 문항 목록
        </h2>
        <div className="space-y-4">
          {quantitativeQuestions.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border hover:shadow-lg transition"
            >
              {/* 문항 번호 및 내용 */}
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-lg text-gray-700">
                  {q.question_number}.
                </span>
                <span className="text-gray-600">{q.question}</span>
              </div>

              {/* 수정 & 삭제 버튼 */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditStart(q, "quantitative")}
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition flex items-center"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-1" /> 수정
                </button>
                <button
                  onClick={() => handleDeleteQuestion(q.id, "quantitative")}
                  className="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition flex items-center"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1" /> 삭제
                </button>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-semibold mt-6 mb-4">정성 문항 목록</h2>
        <div className="space-y-4">
          {qualitativeQuestions.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border hover:shadow-lg transition"
            >
              {/* 문항 번호 및 내용 */}
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-lg text-gray-700">
                  {q.question_number}.
                </span>
                <span className="text-gray-600">{q.indicator}</span>
              </div>

              {/* 수정 & 삭제 버튼 */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditStart(q, "qualitative")}
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition flex items-center"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-1" /> 수정
                </button>
                <button
                  onClick={() => handleDeleteQuestion(q.id, "qualitative")}
                  className="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition flex items-center"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1" /> 삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SuperManageQuestions;
