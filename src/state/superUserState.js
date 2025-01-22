import { atom } from "recoil";

// 시스템 데이터 상태
export const systemsState = atom({
  key: "systemsState",
  default: [], // 초기값: 빈 배열
});

// 관리자 데이터 상태
export const managersState = atom({
  key: "managersState",
  default: [], // 초기값: 빈 배열
});
