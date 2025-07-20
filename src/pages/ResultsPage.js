import React from "react";

function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Diagnostic Results
          </h2>

          {/* Results Summary */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Primary Diagnosis
                </h3>
                <p className="text-gray-700 dark:text-gray-300">Pneumonia</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Confidence Score
                </h3>
                <p className="text-gray-700 dark:text-gray-300">95%</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Recommendations
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">
                Further examination is recommended. Consider additional tests to confirm diagnosis.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600">
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
