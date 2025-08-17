import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Filter, Upload, User, FileText, Calendar, Clock, PlusCircle, Edit, Trash2, RefreshCw, Save, X } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';

// Cache manager for efficient data loading
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  set(key, data) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now());
  }

  get(key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp || Date.now() - timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  invalidate(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }
}

const cacheManager = new CacheManager();

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
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
  <div className={`p-6 relative ${className}`}>
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 z-10"
      aria-label="Close"
    >
      <X size={24} />
    </button>
    {children}
  </div>
);

const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
const DialogTitle = ({ children, className }) => (
  <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
);

const ConfirmDialog = ({ open, onConfirm, onCancel, title, message, type = "danger" }) => {
  if (!open) return null;

  const buttonColor = type === "danger" 
    ? "bg-red-600 hover:bg-red-700 text-white" 
    : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        {/* ... dialog content ... */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md transition-all duration-300 ${
              type === "danger" 
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Patient Edit Form Component
const PatientEditForm = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name: patient?.first_name || '',
    last_name: patient?.last_name || '',
    age: patient?.age || '',
    gender: patient?.gender || 'M',
    phone: patient?.phone || '',
    email: patient?.email || '',
    status: patient?.status || 'undiagnosed',
    blood_pressure_systolic: patient?.blood_pressure_systolic || '',
    blood_pressure_diastolic: patient?.blood_pressure_diastolic || '',
    temperature: patient?.temperature || '',
    heart_rate: patient?.heart_rate || '',
    respiratory_rate: patient?.respiratory_rate || '',
    additional_notes: patient?.additional_notes || '',
    diabetes: patient?.diabetes || false,
    hypertension: patient?.hypertension || false,
    asthma: patient?.asthma || false,
    heart_disease: patient?.heart_disease || false,
    smoking_status: patient?.smoking_status || 'never',
    allergies: patient?.allergies || false,
    family_history: patient?.family_history || ''
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.age || formData.age < 0 || formData.age > 150) newErrors.age = 'Valid age is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving patient:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            className={`w-full p-2 border rounded-lg ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            className={`w-full p-2 border rounded-lg ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age *
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleChange('age', parseInt(e.target.value) || '')}
            className={`w-full p-2 border rounded-lg ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full p-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="undiagnosed">Undiagnosed</option>
            <option value="diagnosed">Diagnosed</option>
            <option value="recovered">Recovered</option>
            <option value="deceased">Deceased</option>
          </select>
        </div>
      </div>

      {/* Vitals Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Vital Signs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Systolic BP
            </label>
            <input
              type="number"
              value={formData.blood_pressure_systolic}
              onChange={(e) => handleChange('blood_pressure_systolic', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="120"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diastolic BP
            </label>
            <input
              type="number"
              value={formData.blood_pressure_diastolic}
              onChange={(e) => handleChange('blood_pressure_diastolic', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="80"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => handleChange('temperature', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="37.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heart Rate (bpm)
            </label>
            <input
              type="number"
              value={formData.heart_rate}
              onChange={(e) => handleChange('heart_rate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="72"
            />
          </div>
        </div>
      </div>

      {/* Medical History Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Medical History</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['diabetes', 'hypertension', 'asthma', 'heart_disease'].map((condition) => (
            <label key={condition} className="flex items-center">
              <input
                type="checkbox"
                checked={formData[condition]}
                onChange={(e) => handleChange(condition, e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm capitalize">{condition.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {saving ? (
            <>
              <RefreshCw className="animate-spin h-4 w-4 mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

function PatientPage() {
  const { api } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("All");
  const [sexFilter, setSexFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [confirmDialog, setConfirmDialog] = useState({ open: false, patient: null });
  
  // State for data
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientCases, setPatientCases] = useState([]);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Memoized filtered patients for performance
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (patient.diagnosis && patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesAge = 
        ageFilter === "All" || 
        (ageFilter === "0-18" && patient.age <= 18) ||
        (ageFilter === "19-40" && patient.age >= 19 && patient.age <= 40) ||
        (ageFilter === "41-65" && patient.age >= 41 && patient.age <= 65) ||
        (ageFilter === "65+" && patient.age > 65);
      
      const matchesSex = sexFilter === "All" || patient.sex === sexFilter;
      const matchesStatus = statusFilter === "All" || patient.status === statusFilter;

      return matchesSearch && matchesAge && matchesSex && matchesStatus;
    });
  }, [patients, searchQuery, ageFilter, sexFilter, statusFilter]);

  const fetchPatients = useCallback(async (forceRefresh = false) => {
  const cacheKey = 'patients_data';
  
  if (!forceRefresh) {
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      setPatients(cachedData.patients);
      setPatientCases(cachedData.cases);
      setLoading(false);
      return;
    }
  }

  try {
    setLoading(true);
    setError(null);
    
    // Parallel requests for better performance
    const [patientsResponse, casesResponse] = await Promise.all([
      api.get('dashboard/api/patients/'),
      api.get('dashboard/api/cases/')
    ]);
    
    // Process and combine data
    const patientsData = patientsResponse.data.map(patient => {
      const patientCases = casesResponse.data.filter(case_ => case_.patient === patient.id);
      const latestCase = patientCases.length > 0 ? 
        patientCases.sort((a, b) => new Date(b.diagnosis_date) - new Date(a.diagnosis_date))[0] : null;
      
      return {
        id: patient.id, // Make sure this is the correct patient ID from backend
        name: patient.full_name || `${patient.first_name} ${patient.last_name}`,
        age: patient.age,
        sex: patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other',
        diagnosis: latestCase?.disease_detail?.name || null,
        status: patient.status,
        date: latestCase?.diagnosis_date || patient.created_at?.split('T')[0],
        image: patient.profile_image_url || `https://randomuser.me/api/portraits/${patient.gender === 'F' ? 'women' : 'men'}/${patient.id % 100}.jpg`,
        xray: patient.xray_image_url || "https://via.placeholder.com/400x300/cccccc/666666?text=No+X-Ray+Available",
        notes: latestCase?.notes || patient.additional_notes || "No additional notes available.",
        vitals: {
          bp: patient.blood_pressure_systolic && patient.blood_pressure_diastolic ? 
            `${patient.blood_pressure_systolic}/${patient.blood_pressure_diastolic}` : "N/A",
          temp: patient.temperature ? `${patient.temperature}°C` : "N/A",
          pulse: patient.heart_rate ? `${patient.heart_rate} bpm` : "N/A",
          resp: patient.respiratory_rate ? `${patient.respiratory_rate}/min` : "N/A"
        },
        phone: patient.phone,
        email: patient.email,
        medicalHistory: {
          diabetes: patient.diabetes,
          hypertension: patient.hypertension,
          asthma: patient.asthma,
          allergies: patient.allergies,
          heart_disease: patient.heart_disease,
          smoking_status: patient.smoking_status,
          family_history: patient.family_history
        },
        // Include raw patient data for editing - IMPORTANT: Use the original patient object
        rawData: patient
      };
    });
    
    // Cache the processed data
    cacheManager.set(cacheKey, {
      patients: patientsData,
      cases: casesResponse.data
    });
    
    setPatients(patientsData);
    setPatientCases(casesResponse.data);
    
  } catch (err) {
    console.error('Error fetching patients:', err);
    setError('Failed to load patients. Please try again.');
  } finally {
    setLoading(false);
  }
}, [api]);


  // Update patient
const updatePatient = async (patientId, formData) => {
  try {
    console.log('Updating patient with ID:', patientId);
    console.log('Form data:', formData);
    
    // Clean the form data - remove empty strings and null values for numeric fields
    const cleanedData = Object.keys(formData).reduce((acc, key) => {
      const value = formData[key];
      
      // Handle numeric fields
      if (['age', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'heart_rate', 'respiratory_rate'].includes(key)) {
        acc[key] = value === '' || value === null ? null : Number(value);
      }
      // Handle decimal fields
      else if (['temperature'].includes(key)) {
        acc[key] = value === '' || value === null ? null : parseFloat(value);
      }
      // Handle boolean fields
      else if (['diabetes', 'hypertension', 'asthma', 'heart_disease'].includes(key)) {
        acc[key] = Boolean(value);
      }
      // Handle string fields - trim whitespace
      else if (typeof value === 'string') {
        acc[key] = value.trim();
      }
      else {
        acc[key] = value;
      }
      
      return acc;
    }, {});

    console.log('Cleaned form data:', cleanedData);

    const response = await api.patch(`dashboard/api/patients/${patientId}/`, cleanedData);
    console.log('Update response:', response.data);
    
    // Invalidate cache and refresh data
    cacheManager.invalidate('patients_data');
    await fetchPatients(true);
    
    setEditingPatient(null);
    setSelectedPatient(null);
    
    // Show success message (you can implement a toast notification here)
    console.log('Patient updated successfully');
    
  } catch (error) {
    console.error('Error updating patient:', error);
    console.error('Error response:', error.response?.data);
    
    // Show user-friendly error message
    if (error.response?.data) {
      const errorMessages = Object.entries(error.response.data)
        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
        .join('\n');
      alert(`Update failed:\n${errorMessages}`);
    } else {
      alert('Failed to update patient. Please try again.');
    }
    
    throw error;
  }
};


  // Delete patient
  const deletePatient = async (patientId) => {
    try {
      await api.delete(`dashboard/api/patients/${patientId}/`);
      
      // Invalidate cache and refresh data
      cacheManager.invalidate('patients_data');
      await fetchPatients(true);
      
      setConfirmDialog({ open: false, patient: null });
      setSelectedPatient(null);
      
      // Show success message
      console.log('Patient deleted successfully');
      
    } catch (error) {
      console.error('Error deleting patient:', error);
      // Show error message
    }
  };

  const fetchPatientAppointments = async (patientId) => {
    try {
      const response = await api.get(`dashboard/api/appointments/?patient=${patientId}`);
      setPatientAppointments(response.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const openPatientProfile = (patient) => {
    setSelectedPatient(patient);
    fetchPatientAppointments(patient.id);
  };

  const closePatientProfile = () => {
    setSelectedPatient(null);
    setEditingPatient(null);
    setPatientAppointments([]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPatients(true);
    setRefreshing(false);
  };

  const navigateToCreatePatient = () => {
    window.location.href = "/create-patient";
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "diagnosed":
        return "bg-green-100 text-green-800";
      case "undiagnosed":
        return "bg-yellow-100 text-yellow-800";
      case "recovered":
        return "bg-blue-100 text-blue-800";
      case "deceased":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);
  
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading patients...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-medium">Error Loading Patients</h3>
            <p className="text-red-600 mt-2">{error}</p>
            <button 
              onClick={() => fetchPatients(true)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
    <div className="max-w-7xl mx-auto">
      <header 
        id="dashboardHeader" 
        className="flex justify-between items-center mb-6 transition-all duration-700 ease-in-out"
      >
        <div className="flex items-center space-x-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Patients Dashboard ({filteredPatients.length})
          </h1>
          <div className="relative group">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`p-2 rounded-full transition-all duration-300 ${
                refreshing 
                  ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/50' 
                  : 'text-gray-500 hover:text-blue-600 bg-gray-200/70 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-900/30'
              }`}
              title="Refresh data"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Refresh Data
            </span>
          </div>
        </div>
        
        <button onClick={navigateToCreatePatient}
          className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:scale-105"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Patient
        </button>
      </header>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients..."
              className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="All">All Ages</option>
              <option value="0-18">0-18 years</option>
              <option value="19-40">19-40 years</option>
              <option value="41-65">41-65 years</option>
              <option value="65+">65+ years</option>
            </select>
          </div>
          
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <select
              value={sexFilter}
              onChange={(e) => setSexFilter(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="All">All Statuses</option>
              <option value="diagnosed">Diagnosed</option>
              <option value="undiagnosed">Undiagnosed</option>
              <option value="recovered">Recovered</option>
              <option value="deceased">Deceased</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No patients found matching your criteria</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center cursor-pointer flex-1"
                  onClick={() => openPatientProfile(patient)}
                >
                  <img
                    src={patient.image}
                    alt={patient.name}
                    className="h-12 w-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=6366f1&color=ffffff`;
                    }}
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {patient.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {patient.diagnosis || "Pending diagnosis"} • {patient.age} years, {patient.sex}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(patient.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <div className="relative group">
                              <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Editing patient:', patient);
                      console.log('Patient raw data:', patient.rawData);
                      setEditingPatient(patient);
                    }}
                    className="p-2 rounded-full transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/30 dark:to-blue-900/50 dark:hover:from-blue-900/40 dark:hover:to-blue-900/60 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:shadow-md hover:scale-105"
                    title="Edit patient"
                  >
                    <Edit size={16} />
                  </button>
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        Edit Patient
                      </span>
                    </div>
                    
                    <div className="relative group">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDialog({ open: true, patient });
                        }}
                        className="p-2 rounded-full transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 dark:from-red-900/20 dark:to-red-900/40 dark:hover:from-red-900/30 dark:hover:to-red-900/50 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:shadow-md hover:scale-105"
                        title="Delete patient"
                      >
                        <Trash2 size={16} />
                      </button>
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        Delete Patient
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && !editingPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={closePatientProfile}>
          <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 max-w-4xl">
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
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPatient.name)}&background=6366f1&color=ffffff&size=128`;
                  }}
                />
                
                <h2 className="text-lg font-semibold">{selectedPatient.name}</h2>
                
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedPatient.age} years, {selectedPatient.sex}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(selectedPatient.date).toLocaleDateString()}
                  </span>
                </div>
                
                {selectedPatient.phone && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    📞 {selectedPatient.phone}
                  </div>
                )}
                
                {selectedPatient.email && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ✉️ {selectedPatient.email}
                  </div>
                )}
                
                <div className="mt-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPatient.status)}`}>
                    {selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => setEditingPatient(selectedPatient)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 dark:text-blue-300 dark:from-blue-900/40 dark:to-blue-900/60 dark:hover:from-blue-900/50 dark:hover:to-blue-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDialog({ open: true, patient: selectedPatient })}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-gradient-to-br from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 dark:text-red-300 dark:from-red-900/40 dark:to-red-900/60 dark:hover:from-red-900/50 dark:hover:to-red-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 hover:shadow-md"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
              
              {/* Medical Details Column */}
              <div className="md:col-span-2">
                <div className="mb-6">
                  <div className="flex space-x-2 mb-4">
                    {["details", "xray", "vitals", "history"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          activeTab === tab
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-800/60"
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {activeTab === "details" && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">Diagnosis</h3>
                    <p className="text-gray-800 dark:text-gray-200 mb-4">
                      {selectedPatient.diagnosis || "Pending diagnosis"}
                    </p>
                    
                    <h3 className="text-lg font-semibold mb-3">Clinical Notes</h3>
                    <p className="text-gray-800 dark:text-gray-200 mb-4">
                      {selectedPatient.notes}
                    </p>
                    
                    {patientAppointments.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold mb-3">Recent Appointments</h3>
                        <div className="space-y-2">
                          {patientAppointments.slice(0, 3).map((appointment) => (
                            <div key={appointment.id} className="text-sm text-gray-600 dark:text-gray-400">
                              {appointment.date} - {appointment.appointment_type_display}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {activeTab === "xray" && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-center">
                      <img 
                        src={selectedPatient.xray} 
                        alt="Patient X-Ray" 
                        className="max-h-64 object-contain border border-gray-200 dark:border-gray-600 rounded-md"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300/cccccc/666666?text=No+X-Ray+Available";
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Last updated: {new Date(selectedPatient.date).toLocaleDateString()}
                      </span>
                      
                      <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 dark:text-blue-300 dark:from-blue-900/40 dark:to-blue-900/60 dark:hover:from-blue-900/50 dark:hover:to-blue-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New X-Ray
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === "vitals" && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-600 p-3 rounded-md shadow-sm">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">Blood Pressure</div>
                        <div className="mt-1 text-lg text-gray-800 dark:text-gray-100">{selectedPatient.vitals.bp}</div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-600 p-3 rounded-md shadow-sm">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">Temperature</div>
                        <div className="mt-1 text-lg text-gray-800 dark:text-gray-100">{selectedPatient.vitals.temp}</div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-600 p-3 rounded-md shadow-sm">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">Pulse Rate</div>
                        <div className="mt-1 text-lg text-gray-800 dark:text-gray-100">{selectedPatient.vitals.pulse}</div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-600 p-3 rounded-md shadow-sm">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">Respiratory Rate</div>
                        <div className="mt-1 text-lg text-gray-800 dark:text-gray-100">{selectedPatient.vitals.resp}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-4">
                      <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 dark:text-blue-300 dark:from-blue-900/40 dark:to-blue-900/60 dark:hover:from-blue-900/50 dark:hover:to-blue-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md">
                        <Clock className="h-4 w-4 mr-2" />
                        View Vitals History
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Medical History</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedPatient.medicalHistory).map(([key, value]) => {
                        if (typeof value === 'boolean') {
                          return (
                            <div key={key} className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${value ? 'bg-red-500' : 'bg-green-500'}`}></div>
                              <span className="text-sm capitalize">
                                {key.replace(/_/g, ' ')}: {value ? 'Yes' : 'No'}
                              </span>
                            </div>
                          );
                        } else if (value) {
                          return (
                            <div key={key} className="col-span-2">
                              <span className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{value}</p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Patient Edit Modal */}
      {editingPatient && (
        <Dialog open={!!editingPatient} onOpenChange={() => setEditingPatient(null)}>
          <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Edit Patient: {editingPatient.name}</DialogTitle>
            </DialogHeader>
            
            <PatientEditForm
              patient={editingPatient.rawData}
              onSave={(formData) => updatePatient(editingPatient.id, formData)}
              onCancel={() => setEditingPatient(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title="Delete Patient"
        message={`Are you sure you want to delete ${confirmDialog.patient?.name}? This action cannot be undone and will permanently remove all patient data, including medical records and appointments.`}
        type="danger"
        onConfirm={() => deletePatient(confirmDialog.patient.id)}
        onCancel={() => setConfirmDialog({ open: false, patient: null })}
      />
    </div>
  </div>
);
}

export default PatientPage;