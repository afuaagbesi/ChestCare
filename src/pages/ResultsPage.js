import React from "react";

function ResultsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold mb-4">Diagnostic Results</h1>
        <p className="text-lg mb-4">Disease: Pneumonia</p>
        <p className="text-lg mb-4">Confidence: 95%</p>
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-gray-600">Recommendation: Further examination is recommended.</p>
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 mt-4">
          Download Report
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;
