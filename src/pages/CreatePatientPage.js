import { useAuth } from '../contexts/AuthContext';
import React, { useState, useCallback, useMemo } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import ImageUpload from '../components/ImageUpload';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  User, 
  FileText, 
  Activity, 
  Heart, 
  FlaskConical, 
  Camera, 
  StickyNote,
  Save,
  RotateCcw,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// Optimized style constants with modern design
const styles = {
  input: "w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500",
  
  select: "w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500",
  
  textarea: "w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 resize-vertical min-h-[100px]",
  
  checkbox: "h-5 w-5 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 transition-all duration-200",
  
  label: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2",
  
  section: "bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-2xl p-8 transition-all duration-200 hover:shadow-md",
  
  sectionTitle: "text-xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-3",
  
  button: {
    primary: "px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-md transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed",
    
    secondary: "px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
  }
};

function CreatePatientPage() {
  const { api, user } = useAuth();
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const navigate = useNavigate();

  // Initial form state memoized for performance
  const initialFormData = useMemo(() => ({
    // Patient Demographics
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    patientId: "",
    contactNumber: "",
    xrayFile: null,
    xrayImageUrl: "",
    
    // Clinical Information
    suspectedCondition: "",
    symptoms: {
      cough: false,
      fever: false,
      chestPain: false,
      shortnessOfBreath: false,
      fatigue: false,
      nightSweats: false,
      weightLoss: false,
      hemoptysis: false,
      edema: false,
      syncope: false,
    },
    
    // Vital Signs
    temperature: "",
    heartRate: "",
    respiratoryRate: "",
    bloodPressure: "",
    oxygenSaturation: "",
    
    // Medical History
    smokingHistory: "",
    tbExposure: false,
    familyHistoryHeartDisease: false,
    previousCardiacConditions: false,
    hivStatus: "",
    
    // Laboratory Results
    wbc: "",
    crp: "",
    bnp: "",
    
    // X-ray Information
    xrayDate: "",
    xrayFile: null,
    
    // Additional Notes
    clinicalNotes: ""
  }), []);

  const [formData, setFormData] = useState(initialFormData);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configure Cloudinary (memoized)
  const cld = useMemo(() => new Cloudinary({
    cloud: {
      cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME 
    }
  }), []);

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
      setFormData(initialFormData);
      setProfileImageUrl('');
      setUploadError('');
    }
  }, [initialFormData]);

  // Optimized image upload function
  const uploadImageToCloudinary = useCallback(async (file) => {
    setUploading(true);
    setUploadError("");
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    uploadFormData.append('folder', 'patient-xrays');
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: uploadFormData,
        }
      );
      
      const data = await response.json();
      
      if (data.secure_url) {
        setFormData(prev => ({
          ...prev,
          xrayImageUrl: data.secure_url
        }));
        return data.secure_url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      setUploadError('Failed to upload image. Please try again.');
      console.error('Upload error:', error);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  // Optimized change handler with useCallback
  const handleChange = useCallback(async (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      if (Object.keys(formData.symptoms).includes(name)) {
        setFormData(prev => ({
          ...prev,
          symptoms: {
            ...prev.symptoms,
            [name]: checked
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else if (name === "xrayFile") {
      const file = e.target.files[0];
      if (file) {
        setFormData(prev => ({
          ...prev,
          xrayFile: file
        }));
        
        await uploadImageToCloudinary(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, [formData.symptoms, uploadImageToCloudinary]);

  // Helper functions (memoized)
  const mapGenderToBackend = useCallback((gender) => {
    const genderMap = {
      'male': 'M',
      'female': 'F',
      'other': 'O'
    };
    return genderMap[gender] || gender;
  }, []);

  const mapSmokingStatus = useCallback((status) => {
    const smokingMap = {
      'never': 'never_smoked',
      'former': 'former_smoker', 
      'current': 'current_smoker'
    };
    return smokingMap[status] || status;
  }, []);

  // Optimized submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const patientData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        gender: mapGenderToBackend(formData.gender),
        phone: formData.contactNumber,
        patient_id: formData.patientId,
        profile_image_url: profileImageUrl,
        suspected_condition: formData.suspectedCondition,
        
        // Symptoms
        cough: formData.symptoms.cough,
        fever: formData.symptoms.fever,
        chest_pain: formData.symptoms.chestPain,
        shortness_of_breath: formData.symptoms.shortnessOfBreath,
        fatigue: formData.symptoms.fatigue,
        night_sweats: formData.symptoms.nightSweats,
        weight_loss: formData.symptoms.weightLoss,
        hemoptysis: formData.symptoms.hemoptysis,
        edema: formData.symptoms.edema,
        syncope: formData.symptoms.syncope,
        
        // Vital Signs
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        heart_rate: formData.heartRate ? parseInt(formData.heartRate) : null,
        respiratory_rate: formData.respiratoryRate ? parseInt(formData.respiratoryRate) : null,
        oxygen_saturation: formData.oxygenSaturation ? parseFloat(formData.oxygenSaturation) : null,
        
        blood_pressure_systolic: formData.bloodPressure ? 
          parseInt(formData.bloodPressure.split('/')[0]?.trim()) : null,
        blood_pressure_diastolic: formData.bloodPressure ? 
          parseInt(formData.bloodPressure.split('/')[1]?.trim()) : null,
        
        // Medical History
        smoking_status: mapSmokingStatus(formData.smokingHistory),
        prior_tb_exposure: formData.tbExposure,
        family_history_heart_disease: formData.familyHistoryHeartDisease,
        previous_cardiac_conditions: formData.previousCardiacConditions,
        hiv_status: formData.hivStatus,
        
        // Lab Results
        white_blood_cell_count: formData.wbc ? parseFloat(formData.wbc) : null,
        c_reactive_protein: formData.crp ? parseFloat(formData.crp) : null,
        bnp: formData.bnp ? parseFloat(formData.bnp) : null,
        
        // X-ray
        xray_image_url: formData.xrayImageUrl,
        xray_date: formData.xrayDate,
        
        additional_notes: formData.clinicalNotes
      };
      
      const cleanedData = {};
      Object.entries(patientData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          cleanedData[key] = value;
        }
      });
      
      const response = await api.post('/dashboard/api/patients/', cleanedData);
      
      if (response.status === 200 || response.status === 201) {
        const result = response.data;
        
        // Run prediction if X-ray image is available
        if (formData.xrayImageUrl && result.id) {
          await runPrediction(result.id, formData.xrayImageUrl);
        }
        
        navigate('/patients');
      } else {
        throw new Error('Failed to create patient');
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      if (error.response?.data) {
        const errors = error.response.data;
        let errorMessage = 'Validation errors:\n';
        Object.entries(errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            errorMessage += `${field}: ${messages.join(', ')}\n`;
          } else {
            errorMessage += `${field}: ${messages}\n`;
          }
        });
        alert(errorMessage);
      } else {
        alert('Failed to create patient. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, profileImageUrl, mapGenderToBackend, mapSmokingStatus, api, navigate]);

  // Prediction function (memoized)
  const runPrediction = useCallback(async (patientId, imageUrl) => {
    try {
      const response = await api.post('/api/ml/predict/', {
        patient_id: patientId,
        xray_image_url: imageUrl
      });
      if (response.status === 200) {
        const prediction = response.data;
        console.log('Prediction result:', prediction);
      }
    } catch (error) {
      console.error('Error running prediction:', error);
    }
  }, [api]);

  // Memoized symptom options for better performance
  const symptomOptions = useMemo(() => 
    Object.keys(formData.symptoms).map(symptom => ({
      key: symptom,
      label: symptom.replace(/([A-Z])/g, ' $1').trim(),
      checked: formData.symptoms[symptom]
    }))
  , [formData.symptoms]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="px-8 py-6 relative">
            <button
              onClick={handleCancel}
              className="absolute top-6 right-8 text-white hover:text-gray-200 transition-all duration-200 p-2 hover:bg-blue-800 dark:hover:bg-blue-600 rounded-full transform hover:scale-110"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <div className="pr-16">
              <h1 className="text-3xl font-bold text-white mb-2">Create New Patient Record</h1>
              <p className="text-blue-100 text-lg">ML-Assisted Respiratory and Cardiac Condition Analysis</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient Demographics */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <User className="text-blue-600 dark:text-blue-400" size={28} />
              Patient Demographics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              <div>
                <label className={styles.label}>First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Enter first name"
                />
              </div>
              
              <div>
                <label className={styles.label}>Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Enter last name"
                />
              </div>
              
              <div>
                <label className={styles.label}>Date of Birth*</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
              
              <div>
                <label className={styles.label}>Gender*</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className={styles.select}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className={styles.label}>Patient ID</label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter patient ID"
                />
              </div>
              
              <div>
                <label className={styles.label}>Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter contact number"
                />
              </div>
            </div>
            
            {/* Patient Photo section */}
            <div>
              <label className={styles.label}>Patient Photo (Optional)</label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
                <ImageUpload
                  onImageUpload={setProfileImageUrl}
                  currentImageUrl={profileImageUrl}
                  label="Profile Picture"
                />
              </div>
            </div>
          </div>

          {/* Clinical Information */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <FileText className="text-green-600 dark:text-green-400" size={28} />
              Clinical Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className={styles.label}>Suspected Condition</label>
                <input
                  type="text"
                  name="suspectedCondition"
                  value={formData.suspectedCondition}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter suspected condition"
                />
              </div>

              <div>
                <label className={styles.label}>Symptoms</label>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {symptomOptions.map(({ key, label, checked }) => (
                      <div key={key} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors">
                        <input
                          type="checkbox"
                          name={key}
                          checked={checked}
                          onChange={handleChange}
                          className={styles.checkbox}
                          id={`symptom-${key}`}
                        />
                        <label htmlFor={`symptom-${key}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize cursor-pointer">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Activity className="text-red-600 dark:text-red-400" size={28} />
              Vital Signs
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div>
                <label className={styles.label}>Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="36.5"
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.label}>Heart Rate (bpm)</label>
                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  placeholder="75"
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.label}>Respiratory Rate (bpm)</label>
                <input
                  type="number"
                  name="respiratoryRate"
                  value={formData.respiratoryRate}
                  onChange={handleChange}
                  placeholder="16"
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.label}>Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  placeholder="120/80"
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.label}>Oxygen Saturation (%)</label>
                <input
                  type="number"
                  name="oxygenSaturation"
                  min="0"
                  max="100"
                  value={formData.oxygenSaturation}
                  onChange={handleChange}
                  placeholder="98"
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Heart className="text-purple-600 dark:text-purple-400" size={28} />
              Medical History
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={styles.label}>Smoking History</label>
                  <select
                    name="smokingHistory"
                    value={formData.smokingHistory}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Select Status</option>
                    <option value="never">Never Smoked</option>
                    <option value="former">Former Smoker</option>
                    <option value="current">Current Smoker</option>
                  </select>
                </div>
                <div>
                  <label className={styles.label}>HIV Status</label>
                  <select
                    name="hivStatus"
                    value={formData.hivStatus}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Select Status</option>
                    <option value="negative">Negative</option>
                    <option value="positive">Positive</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className={styles.label}>Medical History</label>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors">
                    <input
                      type="checkbox"
                      id="tbExposure"
                      name="tbExposure"
                      checked={formData.tbExposure}
                      onChange={handleChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="tbExposure" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      Prior TB Exposure
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors">
                    <input
                      type="checkbox"
                      id="familyHistoryHeartDisease"
                      name="familyHistoryHeartDisease"
                      checked={formData.familyHistoryHeartDisease}
                      onChange={handleChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="familyHistoryHeartDisease" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      Family History of Heart Disease
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors">
                    <input
                      type="checkbox"
                      id="previousCardiacConditions"
                      name="previousCardiacConditions"
                      checked={formData.previousCardiacConditions}
                      onChange={handleChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="previousCardiacConditions" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      Previous Cardiac Conditions
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Laboratory Results */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <FlaskConical className="text-orange-600 dark:text-orange-400" size={28} />
              Laboratory Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={styles.label}>White Blood Cell Count (×10³/μL)</label>
                <input
                  type="number"
                  step="0.1"
                  name="wbc"
                  value={formData.wbc}
                  onChange={handleChange}
                  placeholder="7.5"
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.label}>C-Reactive Protein (mg/L)</label>
                <input
                  type="number"
                  step="0.1"
                  name="crp"
                  value={formData.crp}
                  onChange={handleChange}
                  placeholder="3.0"
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.label}>BNP (pg/mL)</label>
                <input
                  type="number"
                  name="bnp"
                  value={formData.bnp}
                  onChange={handleChange}
                  placeholder="100"
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Chest X-ray */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Camera className="text-indigo-600 dark:text-indigo-400" size={28} />
              Chest X-ray
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={styles.label}>X-ray Date</label>
                  <input
                    type="date"
                    name="xrayDate"
                    value={formData.xrayDate}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div>
                  <label className={styles.label}>Upload X-ray Image</label>
                  <input
                    type="file"
                    name="xrayFile"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={uploading}
                    className={styles.input}
                  />
                  <div className="mt-3 space-y-2">
                    {uploading && (
                      <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-sm font-medium">Uploading...</span>
                      </div>
                    )}
                    {uploadError && (
                      <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                        <AlertCircle size={16} />
                        <span className="text-sm">{uploadError}</span>
                      </div>
                    )}
                    {formData.xrayImageUrl && !uploading && (
                      <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                        <CheckCircle2 size={16} />
                        <span className="text-sm font-medium">Upload successful</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Accepted formats: JPEG, PNG. Max size: 10MB
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Display uploaded image */}
              {formData.xrayImageUrl && (
                <div>
                  <label className={styles.label}>Uploaded X-ray Preview</label>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-center">
                      <img 
                        src={formData.xrayImageUrl}
                        alt="Uploaded X-ray"
                        className="max-w-md h-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <StickyNote className="text-teal-600 dark:text-teal-400" size={28} />
              Additional Notes
            </h2>
            
            <div>
              <label className={styles.label}>Clinical Notes</label>
              <textarea
                name="clinicalNotes"
                value={formData.clinicalNotes}
                onChange={handleChange}
                rows="5"
                placeholder="Enter any additional clinical observations, patient history, or notes that may be relevant for diagnosis and treatment planning..."
                className={styles.textarea}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                type="button"
                onClick={handleReset}
                className={styles.button.secondary}
                disabled={isSubmitting}
              >
                <RotateCcw size={20} className="mr-2" />
                Reset Form
              </button>
              
              <button
                type="submit"
                disabled={uploading || isSubmitting}
                className={styles.button.primary}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Creating Patient...
                  </>
                ) : (
                  <>
                    <Save size={20} className="mr-2" />
                    Create Patient
                  </>
                )}
              </button>
            </div>
            
            {/* Progress indicator */}
            {(uploading || isSubmitting) && (
              <div className="mt-6">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full animate-pulse" style={{width: uploading ? '50%' : '90%'}}></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                  {uploading ? 'Uploading image...' : 'Creating patient record...'}
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePatientPage;