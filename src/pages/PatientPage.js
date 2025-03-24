import React, { useState, useEffect } from "react";
import { Search, Filter, Upload, User, FileText, Calendar, Clock, PlusCircle } from "react-feather";

// Custom Dialog Components
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        {React.Children.map(children, (child) => {
          if (child.type === DialogContent) {
            return React.cloneElement(child, { onClose: () => onOpenChange(false) });
          }
          return child;
        })}
      </div>
    </div>
  );
};

const DialogContent = ({ children, onClose, className }) => (
  <div className={`p-6 ${className}`}>
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
      aria-label="Close"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    {children}
  </div>
);

const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
const DialogTitle = ({ children, className }) => (
  <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
);

function PatientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("All");
  const [sexFilter, setSexFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  // Sample patient data with specific diseases
  const [patients] = useState([
    { 
      id: 1,
      name: "John Doe", 
      age: 45,
      sex: "Male",
      diagnosis: "Pneumonia", 
      status: "diagnosed",
      date: "2025-01-15",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      xray: "https://www.raymagazines.com/wp-content/webp-express/webp-images/uploads/2022/02/Portable-CXR-showing-classic-lobar-pneumonia-Source-radiopaedia.org_.jpg.webp",
      notes: "Patient showing improvement after antibiotics treatment.",
      vitals: { bp: "120/80", temp: "37.2°C", pulse: "72 bpm", resp: "16/min" }
    },
    { 
      id: 2,
      name: "Jane Smith", 
      age: 32,
      sex: "Female",
      diagnosis: "Tuberculosis", 
      status: "diagnosed",
      date: "2025-01-10",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      xray: "https://www.raymagazines.com/wp-content/webp-express/webp-images/uploads/2022/02/CXR-PA-showing-Right-upper-lobe-patchy-consolidation-suggesting-Tuberculosis-Source-radiopaedia.org_.jpg.webp",
      notes: "Started on RIPE therapy. Follow-up scheduled in 2 weeks.",
      vitals: { bp: "110/70", temp: "37.8°C", pulse: "80 bpm", resp: "18/min" }
    },
    { 
      id: 3,
      name: "Mike Johnson", 
      age: 28,
      sex: "Male",
      diagnosis: null, 
      status: "undiagnosed",
      date: "2025-01-05",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      xray: "https://www.raymagazines.com/wp-content/webp-express/webp-images/uploads/2022/09/CXR-Showing-Prominent-Pulmonary-Artery-representing-pulmonary-hypertension.jpg.webp",
      notes: "Awaiting additional test results. Patient reporting mild chest pain.",
      vitals: { bp: "118/78", temp: "36.9°C", pulse: "68 bpm", resp: "14/min" }
    },
    { 
      id: 4,
      name: "Emily Davis", 
      age: 54,
      sex: "Female",
      diagnosis: null, 
      status: "undiagnosed",
      date: "2025-01-18",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      xray: "https://www.raymagazines.com/wp-content/webp-express/webp-images/uploads/2022/02/CXR-showing-enlarged-cardiac-silhouette-known-as-cardiomegaly.-Source-radiopaedia.org_.jpg.webp",
      notes: "Abnormal findings on chest X-ray. CT scan scheduled.",
      vitals: { bp: "135/85", temp: "37.1°C", pulse: "76 bpm", resp: "17/min" }
    },
    {
      id: 5,
      name: "Robert Wilson",
      age: 67,
      sex: "Male",
      diagnosis: "Pneumonia",
      status: "diagnosed",
      date: "2025-01-07",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      xray: "https://www.raymagazines.com/wp-content/webp-express/webp-images/uploads/2022/02/Chest-X-ray-showing-right-lower-lobe-pneumonia-with-pleural-effusion-Source-radiopaedia.org_.jpg.webp",
      notes: "Responsive to antibiotics. Improvement in breathing.",
      vitals: { bp: "142/88", temp: "36.8°C", pulse: "78 bpm", resp: "20/min" }
    },
    {
      id: 6,
      name: "Sarah Thompson",
      age: 19,
      sex: "Female",
      diagnosis: "Tuberculosis",
      status: "diagnosed",
      date: "2025-01-20",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
      xray: "https://www.raymagazines.com/wp-content/webp-express/webp-images/uploads/2022/02/Right-upper-lobe-cavitation-due-to-pulmonary-tuberculosis.jpg.webp",
      notes: "Early stage. Started on medication and isolation protocol.",
      vitals: { bp: "115/75", temp: "38.1°C", pulse: "82 bpm", resp: "19/min" }
    }
  ]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAgeFilter = (e) => {
    setAgeFilter(e.target.value);
  };

  const handleSexFilter = (e) => {
    setSexFilter(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const openPatientProfile = (patient) => {
    setSelectedPatient(patient);
  };

  const closePatientProfile = () => {
    setSelectedPatient(null);
  };

  const navigateToCreatePatient = () => {
    window.location.href = "/create-patient";
    // Or if using React Router: history.push('/create-patient');
  };

  // Filter patients based on search query, age, sex, and status
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (patient.diagnosis && patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Age filtering logic
    const matchesAge = 
      ageFilter === "All" || 
      (ageFilter === "0-18" && patient.age <= 18) ||
      (ageFilter === "19-40" && patient.age >= 19 && patient.age <= 40) ||
      (ageFilter === "41-65" && patient.age >= 41 && patient.age <= 65) ||
      (ageFilter === "65+" && patient.age > 65);
    
    // Sex filtering logic
    const matchesSex = sexFilter === "All" || patient.sex === sexFilter;
    
    // Status filtering logic
    const matchesStatus = statusFilter === "All" || patient.status === statusFilter;

    return matchesSearch && matchesAge && matchesSex && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status) => {
    return status === "diagnosed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };
  
  // Animation effect for header
  useEffect(() => {
    const header = document.getElementById('dashboardHeader');
    if (header) {
      header.style.opacity = '0';
      header.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
      }, 300);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header 
          id="dashboardHeader" 
          className="flex justify-between items-center mb-6 transition-all duration-700 ease-in-out"
        >
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Patients Dashboard</h1>
          <button onClick={navigateToCreatePatient}
            className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:scale-105"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add New Patient
          </button>
        </header>

        {/* Search and Filter Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name or diagnosis..."
              className="pl-10 p-2 border border-gray-300 rounded-md w-full bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={ageFilter}
              onChange={handleAgeFilter}
              className="pl-10 p-2 border border-gray-300 rounded-md w-full bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            >
              <option value="All">All Ages</option>
              <option value="0-18">0-18 years</option>
              <option value="19-40">19-40 years</option>
              <option value="41-65">41-65 years</option>
              <option value="65+">65+ years</option>
            </select>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={sexFilter}
              onChange={handleSexFilter}
              className="pl-10 p-2 border border-gray-300 rounded-md w-full bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="pl-10 p-2 border border-gray-300 rounded-md w-full bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            >
              <option value="All">All Statuses</option>
              <option value="diagnosed">Diagnosed</option>
              <option value="undiagnosed">Undiagnosed</option>
            </select>
          </div>
        </div>

        {/* Patient List */}
        <div className="mb-6">
          <PatientList 
            patients={filteredPatients} 
            openProfile={openPatientProfile}
            getStatusColor={getStatusColor}
          />
        </div>

        {/* Patient Profile Dialog */}
        {selectedPatient && (
          <Dialog open={!!selectedPatient} onOpenChange={closePatientProfile}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl">Patient Profile</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {/* Patient Info Column */}
                <div className="flex flex-col items-center text-center">
                  <img 
                    src={selectedPatient.image} 
                    alt={selectedPatient.name} 
                    className="h-32 w-32 rounded-full object-cover mb-3 border-2 border-gray-200"
                  />
                  
                  <h2 className="text-lg font-semibold">{selectedPatient.name}</h2>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {selectedPatient.age} years, {selectedPatient.sex}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedPatient.date}</span>
                  </div>
                  
                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPatient.status)}`}>
                      {selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                {/* Medical Details Column */}
                <div className="md:col-span-2">
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                      {["details", "xray", "vitals"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`whitespace-nowrap py-4 px-3 border-w-2 font-medium text-sm transition-all duration-300 border-b-2${
                            activeTab === tab
                              ? "border-blue-500 text-white-600 font-semibold"
                              : "border-transparent text-white-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </nav>
                  </div>
                  
                  {activeTab === "details" && (
                    <div className="bg-gray-50 p-4 rounded-md mt-4">
                      <div className="mb-3">
                        <h3 className="text-sm font-medium text-gray-700">Diagnosis</h3>
                        <p className="mt-1 text-gray-900">{selectedPatient.diagnosis || "Pending diagnosis"}</p>
                      </div>
                      
                      <div className="mb-3">
                        <h3 className="text-sm font-medium text-gray-700">Notes</h3>
                        <p className="mt-1 text-gray-900">{selectedPatient.notes}</p>
                      </div>
                      
                      <div className="flex items-center mt-4">
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:scale-105">
                          <FileText className="h-4 w-4 mr-2" />
                          View Full Record
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "xray" && (
                    <div className="bg-gray-50 p-4 rounded-md mt-4">
                      <div className="flex justify-center">
                        <img 
                          src={selectedPatient.xray} 
                          alt="Patient X-Ray" 
                          className="max-h-64 object-contain border border-gray-200 rounded-md"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-500">Uploaded on {selectedPatient.date}</span>
                        
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:scale-105">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload New X-Ray
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "vitals" && (
                    <div className="bg-gray-50 p-4 rounded-md mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-md shadow-sm transition-all duration-300 hover:shadow-md">
                          <div className="text-sm font-medium text-gray-500">Blood Pressure</div>
                          <div className="mt-1 text-lg">{selectedPatient.vitals.bp}</div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md shadow-sm transition-all duration-300 hover:shadow-md">
                          <div className="text-sm font-medium text-gray-500">Temperature</div>
                          <div className="mt-1 text-lg">{selectedPatient.vitals.temp}</div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md shadow-sm transition-all duration-300 hover:shadow-md">
                          <div className="text-sm font-medium text-gray-500">Pulse Rate</div>
                          <div className="mt-1 text-lg">{selectedPatient.vitals.pulse}</div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md shadow-sm transition-all duration-300 hover:shadow-md">
                          <div className="text-sm font-medium text-gray-500">Respiratory Rate</div>
                          <div className="mt-1 text-lg">{selectedPatient.vitals.resp}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4">
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:scale-105">
                          <Clock className="h-4 w-4 mr-2" />
                          View Vitals History
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

// Patient List Component
function PatientList({ patients, openProfile, getStatusColor }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(false);
    setTimeout(() => setIsLoaded(true), 100);
  }, [patients]);

  if (patients.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">No patients match your search criteria</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Mobile View: Card-based list */}
      <div className="md:hidden grid grid-cols-1 gap-4 p-4">
        {patients.map((patient) => (
          <div 
            key={patient.id}
            onClick={() => openProfile(patient)}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-101 overflow-hidden cursor-pointer"
          >
            <div className="p-4">
              <div className="flex items-center">
                <img 
                  className="h-12 w-12 rounded-full object-cover mr-4" 
                  src={patient.image} 
                  alt={patient.name} 
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                  <p className="text-xs text-gray-500">{patient.age} years, {patient.sex}</p>
                </div>
                <div className="ml-auto">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Diagnosis:</p>
                <p className="text-sm text-gray-600">{patient.diagnosis || "Pending"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Desktop View: Table-like list */}
      <ul className="hidden md:block divide-y divide-gray-200">
        {patients.map((patient, index) => (
          <li 
            key={patient.id}
            onClick={() => openProfile(patient)}
            className="hover:bg-gray-50 cursor-pointer transition-all duration-300"
            style={{
              animation: `fadeIn 0.3s ease-in-out forwards ${index * 0.05}s`,
              opacity: 0
            }}
          >
            <div className="flex items-center px-6 py-4">
              <div className="min-w-0 flex-1 flex items-center">
                <div className="flex-shrink-0">
                  <img 
                    className="h-12 w-12 rounded-full object-cover" 
                    src={patient.image} 
                    alt={patient.name} 
                  />
                </div>
                <div className="min-w-0 flex-1 px-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">{patient.name}</p>
                    <p className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="truncate">{patient.age} years, {patient.sex}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="ml-2 flex flex-col items-end">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                  {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                </span>
                <span className="mt-1 text-sm text-gray-500">{patient.diagnosis || "Pending diagnosis"}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      {/* Animation keyframes */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default PatientPage;