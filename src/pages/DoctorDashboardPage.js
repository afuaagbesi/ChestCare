import React, { useState, useEffect, useMemo, useRef } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend } from "chart.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import { FaHeart, FaStethoscope, FaThermometer, FaLungs, FaCalendarAlt, FaChartLine, FaChartBar, FaFilter, FaInfoCircle, FaPlus } from "react-icons/fa";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {
  Card,
  Title,
  Text,
  Metric,
  BarChart,
  Subtitle,
  Flex,
  ProgressBar,
  Grid,
  Col
} from "@tremor/react";
import { useDarkMode } from "../contexts/DarkModeContext";
import AppointmentBooking from '../components/AppointmentBooking';
import AppointmentCard from '../components/AppointmentCard'; // New import
import { useAppointments } from '../hooks/useAppointments'; // New import
import AppointmentCompletionModal from '../components/AppointmentCompletionModal';

// Registering chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

function DoctorDashboardPage() {
  const { isDarkMode } = useDarkMode();
  
  // Use the new appointments hook
  const {
    appointments,
    todayAppointments,
    upcomingAppointments,
    loading: appointmentsLoading,
    error: appointmentsError,
    fetchAppointments,
    fetchTodayAppointments,
    fetchUpcomingAppointments,
    cancelAppointment,
    rescheduleAppointment,
    completeAppointment
  } = useAppointments();

  const [patientStats, setPatientStats] = useState({
    cardiomegaly: 0,
    pneumonia: 0,
    tuberculosis: 0,
    pulmonaryHypertension: 0,
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedDisease, setSelectedDisease] = useState("cardiomegaly");
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
const [selectedAppointmentForCompletion, setSelectedAppointmentForCompletion] = useState(null);

  const months = ["All", "January", "February", "March", "April", "May", "June"];

  // Fetch appointments on component mount and when date changes
  useEffect(() => {
    fetchUpcomingAppointments(30); // Fetch appointments for next 30 days
    fetchTodayAppointments();
  }, []);

  // Filter appointments based on selected date
  const filteredAppointments = useMemo(() => {
    if (!upcomingAppointments.length) return [];
    
    return upcomingAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const matchesDate = selectedDate ? 
        appointmentDate.toDateString() === selectedDate.toDateString() : 
        true;
      
      return matchesDate;
    });
  }, [upcomingAppointments, selectedDate]);

  // Handle successful appointment creation
  const handleAppointmentSuccess = (appointment) => {
    console.log('New appointment created:', appointment);
    
    // Refresh appointments
    fetchUpcomingAppointments(30);
    fetchTodayAppointments();
    setShowAppointmentBooking(false);
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this appointment?');
    if (confirmCancel) {
      const result = await cancelAppointment(appointmentId, 'Cancelled by doctor');
      if (result.success) {
        alert('Appointment cancelled successfully');
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  // Handle appointment rescheduling
  const handleRescheduleAppointment = async (appointmentId, newDate, newTime, notes) => {
    return await rescheduleAppointment(appointmentId, newDate, newTime, notes);
  };

// Handle appointment completion
const handleCompleteAppointment = async (appointmentId) => {
  const appointment = filteredAppointments.find(apt => apt.id === appointmentId);
  setSelectedAppointmentForCompletion(appointment);
  setShowCompletionModal(true);
};

// Handle modal completion submission
const handleModalCompletion = async (appointmentId, completionData) => {
  const result = await completeAppointment(appointmentId, completionData.notes);
  if (result.success) {
    alert('Appointment marked as completed');
    setShowCompletionModal(false);
    setSelectedAppointmentForCompletion(null);
  } else {
    alert(`Error: ${result.error}`);
    throw new Error(result.error);
  }
};

  // Disease facts content
  const diseaseFacts = {
    cardiomegaly: {
      title: "Cardiomegaly Facts",
      definition: "Cardiomegaly refers to an enlarged heart, which is not a disease but a sign of another condition.",
      causes: "Common causes include high blood pressure, coronary artery disease, heart valve problems, cardiomyopathy, and congenital heart defects.",
      symptoms: "Symptoms may include shortness of breath, swelling in legs, irregular heartbeat, dizziness, and fatigue.",
      treatment: "Treatment focuses on the underlying cause and may include medications, lifestyle changes, and in some cases, surgery.",
      notes: "Regular cardiovascular checkups are essential for early detection, especially for patients with risk factors."
    },
    pneumonia: {
      title: "Pneumonia Facts",
      definition: "Pneumonia is an infection that inflames the air sacs in one or both lungs, which may fill with fluid.",
      causes: "Caused by bacteria, viruses, and fungi. The most common bacterial pneumonia is caused by Streptococcus pneumoniae.",
      symptoms: "Symptoms include cough with phlegm, fever, chills, difficulty breathing, chest pain, and fatigue.",
      treatment: "Treatment depends on the cause - antibiotics for bacterial pneumonia, antivirals for some types of viral pneumonia, and antifungals for fungal pneumonia.",
      notes: "Pneumonia can be life-threatening, especially for infants, elderly, and those with weakened immune systems or chronic conditions."
    },
    tuberculosis: {
      title: "Tuberculosis Facts",
      definition: "Tuberculosis (TB) is a potentially serious infectious disease that mainly affects the lungs.",
      causes: "Caused by Mycobacterium tuberculosis bacteria that spread through the air when infected people cough, sneeze or spit.",
      symptoms: "Symptoms include a severe cough that lasts weeks, chest pain, coughing up blood, fatigue, fever, night sweats, and weight loss.",
      treatment: "Treatment involves taking antibiotics for at least 6 to 9 months. Multiple drugs are used to reduce the risk of bacteria developing antibiotic resistance.",
      notes: "Latent TB infection can exist without symptoms and is not contagious, but can develop into active TB disease if not treated."
    },
    pulmonary: {
      title: "Pulmonary Hypertension Facts",
      definition: "Pulmonary hypertension is high blood pressure in the arteries of the lungs that can lead to heart failure.",
      causes: "Can be caused by various conditions including certain heart diseases, lung diseases, blood clots in the lungs, sleep apnea, and certain drugs or toxins.",
      symptoms: "Symptoms include shortness of breath during activity, fatigue, dizziness, chest pain, swelling in ankles and legs, and bluish lips or skin.",
      treatment: "Treatment may include medications to relax blood vessels, diuretics, oxygen therapy, and in severe cases, lung or heart-lung transplantation.",
      notes: "Early diagnosis is crucial as the condition can worsen rapidly. Regular monitoring is essential for patients with risk factors."
    }
  };

  // Generate monthly data with more variance for filtered view
  const generateMonthlyData = (month) => {
    if (month === "All") {
      return {
        cardiomegaly: [5, 8, 6, 9, 10, 7],
        pneumonia: [4, 6, 5, 7, 8, 5],
        tuberculosis: [2, 4, 3, 5, 6, 4],
        pulmonaryHypertension: [1, 2, 3, 2, 1, 3]
      };
    }
    
    const monthIndex = months.indexOf(month) - 1;
    if (monthIndex < 0) return null;
    
    return {
      cardiomegaly: [0, 0, 0, 0, 0, 0].map((_, i) => i === monthIndex ? [5, 8, 6, 9, 10, 7][monthIndex] : 0),
      pneumonia: [0, 0, 0, 0, 0, 0].map((_, i) => i === monthIndex ? [4, 6, 5, 7, 8, 5][monthIndex] : 0),
      tuberculosis: [0, 0, 0, 0, 0, 0].map((_, i) => i === monthIndex ? [2, 4, 3, 5, 6, 4][monthIndex] : 0),
      pulmonaryHypertension: [0, 0, 0, 0, 0, 0].map((_, i) => i === monthIndex ? [1, 2, 3, 2, 1, 3][monthIndex] : 0)
    };
  };

  // Memoizing chart data with month filtering
  const chartData = useMemo(() => {
    const monthlyData = generateMonthlyData(selectedMonth);
    
    return {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Cardiomegaly",
          data: selectedMonth === "All" ? monthlyData.cardiomegaly : monthlyData.cardiomegaly,
          fill: false,
          borderColor: "#FF6384",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: "Pneumonia",
          data: selectedMonth === "All" ? monthlyData.pneumonia : monthlyData.pneumonia,
          fill: false,
          borderColor: "#36A2EB",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: "Tuberculosis",
          data: selectedMonth === "All" ? monthlyData.tuberculosis : monthlyData.tuberculosis,
          fill: false,
          borderColor: "#4BC0C0",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: "Pulmonary Hypertension",
          data: selectedMonth === "All" ? monthlyData.pulmonaryHypertension : monthlyData.pulmonaryHypertension,
          fill: false,
          borderColor: "#FFCD56",
          backgroundColor: "rgba(255, 205, 86, 0.2)",
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    };
  }, [selectedMonth]);

  // Update patient stats based on selected month
  useEffect(() => {
    if (selectedMonth === "All") {
      setPatientStats({
        cardiomegaly: 23,
        pneumonia: 35,
        tuberculosis: 17,
        pulmonaryHypertension: 10,
      });
    } else {
      const monthIndex = months.indexOf(selectedMonth) - 1;
      if (monthIndex >= 0) {
        const monthMultiplier = [0.8, 1.2, 0.9, 1.1, 1.3, 0.7][monthIndex];
        setPatientStats({
          cardiomegaly: Math.round(23 * monthMultiplier),
          pneumonia: Math.round(35 * monthMultiplier),
          tuberculosis: Math.round(17 * monthMultiplier),
          pulmonaryHypertension: Math.round(10 * monthMultiplier),
        });
      }
    }
  }, [selectedMonth]);

  // Chart options for better visualization - updated for dark mode
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          },
          color: isDarkMode ? '#e2e8f0' : '#1f2937'
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: isDarkMode ? 'rgba(100, 116, 139, 0.2)' : 'rgba(200, 200, 200, 0.2)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12
          },
          color: isDarkMode ? '#cbd5e1' : '#374151'
        },
        grid: {
          color: isDarkMode ? 'rgba(71, 85, 105, 0.2)' : 'rgba(200, 200, 200, 0.2)'
        },
        border: {
          color: isDarkMode ? '#475569' : '#d1d5db'
        }
      },
      x: {
        ticks: {
          font: {
            size: 12
          },
          color: isDarkMode ? '#cbd5e1' : '#374151'
        },
        grid: {
          display: false
        },
        border: {
          color: isDarkMode ? '#475569' : '#d1d5db'
        }
      }
    }
  }), [isDarkMode]);

  // Use ref to store the chart instance
  const chartRef = useRef();

  useEffect(() => {
    const currentChart = chartRef.current;
    return () => {
      if (currentChart) {
        currentChart.destroy();
      }
    };
  }, [chartRef]);

  // Custom tab styling - improved layout with more spacing and dark mode
  const customTabStyles = useMemo(() => ({
    tabList: "flex justify-between mb-6 border-b-2 border-blue-500 dark:border-blue-600 overflow-x-auto scrollbar-hide w-full",
    tab: `py-4 px-8 font-medium flex items-center justify-center ${
      isDarkMode 
        ? 'text-gray-300 bg-gray-800/80' 
        : 'text-gray-700 bg-gray-100'
    } border-b-2 border-transparent cursor-pointer transition-all duration-200 whitespace-nowrap inline-block rounded-t-lg mx-1 shadow-sm ${
      isDarkMode 
        ? 'hover:text-blue-300 hover:border-blue-400 hover:bg-blue-900/30' 
        : 'hover:text-blue-600 hover:border-blue-500 hover:bg-blue-100'
    }`,
    selectedTab: `py-4 px-8 font-semibold flex items-center justify-center shadow-md rounded-t-lg mx-1 ${
      isDarkMode 
        ? 'text-white border-b-2 border-blue-500 bg-gray-700 hover:bg-gray-600' 
        : 'text-white border-b-2 border-blue-600 bg-blue-600 hover:bg-blue-500'
    }`,
    tabPanel: "py-4"
  }), [isDarkMode]);

  // Icons for each disease
  const diseaseIcons = {
    cardiomegaly: <FaHeart className="text-red-500 dark:text-red-400 mr-2 text-lg" />,
    pneumonia: <FaStethoscope className="text-blue-500 dark:text-blue-400 mr-2 text-lg" />,
    tuberculosis: <FaThermometer className="text-green-500 dark:text-green-400 mr-2 text-lg" />,
    pulmonary: <FaLungs className="text-yellow-500 dark:text-yellow-400 mr-2 text-lg" />
  };

  // Handle tab change
  const handleTabSelect = (index) => {
    const diseaseTypes = ["cardiomegaly", "pneumonia", "tuberculosis", "pulmonary"];
    setSelectedDisease(diseaseTypes[index]);
  };

  // Custom CSS for calendar to fix white date issue with dark mode support
  const calendarStyles = `
    .react-calendar {
      width: 100%;
      border-radius: 0.5rem;
      border: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
      font-family: Inter, system-ui, sans-serif;
      background-color: ${isDarkMode ? '#1f2937' : '#ffffff'};
      color: ${isDarkMode ? '#e5e7eb' : '#374151'};
    }
    
    .react-calendar__navigation {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      background: transparent;
    }
    
    .react-calendar__navigation button {
      min-width: 32px;
      height: 32px;
      background: transparent !important;
      color: ${isDarkMode ? '#e5e7eb' : '#1f2937'} !important;
      border: none;
      padding: 0;
      margin: 0 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }
    
    .react-calendar__navigation__label {
      font-weight: 500 !important;
      font-size: 1rem !important;
      padding: 0 1rem !important;
      flex-grow: 0 !important;
      background: transparent !important;
      border: none !important;
      color: ${isDarkMode ? '#e5e7eb' : '#1f2937'} !important;
    }
    
    .react-calendar__navigation__arrow {
      font-size: 1.25rem;
      color: ${isDarkMode ? '#e5e7eb' : '#1f2937'} !important;
    }
    
    .react-calendar__navigation__prev2-button,
    .react-calendar__navigation__next2-button {
      display: none !important;
    }
    
    .react-calendar__month-view__weekdays {
      text-align: center;
      text-transform: uppercase;
      font-weight: 600;
      font-size: 0.75rem;
      padding: 0.5rem 0;
    }
    
    .react-calendar__month-view__weekdays__weekday {
      padding: 0.5rem;
      color: #ffffff !important;
    }
    
    .react-calendar__tile {
      padding: 0.75rem 0.5rem;
      font-weight: 500;
      background: transparent !important;
    }
    
    .react-calendar__tile:enabled {
      color: ${isDarkMode ? '#e5e7eb' : '#374151'} !important;
    }
    
    .react-calendar__tile:disabled {
      color: ${isDarkMode ? '#6b7280' : '#9ca3af'} !important;
    }
    
    .react-calendar__tile:enabled:hover {
      background-color: ${isDarkMode ? '#374151' : '#f3f4f6'} !important;
    }
    
    .react-calendar__tile--now {
      background: ${isDarkMode ? '#1e40af40' : '#dbeafe'} !important;
      color: ${isDarkMode ? '#93c5fd' : '#2563eb'} !important;
      font-weight: 600;
    }
    
    .react-calendar__tile--active {
      background: ${isDarkMode ? '#2563eb' : '#3b82f6'} !important;
      color: white !important;
      font-weight: 600;
    }
    
    .react-calendar__tile--active:hover {
      background: ${isDarkMode ? '#1d4ed8' : '#2563eb'} !important;
    }
    
    .react-calendar__month-view__days__day--weekend {
      color: ${isDarkMode ? '#fb7185' : '#e11d48'} !important;
    }
    
    .react-calendar__month-view__days__day--neighboringMonth {
      color: ${isDarkMode ? '#4b5563' : '#9ca3af'} !important;
    }
    
    .react-calendar__tile--active.react-calendar__month-view__days__day--weekend {
      color: white !important;
    }
  `;

const tabOverrideStyles = `
  .react-tabs__tab-list {
    display: flex !important;
    border-bottom: 2px solid ${isDarkMode ? '#3b82f6' : '#3b82f6'} !important;
    margin-bottom: 1.5rem !important;
    overflow-x: auto !important;
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
    flex-wrap: nowrap !important;
  }

  .react-tabs__tab-list::-webkit-scrollbar {
    display: none !important;
  }

  .react-tabs__tab {
    background-color: ${isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#f3f4f6'} !important;
    color: ${isDarkMode ? '#d1d5db' : '#374151'} !important;
    border: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'} !important;
    border-bottom: none !important;
    border-radius: 0.5rem 0.5rem 0 0 !important;
    margin: 0 0.25rem !important;
    padding: 1rem 2rem !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    min-width: auto !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .react-tabs__tab {
      padding: 0.75rem 1rem !important;
      font-size: 0.875rem !important;
    }
    
    .react-tabs__tab span {
      display: none !important;
    }
  }

  @media (max-width: 640px) {
    .react-tabs__tab {
      padding: 0.5rem 0.75rem !important;
      margin: 0 0.125rem !important;
    }
  }

  .react-tabs__tab:hover {
    background-color: ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : '#dbeafe'} !important;
    color: ${isDarkMode ? '#93c5fd' : '#2563eb'} !important;
  }

  .react-tabs__tab--selected {
    background-color: ${isDarkMode ? '#374151' : '#3b82f6'} !important;
    color: white !important;
    border-color: ${isDarkMode ? '#3b82f6' : '#3b82f6'} !important;
    font-weight: 600 !important;
  }

  .react-tabs__tab--selected:hover {
    background-color: ${isDarkMode ? '#4b5563' : '#2563eb'} !important;
    color: white !important;
  }

  .react-tabs__tab-panel {
    padding: 1rem 0 !important;
  }
`;

  // Doctor name could come from a global state, context, or prop
  const doctorName = "Smith";
  
  return (
   <div className={`${isDarkMode 
    ? 'bg-gray-900 text-gray-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black' 
    : 'bg-white text-gray-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-gray-50'
  } w-full min-h-screen`}>
      {/* Custom calendar styles */}
      <style>{calendarStyles}</style>
      <style>{tabOverrideStyles}</style>

      
      {/* Month Filter */}
      <div className="flex items-center justify-between mb-4 px-6 pt-4">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Dashboard</h2>
        <div className="flex items-center">
          <FaFilter className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
          <select
            className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-700'} border rounded-md py-2 px-4 focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-blue-400' : 'focus:ring-blue-500'}`}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Doctor's Schedule Section */}
        <motion.div
          className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 col-span-1 border`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaCalendarAlt className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-xl mr-2`} />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Doctor's Schedule</h3>
            </div>
            <button
              onClick={() => setShowAppointmentBooking(true)}
              className={`flex items-center px-3 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors text-sm`}
              title="Book New Appointment"
            >
              <FaPlus className="mr-1" />
              Book
            </button>
          </div>
          
          <Calendar 
            className="my-4 rounded-lg"
            onChange={setSelectedDate}
            value={selectedDate}
          />
          
          {/* Updated Appointments List Section */}
          <div className="mt-5">
            <div className="mb-4">
              <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {selectedDate ? `Appointments for ${selectedDate.toDateString()}` : 'Upcoming Appointments'}
              </h4>
              {appointmentsLoading && (
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading appointments...</p>
              )}
              {appointmentsError && (
                <p className="text-sm text-red-500">{appointmentsError}</p>
              )}
            </div>
            
            {/* Appointments List */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    isDarkMode={isDarkMode}
                    onCancel={handleCancelAppointment}
                    onReschedule={handleRescheduleAppointment}
                    onComplete={handleCompleteAppointment}
                    showActions={true}
                  />
                ))
              ) : (
                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FaCalendarAlt className="mx-auto text-3xl mb-2 opacity-50" />
                  <p>No appointments found for selected date</p>
                  <button
                    onClick={() => setShowAppointmentBooking(true)}
                    className={`mt-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors text-sm`}
                  >
                    Schedule New Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Disease Statistics and Cases */}
        <motion.div
          className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 col-span-1 lg:col-span-2 border`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Tabs onSelect={handleTabSelect}>
            <TabList >
            <Tab >
              <div className="flex items-center">
                {diseaseIcons.cardiomegaly} 
                <span>Cardiomegaly</span>
              </div>
            </Tab>
            <Tab >
              <div className="flex items-center">
                {diseaseIcons.pneumonia} 
                <span>Pneumonia</span>
              </div>
            </Tab>
            <Tab >
              <div className="flex items-center">
                {diseaseIcons.tuberculosis} 
                <span>Tuberculosis</span>
              </div>
            </Tab>
            <Tab >
              <div className="flex items-center">
                {diseaseIcons.pulmonary} 
                <span>Pulmonary Hypertension</span>
              </div>
            </Tab>
          </TabList>

            <TabPanel className={customTabStyles.tabPanel}>
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className={`flex items-center ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} p-4 rounded-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${isDarkMode ? 'hover:bg-red-900/40' : 'hover:bg-red-100'} cursor-pointer border ${isDarkMode ? 'border-red-800/30 hover:border-red-700/50' : 'border-red-200 hover:border-red-300'}`}>
                  <FaHeart className={`text-4xl ${isDarkMode ? 'text-red-400' : 'text-red-500'} mr-4`} />
                  <div>
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Cardiomegaly</h3>
                    <p className={`text-3xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{patientStats.cardiomegaly} Cases</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>16% increase this month</p>
                  </div>
                </div>
                <div className="w-full lg:w-2/3 h-64">
                  <Line 
                    data={{
                      labels: chartData.labels,
                      datasets: [chartData.datasets[0]]
                    }} 
                    options={chartOptions} 
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel className={customTabStyles.tabPanel}>
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className={`flex items-center ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'} p-4 rounded-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${isDarkMode ? 'hover:bg-blue-900/40' : 'hover:bg-blue-100'} cursor-pointer border ${isDarkMode ? 'border-blue-800/30 hover:border-blue-700/50' : 'border-blue-200 hover:border-blue-300'}`}>
                  <FaStethoscope className={`text-4xl ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-4`} />
                  <div>
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Pneumonia</h3>
                    <p className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{patientStats.pneumonia} Cases</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>8% increase this month</p>
                  </div>
                </div>
                <div className="w-full lg:w-2/3 h-64">
                  <Line 
                    data={{
                      labels: chartData.labels,
                      datasets: [chartData.datasets[1]]
                    }} 
                    options={chartOptions} 
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel className={customTabStyles.tabPanel}>
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className={`flex items-center ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'} p-4 rounded-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${isDarkMode ? 'hover:bg-green-900/40' : 'hover:bg-green-100'} cursor-pointer border ${isDarkMode ? 'border-green-800/30 hover:border-green-700/50' : 'border-green-200 hover:border-green-300'}`}>
                  <FaThermometer className={`text-4xl ${isDarkMode ? 'text-green-400' : 'text-green-500'} mr-4`} />
                  <div>
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Tuberculosis</h3>
                    <p className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{patientStats.tuberculosis} Cases</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>5% decrease this month</p>
                  </div>
                </div>
                <div className="w-full lg:w-2/3 h-64">
                  <Line 
                    data={{
                      labels: chartData.labels,
                      datasets: [chartData.datasets[2]]
                    }} 
                    options={chartOptions} 
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel className={customTabStyles.tabPanel}>
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className={`flex items-center ${isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'} p-4 rounded-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${isDarkMode ? 'hover:bg-yellow-900/40' : 'hover:bg-yellow-100'} cursor-pointer border ${isDarkMode ? 'border-yellow-800/30 hover:border-yellow-700/50' : 'border-yellow-200 hover:border-yellow-300'}`}>
                  <FaLungs className={`text-4xl ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} mr-4`} />
                  <div>
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Pulmonary Hypertension</h3>
                    <p className={`text-3xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>{patientStats.pulmonaryHypertension} Cases</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>3% increase this month</p>
                  </div>
                </div>
                <div className="w-full lg:w-2/3 h-64">
                  <Line 
                    data={{
                      labels: chartData.labels,
                      datasets: [chartData.datasets[3]]
                    }} 
                    options={chartOptions} 
                  />
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.div
        className="px-6 pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex items-center mb-4">
          <FaChartLine className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-xl mr-2`} />
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Patient Disease Trends</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart showing disease trends over months */}
          <motion.div
            className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <FaChartLine className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-2`} />
              <h4 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Monthly Trends</h4>
            </div>
            <div className="h-72">
              <Line data={chartData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Bar Chart showing overall disease count */}
          <motion.div
            className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <FaChartBar className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-2`} />
              <h4 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Disease Comparison</h4>
            </div>
            <div className="h-72">
              <Bar 
                ref={chartRef} 
                data={chartData} 
                options={{
                  ...chartOptions,
                  indexAxis: 'y'
                }} 
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Statistics Cards Section */}
      <div className="px-6 pb-6">
        <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mb-6">
          <Card className="dark:bg-dark-card">
            <Flex>
              <div>
                <Title>Total Patients</Title>
                <Metric>1,234</Metric>
              </div>
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </Flex>
            <Text className="mt-4">7% increase from last month</Text>
          </Card>
          
          <Card className="dark:bg-dark-card">
            <Flex>
              <div>
                <Title>Analyzed X-rays</Title>
                <Metric>2,862</Metric>
              </div>
              <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </Flex>
            <Text className="mt-4">12% increase from last month</Text>
          </Card>
          
          <Card className="dark:bg-dark-card">
            <Flex>
              <div>
                <Title>Detection Rate</Title>
                <Metric>94.3%</Metric>
              </div>
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </Flex>
            <Text className="mt-4">2.4% increase from last month</Text>
          </Card>
        </Grid>
      </div>

      {/* Appointment Booking Modal */}
      {showAppointmentBooking && (
        <AppointmentBooking
          isDarkMode={isDarkMode}
          onClose={() => setShowAppointmentBooking(false)}
          onSuccess={handleAppointmentSuccess}
        />
      )}
      {/* Appointment Completion Modal */}
        {showCompletionModal && selectedAppointmentForCompletion && (
          <AppointmentCompletionModal
            isOpen={showCompletionModal}
            onClose={() => {
              setShowCompletionModal(false);
              setSelectedAppointmentForCompletion(null);
            }}
            onComplete={handleModalCompletion}
            appointment={selectedAppointmentForCompletion}
            isDarkMode={isDarkMode}
          />
        )}
    </div>
  );
}

export default DoctorDashboardPage;