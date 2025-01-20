import { atom } from "recoil";

export const authState = atom({
  key: "authState",
  default: {
    isLoggedIn: false, // 로그인 상태
    isExpertLoggedIn: false, // 관리자 여부
    user: null, // 로그인된 사용자 정보
  },
});
