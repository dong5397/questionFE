import { atom } from "recoil";
// 🔹 정성 피드백 상태
export const qualitativeFeedbackState = atom({
  key: "qualitativeFeedbackState",
  default: {}, // 초기값은 빈 객체
});

// 🔹 정량 피드백 상태
export const quantitativeFeedbackState = atom({
  key: "quantitativeFeedbackState",
  default: {}, // 초기값은 빈 객체
});
