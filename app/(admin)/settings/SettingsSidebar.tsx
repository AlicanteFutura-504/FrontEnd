import React, { useState, useEffect } from 'react';

export default function SettingsSidebar() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', String(darkMode));
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <div className="p-4 w-64 bg-white dark:bg-gray-800 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Ajustes</h2>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        {darkMode ? 'Modo claro' : 'Modo oscuro'}
      </button>
    </div>
  );
}
