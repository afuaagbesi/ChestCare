import React, { useState } from "react";

function CreatePatientPage() {
  const [formData, setFormData] = useState({
    // Patient Demographics
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    patientId: "",
    contactNumber: "",
    
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData({
        ...formData,
        symptoms: {
          ...formData.symptoms,
          [name]: checked
        }
      });
    } else if (name === "xrayFile") {
      setFormData({
        ...formData,
        xrayFile: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you would typically send the data to the backend for storage
    // and potentially initiate the ML analysis
    console.log(formData);
    alert(`Patient ${formData.firstName} ${formData.lastName} created successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Create New Patient Record</h2>
          <p className="text-blue-100">ML-Assisted Respiratory and Cardiac Condition Analysis</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Patient Demographics Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Patient Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth*</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender*</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Clinical Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Clinical Information</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Suspected Condition*</label>
              <select
                name="suspectedCondition"
                value={formData.suspectedCondition}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Condition</option>
                <option value="pneumonia">Pneumonia</option>
                <option value="tuberculosis">Tuberculosis</option>
                <option value="cardiomegaly">Cardiomegaly</option>
                <option value="pulmonary_hypertension">Pulmonary Hypertension</option>
                <option value="other">Other/Unknown</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cough"
                    name="cough"
                    checked={formData.symptoms.cough}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="cough" className="ml-2 text-sm text-gray-700">Cough</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fever"
                    name="fever"
                    checked={formData.symptoms.fever}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fever" className="ml-2 text-sm text-gray-700">Fever</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="chestPain"
                    name="chestPain"
                    checked={formData.symptoms.chestPain}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="chestPain" className="ml-2 text-sm text-gray-700">Chest Pain</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="shortnessOfBreath"
                    name="shortnessOfBreath"
                    checked={formData.symptoms.shortnessOfBreath}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="shortnessOfBreath" className="ml-2 text-sm text-gray-700">Shortness of Breath</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fatigue"
                    name="fatigue"
                    checked={formData.symptoms.fatigue}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fatigue" className="ml-2 text-sm text-gray-700">Fatigue</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="nightSweats"
                    name="nightSweats"
                    checked={formData.symptoms.nightSweats}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="nightSweats" className="ml-2 text-sm text-gray-700">Night Sweats</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="weightLoss"
                    name="weightLoss"
                    checked={formData.symptoms.weightLoss}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="weightLoss" className="ml-2 text-sm text-gray-700">Weight Loss</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hemoptysis"
                    name="hemoptysis"
                    checked={formData.symptoms.hemoptysis}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hemoptysis" className="ml-2 text-sm text-gray-700">Hemoptysis</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edema"
                    name="edema"
                    checked={formData.symptoms.edema}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="edema" className="ml-2 text-sm text-gray-700">Edema</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="syncope"
                    name="syncope"
                    checked={formData.symptoms.syncope}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="syncope" className="ml-2 text-sm text-gray-700">Syncope</label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Vital Signs */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Vital Signs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="36.5"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  placeholder="75"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate (bpm)</label>
                <input
                  type="number"
                  name="respiratoryRate"
                  value={formData.respiratoryRate}
                  onChange={handleChange}
                  placeholder="16"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  placeholder="120/80"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Saturation (%)</label>
                <input
                  type="number"
                  name="oxygenSaturation"
                  max="100"
                  value={formData.oxygenSaturation}
                  onChange={handleChange}
                  placeholder="98"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Medical History */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Medical History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Smoking History</label>
                <select
                  name="smokingHistory"
                  value={formData.smokingHistory}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="never">Never Smoked</option>
                  <option value="former">Former Smoker</option>
                  <option value="current">Current Smoker</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HIV Status</label>
                <select
                  name="hivStatus"
                  value={formData.hivStatus}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="negative">Negative</option>
                  <option value="positive">Positive</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="tbExposure"
                  name="tbExposure"
                  checked={formData.tbExposure}
                  onChange={e => setFormData({...formData, tbExposure: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="tbExposure" className="ml-2 text-sm text-gray-700">Prior TB Exposure</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="familyHistoryHeartDisease"
                  name="familyHistoryHeartDisease"
                  checked={formData.familyHistoryHeartDisease}
                  onChange={e => setFormData({...formData, familyHistoryHeartDisease: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="familyHistoryHeartDisease" className="ml-2 text-sm text-gray-700">Family History of Heart Disease</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="previousCardiacConditions"
                  name="previousCardiacConditions"
                  checked={formData.previousCardiacConditions}
                  onChange={e => setFormData({...formData, previousCardiacConditions: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="previousCardiacConditions" className="ml-2 text-sm text-gray-700">Previous Cardiac Conditions</label>
              </div>
            </div>
          </div>
          
          {/* Laboratory Results */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Laboratory Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  White Blood Cell Count (×10³/μL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="wbc"
                  value={formData.wbc}
                  onChange={handleChange}
                  placeholder="7.5"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  C-Reactive Protein (mg/L)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="crp"
                  value={formData.crp}
                  onChange={handleChange}
                  placeholder="3.0"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BNP (pg/mL)
                </label>
                <input
                  type="number"
                  name="bnp"
                  value={formData.bnp}
                  onChange={handleChange}
                  placeholder="100"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* X-ray Upload 
         
         <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Chest X-ray</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">X-ray Date</label>
                <input
                  type="date"
                  name="xrayDate"
                  value={formData.xrayDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload X-ray Image*</label>
                <input
                  type="file"
                  name="xrayFile"
                  accept="image/*"
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500 flex items-center">
                  <span className="mr-1">ℹ️</span>
                  Accepted formats: JPEG, PNG, DICOM
                </p>
              </div>
            </div>
          </div>
          */}
          
          {/* Additional Notes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Additional Notes</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
              <textarea
                name="clinicalNotes"
                value={formData.clinicalNotes}
                onChange={handleChange}
                rows="4"
                placeholder="Enter any additional clinical observations or notes here..."
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePatientPage;