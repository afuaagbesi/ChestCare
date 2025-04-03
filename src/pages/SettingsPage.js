import React, { useState } from "react";

function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
          Notification Settings
        </h2>
        
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label htmlFor="notifications" className="text-lg">Enable Notifications</label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                id="notifications"
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="opacity-0 w-0 h-0"
              />
              <span 
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                  notifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              ></span>
              <span 
                className={`absolute h-5 w-5 bg-white rounded-full transition-all duration-300 ${
                  notifications ? 'transform translate-x-6' : 'transform translate-x-1'
                } top-0.5`}
              ></span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label htmlFor="autoSave" className="text-lg">Auto-Save Results</label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                id="autoSave"
                type="checkbox"
                checked={autoSave}
                onChange={() => setAutoSave(!autoSave)}
                className="opacity-0 w-0 h-0"
              />
              <span 
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                  autoSave ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              ></span>
              <span 
                className={`absolute h-5 w-5 bg-white rounded-full transition-all duration-300 ${
                  autoSave ? 'transform translate-x-6' : 'transform translate-x-1'
                } top-0.5`}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Application Settings</h2>
        
        <div className="mb-4">
          <label htmlFor="language" className="block text-lg mb-2">Language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>

      <div className="max-w-2xl flex justify-end mt-8">
        <button className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-6 rounded-lg mr-4 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
          Cancel
        </button>
        <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;