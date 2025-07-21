import { useAuth } from '../contexts/AuthContext'; // Update path as needed
import React, { useState } from "react";
import {Cloudinary} from "@cloudinary/url-gen";
import ImageUpload from '../components/ImageUpload';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';




const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400";
const selectClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100";
const textareaClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400";
const checkboxClasses = "h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700";
const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
const sectionClasses = "bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700";
const sectionTitleClasses = "text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100";


function CreatePatientPage() {
  const { api, user } = useAuth();
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
  });

// Add these new state variables
const [uploading, setUploading] = useState(false);
const [uploadError, setUploadError] = useState("");

// Configure Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME 
  }
});

const handleCancel = () => {
  navigate(-1);
};

const handleReset = () => {
  if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
    setFormData({
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
    });
    
    setProfileImageUrl('');
    setUploadError('');
  }
};
// Add image upload function
const uploadImageToCloudinary = async (file) => {
  setUploading(true);
  setUploadError("");
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'patient-xrays');
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
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
};
// Update handleChange function
const handleChange = async (e) => {
  const { name, value, type, checked } = e.target;
  
  if (type === "checkbox") {
    // Handle symptom checkboxes
    if (Object.keys(formData.symptoms).includes(name)) {
      setFormData({
        ...formData,
        symptoms: {
          ...formData.symptoms,
          [name]: checked
        }
      });
    } else {
      // Handle other boolean fields
      setFormData({
        ...formData,
        [name]: checked
      });
    }
  } else if (name === "xrayFile") {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        xrayFile: file
      });
      
      // Automatically upload to Cloudinary
      await uploadImageToCloudinary(file);
    }
  } else {
    setFormData({
      ...formData,
      [name]: value
    });
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Prepare data for backend
    const patientData = {
      ...formData,
      // Map frontend fields to backend fields
      xray_image_url: formData.xrayImageUrl,
      // Remove frontend-only fields
      xrayFile: undefined,
      xrayImageUrl: undefined,
      profile_image_url: profileImageUrl,

    };
    
    const response = await api.post('/api/patients/', patientData);

    
if (response.status === 200 || response.status === 201) {
  const result = response.data; // axios uses .data, not .json()
  alert(`Patient ${formData.firstName} ${formData.lastName} created successfully!`);
  
  if (formData.xrayImageUrl && result.id) {
    await runPrediction(result.id, formData.xrayImageUrl);
  }
} else {
  throw new Error('Failed to create patient');
}
  } catch (error) {
    console.error('Error creating patient:', error);
    alert('Failed to create patient. Please try again.');
  }
};

// Optional: Function to run prediction after patient creation
const runPrediction = async (patientId, imageUrl) => {
  try {
    // You might need to convert URL back to file for your prediction endpoint
const response = await api.post('/api/ml/predict/', {
  patient_id: patientId,
  xray_image_url: imageUrl
});
if (response.status === 200) {
  const prediction = response.data; // Use .data instead of .json()
  console.log('Prediction result:', prediction);
}
  } catch (error) {
    console.error('Error running prediction:', error);
  }
};
return (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-600 dark:bg-blue-700 px-6 py-4 relative">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors p-1 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-full"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-white pr-12">Create New Patient Record</h2>
        <p className="text-blue-100">ML-Assisted Respiratory and Cardiac Condition Analysis</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {/* Patient Demographics */}
        <div className="mb-8">
          <h3 className={sectionTitleClasses + " pb-2 border-b border-gray-200 dark:border-gray-700"}>
            Patient Demographics
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className={labelClasses}>
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={inputClasses}
                placeholder="Enter first name"
              />
            </div>
            
            <div>
              <label className={labelClasses}>
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={inputClasses}
                placeholder="Enter last name"
              />
            </div>
            
            <div>
              <label className={labelClasses}>Date of Birth*</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
            
            <div>
              <label className={labelClasses}>Gender*</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className={selectClasses}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className={labelClasses}>Patient ID</label>
              <input
                type="text"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter patient ID"
              />
            </div>
            
            <div>
              <label className={labelClasses}>Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter contact number"
              />
            </div>
          </div>
          
          {/* Patient Photo section - properly aligned */}
          <div className="mt-6">
            <label className={labelClasses}>Patient Photo (Optional)</label>
            <div className="mt-2">
              <ImageUpload
                onImageUpload={setProfileImageUrl}
                currentImageUrl={profileImageUrl}
                label="Profile Picture"
              />
            </div>
          </div>
        </div>

        {/* Clinical Information */}
        <div className="mb-8">
          <h3 className={sectionTitleClasses + " pb-2 border-b border-gray-200 dark:border-gray-700"}>
            Clinical Information
          </h3>
          <div className="mt-4 space-y-6">
            <div>
              <label className={labelClasses}>
                Suspected Condition
              </label>
              <input
                type="text"
                name="suspectedCondition"
                value={formData.suspectedCondition}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter suspected condition"
              />
            </div>

            <div>
              <label className={labelClasses}>
                Symptoms
              </label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(formData.symptoms).map((symptom) => (
                  <div key={symptom} className="flex items-center">
                    <input
                      type="checkbox"
                      name={symptom}
                      checked={formData.symptoms[symptom]}
                      onChange={handleChange}
                      className={checkboxClasses}
                      id={`symptom-${symptom}`}
                    />
                    <label htmlFor={`symptom-${symptom}`} className="ml-3 text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {symptom.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="mb-8">
          <h3 className={sectionTitleClasses + " pb-2 border-b border-gray-200 dark:border-gray-700"}>
            Vital Signs
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClasses}>Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="36.5"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Heart Rate (bpm)</label>
              <input
                type="number"
                name="heartRate"
                value={formData.heartRate}
                onChange={handleChange}
                placeholder="75"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Respiratory Rate (bpm)</label>
              <input
                type="number"
                name="respiratoryRate"
                value={formData.respiratoryRate}
                onChange={handleChange}
                placeholder="16"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Blood Pressure (mmHg)</label>
              <input
                type="text"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleChange}
                placeholder="120/80"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Oxygen Saturation (%)</label>
              <input
                type="number"
                name="oxygenSaturation"
                min="0"
                max="100"
                value={formData.oxygenSaturation}
                onChange={handleChange}
                placeholder="98"
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="mb-8">
          <h3 className={sectionTitleClasses + " pb-2 border-b border-gray-200 dark:border-gray-700"}>
            Medical History
          </h3>
          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Smoking History</label>
                <select
                  name="smokingHistory"
                  value={formData.smokingHistory}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="">Select Status</option>
                  <option value="never">Never Smoked</option>
                  <option value="former">Former Smoker</option>
                  <option value="current">Current Smoker</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>HIV Status</label>
                <select
                  name="hivStatus"
                  value={formData.hivStatus}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="">Select Status</option>
                  <option value="negative">Negative</option>
                  <option value="positive">Positive</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className={labelClasses}>Medical History</label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="tbExposure"
                    name="tbExposure"
                    checked={formData.tbExposure}
                    onChange={e => setFormData({...formData, tbExposure: e.target.checked})}
                    className={checkboxClasses}
                  />
                  <label htmlFor="tbExposure" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    Prior TB Exposure
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="familyHistoryHeartDisease"
                    name="familyHistoryHeartDisease"
                    checked={formData.familyHistoryHeartDisease}
                    onChange={e => setFormData({...formData, familyHistoryHeartDisease: e.target.checked})}
                    className={checkboxClasses}
                  />
                  <label htmlFor="familyHistoryHeartDisease" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    Family History of Heart Disease
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="previousCardiacConditions"
                    name="previousCardiacConditions"
                    checked={formData.previousCardiacConditions}
                    onChange={e => setFormData({...formData, previousCardiacConditions: e.target.checked})}
                    className={checkboxClasses}
                  />
                  <label htmlFor="previousCardiacConditions" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    Previous Cardiac Conditions
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Laboratory Results */}
        <div className="mb-8">
          <h3 className={sectionTitleClasses + " pb-2 border-b border-gray-200 dark:border-gray-700"}>
            Laboratory Results
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClasses}>
                White Blood Cell Count (×10³/μL)
              </label>
              <input
                type="number"
                step="0.1"
                name="wbc"
                value={formData.wbc}
                onChange={handleChange}
                placeholder="7.5"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>
                C-Reactive Protein (mg/L)
              </label>
              <input
                type="number"
                step="0.1"
                name="crp"
                value={formData.crp}
                onChange={handleChange}
                placeholder="3.0"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>
                BNP (pg/mL)
              </label>
              <input
                type="number"
                name="bnp"
                value={formData.bnp}
                onChange={handleChange}
                placeholder="100"
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Chest X-ray */}
        <div className="mb-8">
          <h3 className={sectionTitleClasses + " pb-2 border-b border-gray-200 dark:border-gray-700"}>
            Chest X-ray
          </h3>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>
                  X-ray Date
                </label>
                <input
                  type="date"
                  name="xrayDate"
                  value={formData.xrayDate}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>
                  Upload X-ray Image
                </label>
                <input
                  type="file"
                  name="xrayFile"
                  accept="image/*"
                  onChange={handleChange}
                  disabled={uploading}
                  className={inputClasses}
                />
                <div className="mt-2 space-y-1">
                  {uploading && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">Uploading...</p>
                  )}
                  {uploadError && (
                    <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Accepted formats: JPEG, PNG. Max size: 10MB
                  </p>
                </div>
              </div>
            </div>
            
            {/* Display uploaded image - better styling */}
            {formData.xrayImageUrl && (
              <div className="mt-6">
                <label className={labelClasses}>Uploaded X-ray Preview</label>
                <div className="mt-2 border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                  <img 
                    src={formData.xrayImageUrl}
                    alt="Uploaded X-ray"
                    className="max-w-sm h-auto rounded-lg shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="mb-8">
          <h3 className={sectionTitleClasses + " pb-2 border-b border-gray-200 dark:border-gray-700"}>
            Additional Notes
          </h3>
          <div className="mt-4">
            <label className={labelClasses}>Clinical Notes</label>
            <textarea
              name="clinicalNotes"
              value={formData.clinicalNotes}
              onChange={handleChange}
              rows="4"
              placeholder="Enter any additional clinical observations or notes here..."
              className={textareaClasses}
            ></textarea>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {uploading ? 'Processing...' : 'Create Patient'}
          </button>
        </div>
      </form>
    </div>
  </div>
);
}

export default CreatePatientPage;