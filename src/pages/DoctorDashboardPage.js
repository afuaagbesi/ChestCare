import React, { useState, useEffect, useMemo, useRef } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import { FaHeart, FaStethoscope, FaThermometer, FaLungs, FaCalendarAlt , FaChartLine, FaChartBar, FaFilter, FaInfoCircle } from "react-icons/fa";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

// Registering chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DoctorDashboardPage() {
  const [patientStats, setPatientStats] = useState({
    cardiomegaly: 0,
    pneumonia: 0,
    tuberculosis: 0,
    pulmonaryHypertension: 0,
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedDisease, setSelectedDisease] = useState("cardiomegaly");
  
  const months = ["All", "January", "February", "March", "April", "May", "June"];

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

  const [schedule] = useState([
    { date: "2025-03-21", task: "Patient Checkup: Cardiomegaly", type: "cardiomegaly" },
    { date: "2025-03-22", task: "Patient Checkup: Pneumonia", type: "pneumonia" },
    { date: "2025-03-23", task: "Patient Checkup: Tuberculosis", type: "tuberculosis" },
    { date: "2025-03-24", task: "Patient Checkup: Pulmonary Hypertension", type: "pulmonary" },
    { date: "2025-03-25", task: "Follow-up: Cardiomegaly", type: "cardiomegaly" },
    { date: "2025-03-26", task: "New Patient: Pneumonia", type: "pneumonia" },
  ]);

  // Filter appointments based on selected date
  const filteredAppointments = useMemo(() => {
    return schedule.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const matchesDate = selectedDate ? 
        appointmentDate.toDateString() === selectedDate.toDateString() : 
        true;
      
      return matchesDate;
    });
  }, [schedule, selectedDate]);

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

  // Chart options for better visualization
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      },
      x: {
        ticks: {
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

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

  // Custom tab styling - improved layout with more spacing
  const customTabStyles = {
    tabList: "flex justify-between mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide w-full",
    tab: "py-4 px-8 font-medium text-gray-600 border-b-2 border-transparent cursor-pointer hover:text-blue-600 hover:border-blue-300 transition-all duration-200 whitespace-nowrap inline-block",//flex items-center flex-1 justify-center",
    selectedTab: "text-blue-600 border-b-2 border-blue-600 font-semibold",
    tabPanel: "py-4"
  };

  // Icons for each disease
  const diseaseIcons = {
    cardiomegaly: <FaHeart className="text-red-500 mr-2" />,
    pneumonia: <FaStethoscope className="text-blue-500 mr-2" />,
    tuberculosis: <FaThermometer className="text-green-500 mr-2" />,
    pulmonary: <FaLungs className="text-yellow-500 mr-2" />
  };

  // Handle tab change
  const handleTabSelect = (index) => {
    const diseaseTypes = ["cardiomegaly", "pneumonia", "tuberculosis", "pulmonary"];
    setSelectedDisease(diseaseTypes[index]);
  };

  // Custom CSS for calendar to fix white date issue
  const calendarStyles = `
    .react-calendar {
      width: 100%;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
      font-family: Inter, system-ui, sans-serif;
    }
    
    .react-calendar__tile {
      padding: 0.75rem 0.5rem;
      position: relative;
      color: #374151 !important;
    }
    
    .react-calendar__month-view__days__day--weekend {
      color: #ef4444 !important;
    }
    
    .react-calendar__month-view__days__day--neighboringMonth {
      color: #9ca3af !important;
    }
    
    .react-calendar__tile--now {
      background: #eff6ff !important;
    }
    
    .react-calendar__tile--active {
      background: #3b82f6 !important;
      color: white !important;
    }
    
    .react-calendar__tile--active.react-calendar__tile--now {
      background: #2563eb !important;
    }
    
    .react-calendar__tile:enabled:hover,
    .react-calendar__tile:enabled:focus {
      background-color: #dbeafe !important;
    }
    
    .react-calendar__navigation button:enabled:hover,
    .react-calendar__navigation button:enabled:focus {
      background-color: #dbeafe !important;
    }
    
    /* Fix for month and arrow visibility */
    .react-calendar__navigation__label__labelText {
      color: #1f2937 !important;
      font-weight: 500;
    }
    
    .react-calendar__navigation__arrow {
      color: #1f2937 !important;
    }
    
    /* Hide scrollbar for Chrome, Safari and Opera */
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    
    /* Hide scrollbar for IE, Edge and Firefox */
    .scrollbar-hide {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
  `;

  return (
    <div className={"bg-white w-full ${isDarkMode ? 'dark' : ''} min-h-screen"}>
      {/* Custom calendar styles */}
      <style>{calendarStyles}</style>
      
      {/* Month Filter */}
      <div className="flex items-center justify-between mb-4 px-6 pt-4">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="flex items-center">
          <FaFilter className="text-blue-600 mr-2" />
          <select
            className="bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 col-span-1 border border-gray-100"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <FaCalendarAlt className="text-blue-600 text-xl mr-2" />
            <h3 className="text-xl font-semibold text-gray-800">Doctor's Schedule</h3>
          </div>
          
          <Calendar 
            className="my-4 rounded-lg"
            onChange={setSelectedDate}
            value={selectedDate}
          />
          
          <div className="mt-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h4>
              <button 
                className={`text-sm px-3 py-1 rounded-md transition-colors ${selectedDate ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                onClick={() => setSelectedDate(null)}
              >
                {selectedDate ? 'Filtered by date' : 'All dates'}
              </button>
            </div>
            
            {/* Appointments List */}
            <div className="overflow-y-auto max-h-64 mb-0 pb-0">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((item, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg mb-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    {diseaseIcons[item.type] || <FaCalendarAlt className="text-gray-500 mr-2" />}
                    <div>
                      <div className="font-medium text-gray-800">{item.task}</div>
                      <div className="text-sm text-gray-500">{item.date}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No appointments found</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Disease Statistics and Cases */}
        <motion.div
          className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 col-span-1 lg:col-span-2 border border-gray-100"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Tabs onSelect={handleTabSelect}>
            <TabList className={customTabStyles.tabList}>
              <Tab className={({ selected }) => 
                `${customTabStyles.tab} ${selected ? customTabStyles.selectedTab : ''}`
              }>
                {diseaseIcons.cardiomegaly} Cardiomegaly
              </Tab>
              <Tab className={({ selected }) => 
                `${customTabStyles.tab} ${selected ? customTabStyles.selectedTab : ''}`
              }>
                {diseaseIcons.pneumonia} Pneumonia
              </Tab>
              <Tab className={({ selected }) => 
                `${customTabStyles.tab} ${selected ? customTabStyles.selectedTab : ''}`
              }>
                {diseaseIcons.tuberculosis} Tuberculosis
              </Tab>
              <Tab className={({ selected }) => 
                `${customTabStyles.tab} ${selected ? customTabStyles.selectedTab : ''}`
              }>
                {diseaseIcons.pulmonary} Pulmonary Hypertension
              </Tab>
            </TabList>

            <TabPanel className={customTabStyles.tabPanel}>
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className="flex items-center bg-red-50 p-4 rounded-lg">
                  <FaHeart className="text-4xl text-red-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Cardiomegaly</h3>
                    <p className="text-3xl font-bold text-red-600">{patientStats.cardiomegaly} Cases</p>
                    <p className="text-sm text-gray-500 mt-1">16% increase this month</p>
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
                <div className="flex items-center bg-blue-50 p-4 rounded-lg">
                  <FaStethoscope className="text-4xl text-blue-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Pneumonia</h3>
                    <p className="text-3xl font-bold text-blue-600">{patientStats.pneumonia} Cases</p>
                    <p className="text-sm text-gray-500 mt-1">8% increase this month</p>
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
                <div className="flex items-center bg-green-50 p-4 rounded-lg">
                  <FaThermometer className="text-4xl text-green-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Tuberculosis</h3>
                    <p className="text-3xl font-bold text-green-600">{patientStats.tuberculosis} Cases</p>
                    <p className="text-sm text-gray-500 mt-1">5% decrease this month</p>
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
                <div className="flex items-center bg-yellow-50 p-4 rounded-lg">
                  <FaLungs className="text-4xl text-yellow-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Pulmonary Hypertension</h3>
                    <p className="text-3xl font-bold text-yellow-600">{patientStats.pulmonaryHypertension} Cases</p>
                    <p className="text-sm text-gray-500 mt-1">3% increase this month</p>
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
          
          {/* Disease Facts Section */}
          <motion.div
            className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-3">
              <FaInfoCircle className="text-blue-600 mr-2" />
              <h4 className="text-lg font-semibold text-gray-800">{diseaseFacts[selectedDisease].title}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded shadow-sm">
                <h5 className="font-medium text-gray-700 mb-1">Definition</h5>
                <p className="text-gray-600 text-sm">{diseaseFacts[selectedDisease].definition}</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <h5 className="font-medium text-gray-700 mb-1">Causes</h5>
                <p className="text-gray-600 text-sm">{diseaseFacts[selectedDisease].causes}</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <h5 className="font-medium text-gray-700 mb-1">Symptoms</h5>
                <p className="text-gray-600 text-sm">{diseaseFacts[selectedDisease].symptoms}</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <h5 className="font-medium text-gray-700 mb-1">Treatment</h5>
                <p className="text-gray-600 text-sm">{diseaseFacts[selectedDisease].treatment}</p>
              </div>
            </div>
            <div className="bg-white p-3 mt-4 rounded shadow-sm">
              <h5 className="font-medium text-gray-700 mb-1">Clinical Notes</h5>
              <p className="text-gray-600 text-sm">{diseaseFacts[selectedDisease].notes}</p>
            </div>
          </motion.div>
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
          <FaChartLine className="text-blue-600 text-xl mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">Patient Disease Trends</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart showing disease trends over months */}
          <motion.div
            className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <FaChartLine className="text-blue-500 mr-2" />
              <h4 className="text-lg font-medium text-gray-800">Monthly Trends</h4>
            </div>
            <div className="h-72">
              <Line data={chartData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Bar Chart showing overall disease count */}
          <motion.div
            className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <FaChartBar className="text-blue-500 mr-2" />
              <h4 className="text-lg font-medium text-gray-800">Disease Comparison</h4>
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
    </div>
  );
}

export default DoctorDashboardPage;