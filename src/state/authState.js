import { atom } from "recoil";

// 일반 사용자 로그인 상태
export const authState = atom({
  key: "authState",
  default: {
    isLoggedIn: false, // 로그인 상태
    user: null, // 로그인된 사용자 정보
  },
});

// 관리자 로그인 상태
export const expertAuthState = atom({
  key: "expertAuthState",
  default: {
    isLoggedIn: false, // 관리자 로그인 여부
    user: null, // 로그인된 관리자 정보
  },
});

// 슈퍼유저 로그인 상태
export const superUserAuthState = atom({
  key: "superUserAuthState",
  default: {
    isLoggedIn: false, // 슈퍼유저 로그인 여부
    user: null, // 로그인된 슈퍼유저 정보
  },
});
