import { useState, useEffect } from 'react';
import Wizard from './components/Wizard';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Test Plan Generator</h1>
          </div>
          <nav className="space-x-4 flex items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium">Reset</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-12 p-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">Generate Production-Ready Test Plans</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Connect your Jira requirements and let our AI Agent architect the perfect test strategy for your API.
          </p>
        </div>

        <Wizard />
      </main>
    </div>
  )
}

export default App
