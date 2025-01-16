import React from "react";

function Nav() {
  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-lg font-bold">
          개인정보 컴플라이언스 강화 플랫폼
        </div>
        <nav className="flex space-x-4">
          <a href="/" className="hover:underline">
            로그인
          </a>
          <a href="/dashboard" className="hover:underline">
            마이페이지
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Nav;
