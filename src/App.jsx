import React from 'react';
import MainPage from './pages/MainPage';

function App() {
  return (
    <div className="flex-col md:flex justify-between min-h-screen">
      <div>
        <header className="border-b">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-2xl font-bold">AdriSEO Tools</h1>
          </div>
        </header>
        <main className="">
          <MainPage />
        </main>
      </div>
      <footer className="bg-zinc-900 text-xs text-white p-4">
        © 2025 AdriSEO Tools
      </footer>
    </div>
  );
}

export default App;
