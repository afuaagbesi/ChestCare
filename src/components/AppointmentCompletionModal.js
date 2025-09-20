// AppointmentCompletionModal.js
import React, { useState } from 'react';
import { FaCheck, FaTimes, FaClipboardCheck, FaStickyNote } from 'react-icons/fa';

const AppointmentCompletionModal = ({ 
  isOpen, 
  onClose, 
  onComplete, 
  appointment, 
  isDarkMode 
}) => {
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const completionData = {
      notes,
      diagnosis,
      followUpRequired,
      followUpDate: followUpRequired ? followUpDate : null,
      completedAt: new Date().toISOString()
    };
    
    try {
      await onComplete(appointment.id, completionData);
      // Reset form
      setNotes('');
      setDiagnosis('');
      setFollowUpRequired(false);
      setFollowUpDate('');
      onClose();
    } catch (error) {
      console.error('Error completing appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-lg shadow-xl p-6 w-full max-w-md mx-4 border`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaClipboardCheck className={`${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            } text-xl mr-3`} />
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>
              Complete Appointment
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`${
              isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            } transition-colors`}
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Appointment Info */}
        <div className={`${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        } rounded-lg p-3 mb-4`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Patient: <span className={`font-medium ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>{appointment?.patient_name || 'N/A'}</span>
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Date: <span className={`font-medium ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>{appointment?.date} at {appointment?.time}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Diagnosis */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Diagnosis
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter diagnosis..."
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>

          {/* Notes */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <FaStickyNote className="inline mr-1" />
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add completion notes (optional)..."
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border resize-none ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>

          {/* Follow-up Required */}
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={followUpRequired}
                onChange={(e) => setFollowUpRequired(e.target.checked)}
                className="sr-only"
              />
              <div className={`relative w-5 h-5 rounded border-2 mr-3 ${
                followUpRequired
                  ? isDarkMode ? 'bg-blue-600 border-blue-600' : 'bg-blue-500 border-blue-500'
                  : isDarkMode ? 'border-gray-600' : 'border-gray-300'
              }`}>
                {followUpRequired && (
                  <FaCheck className="absolute top-0.5 left-0.5 text-white text-xs" />
                )}
              </div>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Follow-up required
              </span>
            </label>
          </div>

          {/* Follow-up Date (conditional) */}
          {followUpRequired && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Follow-up Date
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                required
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors font-medium`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <FaCheck className="mr-2" />
                  Complete
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentCompletionModal;