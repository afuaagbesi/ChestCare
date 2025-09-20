import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarPlus, FaUser, FaClock, FaStickyNote, FaSearch, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext'; // Import your auth context

const AppointmentBooking = ({ isDarkMode, onClose, onSuccess }) => {
  const { api, user } = useAuth(); // Use your auth context
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    appointment_type: 'consultation',
    notes: '',
    status: 'scheduled'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Appointment types
  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow_up', label: 'Follow Up' },
    { value: 'checkup', label: 'Check Up' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'screening', label: 'Screening' }
  ];

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/dashboard/api/patients/');
      
      if (response.status === 200) {
        const data = response.data;
        setPatients(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to load patients');
    }
  };

  // Filter patients based on search
  const filteredPatients = patients.filter(patient => 
    patient.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      setError('Please select a patient');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const appointmentData = {
        ...formData,
        patient: selectedPatient.id
      };

      const response = await api.post('/dashboard/api/create-appointment/', appointmentData);

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess && onSuccess(response.data);
          onClose && onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data) {
        // Handle validation errors from serializer
        const errors = Object.values(error.response.data).flat();
        setError(errors.join(', '));
      } else {
        setError('Failed to create appointment');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <motion.div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-md w-full mx-4 text-center`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-green-500 text-6xl mb-4">
            <FaCheck className="mx-auto" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Appointment Scheduled!
          </h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            The appointment has been successfully created.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaCalendarPlus className={`text-xl mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Book New Appointment
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Patient Selection */}
          <div className={`lg:w-1/2 p-6 border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} overflow-y-auto`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Select Patient
            </h3>
            
            {/* Search */}
            <div className="relative mb-4">
              <FaSearch className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Selected Patient Display */}
            {selectedPatient && (
              <div className={`mb-4 p-3 rounded-lg border ${isDarkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                      Selected: {selectedPatient.full_name}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {selectedPatient.email} • {selectedPatient.phone}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className={`text-red-500 hover:text-red-700`}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            )}

            {/* Patient List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPatient?.id === patient.id
                      ? isDarkMode
                        ? 'bg-blue-900/50 border-blue-600'
                        : 'bg-blue-100 border-blue-300'
                      : isDarkMode
                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <FaUser className={`mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {patient.full_name}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {patient.email} • {patient.phone || 'No phone'}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        patient.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : patient.status === 'diagnosed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.status_display || patient.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Form */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Appointment Details
            </h3>

            <div className="space-y-4">
              {/* Date */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={today}
                  required
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Time */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaClock className="inline mr-1" />
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Appointment Type */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Appointment Type
                </label>
                <select
                  name="appointment_type"
                  value={formData.appointment_type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {appointmentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaStickyNote className="inline mr-1" />
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any additional notes for the appointment..."
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !selectedPatient}
                  className={`px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                >
                  {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AppointmentBooking;
