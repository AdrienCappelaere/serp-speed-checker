import React from 'react';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-lg font-bold">SERP Speed Checker</h1>
      </header>
      <main className="flex-grow p-6">{children}</main>
      <footer className="bg-gray-800 text-white text-center p-4">
        © 2025 SERP Speed Checker
      </footer>
    </div>
  );
}

export default Layout;
