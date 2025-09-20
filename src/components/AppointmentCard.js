// components/AppointmentCard.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaClock, 
  FaPhone, 
  FaEnvelope, 
  FaEllipsisV, 
  FaTimes, 
  FaRedo, 
  FaCheck, 
  FaStethoscope,
  FaHeart,
  FaThermometer,
  FaLungs
} from 'react-icons/fa';

const AppointmentCard = ({ 
  appointment, 
  isDarkMode, 
  onCancel, 
  onReschedule, 
  onComplete,
  showActions = true 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
    notes: ''
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return isDarkMode ? 'bg-blue-900/30 text-blue-300 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return isDarkMode ? 'bg-green-900/30 text-green-300 border-green-700' : 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return isDarkMode ? 'bg-red-900/30 text-red-300 border-red-700' : 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled':
        return isDarkMode ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' : 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return isDarkMode ? 'bg-gray-900/30 text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const normalizeDate = (d) => {
  if (!d) return d;
  // If already ISO YYYY-MM-DD, return
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  // If DD/MM/YYYY -> convert to YYYY-MM-DD
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(d)) {
    const [dd, mm, yyyy] = d.split('/');
    return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`;
  }
  // Try Date parsing fallback (may be environment dependent)
  const parsed = new Date(d);
  if (!isNaN(parsed)) return parsed.toISOString().split('T')[0];
  return d;
};

const normalizeTime = (t) => {
  if (!t) return t;
  // If already HH:MM:SS, return
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;
  // If HH:MM -> add seconds
  if (/^\d{1,2}:\d{2}$/.test(t)) {
    const [hh, mm] = t.split(':');
    return `${hh.padStart(2,'0')}:${mm}:${'00'}`;
  }
  // fallback: return as-is
  return t;
};
  // Get appointment type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'consultation':
        return <FaStethoscope className="text-blue-500" />;
      case 'follow_up':
        return <FaRedo className="text-green-500" />;
      case 'checkup':
        return <FaHeart className="text-red-500" />;
      case 'emergency':
        return <FaThermometer className="text-orange-500" />;
      case 'screening':
        return <FaLungs className="text-purple-500" />;
      default:
        return <FaCalendarAlt className="text-gray-500" />;
    }
  };

  // Handle reschedule submit
const handleRescheduleSubmit = async () => {
    if (!rescheduleData.date || !rescheduleData.time) {
    alert('Please select both date and time');
    return;
  }

    const payload = {
    date: normalizeDate(rescheduleData.date),
    time: normalizeTime(rescheduleData.time),
    notes: rescheduleData.notes || ''
  };

    const result = await onReschedule(appointment.id, payload.date, payload.time, payload.notes);
    if (result.success) {
      setShowRescheduleForm(false);
      setRescheduleData({ date: '', time: '', notes: '' });
    } else {
      alert(result.error);
    }
  };

  // Format date and time
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <motion.div
      className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4 hover:shadow-lg transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      {/* Header with patient info and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Patient Avatar */}
          <div className="relative">
            {appointment.patient_detail?.profile_image_url ? (
              <img
                src={appointment.patient_detail.profile_image_url}
                alt={appointment.patient_detail?.full_name || 'Patient'}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              />
            ) : (
              <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                <FaUser className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            )}
            
            {/* Online status indicator (optional) */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>

          {/* Patient Details */}
          <div>
            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {appointment.patient_detail?.full_name || 'Unknown Patient'}
            </h4>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {appointment.patient_detail?.phone && (
                <div className="flex items-center">
                  <FaPhone className="mr-1 text-xs" />
                  {appointment.patient_detail.phone}
                </div>
              )}
              {appointment.patient_detail?.email && (
                <div className="flex items-center">
                  <FaEnvelope className="mr-1 text-xs" />
                  {appointment.patient_detail.email}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge and Menu */}
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
            {appointment.status_display || appointment.status}
          </span>
          
          {showActions && appointment.status !== 'completed' && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <FaEllipsisV className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
              
              {showMenu && (
                <div className={`absolute right-0 mt-2 w-48 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-lg shadow-lg border z-10`}>
                  <button
                    onClick={() => {
                      setShowRescheduleForm(true);
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} flex items-center`}
                  >
                    <FaRedo className="mr-2" />
                    Reschedule
                  </button>
                  
                  {appointment.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        onComplete(appointment.id);
                        setShowMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} flex items-center`}
                    >
                      <FaCheck className="mr-2" />
                      Mark Complete
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      onCancel(appointment.id);
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center`}
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details */}
      <div className="space-y-2">
        {/* Date and Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaCalendarAlt className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {formatDate(appointment.date)}
              </span>
            </div>
            <div className="flex items-center">
              <FaClock className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {formatTime(appointment.time)}
              </span>
            </div>
          </div>

          {/* Appointment Type */}
          <div className="flex items-center">
            {getTypeIcon(appointment.appointment_type)}
            <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {appointment.appointment_type_display || appointment.appointment_type}
            </span>
          </div>
        </div>

        {/* Notes */}
        {appointment.notes && (
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 p-2 rounded ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <strong>Notes:</strong> {appointment.notes}
          </div>
        )}

        {/* Patient Health Status */}
        {appointment.patient_detail?.status && (
          <div className="flex items-center mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              appointment.patient_detail.status === 'diagnosed'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                : appointment.patient_detail.status === 'recovered'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
            }`}>
              Patient Status: {appointment.patient_detail.status_display || appointment.patient_detail.status}
            </span>
          </div>
        )}
      </div>

      {/* Reschedule Form */}
      {showRescheduleForm && (
        <div className={`mt-4 p-4 border rounded-lg ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <h5 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Reschedule Appointment
          </h5>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="date"
              value={rescheduleData.date}
              onChange={(e) => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className={`px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} text-sm`}
            />
            <input
              type="time"
              value={rescheduleData.time}
              onChange={(e) => setRescheduleData(prev => ({ ...prev, time: e.target.value }))}
              className={`px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} text-sm`}
            />
          </div>
          
          <textarea
            placeholder="Reason for rescheduling (optional)"
            value={rescheduleData.notes}
            onChange={(e) => setRescheduleData(prev => ({ ...prev, notes: e.target.value }))}
            rows={2}
            className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'} text-sm mb-3`}
          />
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setShowRescheduleForm(false);
                setRescheduleData({ date: '', time: '', notes: '' });
              }}
              className={`px-3 py-1 text-sm border rounded ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
            <button
              onClick={handleRescheduleSubmit}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reschedule
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AppointmentCard;