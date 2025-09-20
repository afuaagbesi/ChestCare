import React, { useState } from "react";
import { Settings, Lock, Key, Shield, Eye, EyeOff, Clock, Smartphone } from "lucide-react";

function SettingsPage() {
  // Password & Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState(90);
  const [loginAttempts, setLoginAttempts] = useState(3);
  const [deviceTrust, setDeviceTrust] = useState(true);

  const ToggleSwitch = ({ checked, onChange, id }) => (
    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="opacity-0 w-0 h-0"
      />
      <span 
        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
          checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      ></span>
      <span 
        className={`absolute h-5 w-5 bg-white rounded-full transition-all duration-300 ${
          checked ? 'transform translate-x-6' : 'transform translate-x-1'
        } top-0.5`}
      ></span>
    </div>
  );

  const SettingsSection = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
      <h2 className="text-2xl font-semibold mb-6 border-b pb-3 border-gray-200 dark:border-gray-700 flex items-center gap-3">
        <Icon className="h-6 w-6 text-blue-600" />
        {title}
      </h2>
      {children}
    </div>
  );

  const SettingRow = ({ label, description, children }) => (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <label className="text-lg font-medium block">{label}</label>
          {description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>}
        </div>
        <div className="ml-6">
          {children}
        </div>
      </div>
    </div>
  );

  const validatePassword = (password) => {
    const requirements = [
      { test: password.length >= 12, text: "At least 12 characters long" },
      { test: /[a-z]/.test(password), text: "Include lowercase letters" },
      { test: /[A-Z]/.test(password), text: "Include uppercase letters" },
      { test: /\d/.test(password), text: "Include at least one number" },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: "Include at least one special character" }
    ];
    return requirements;
  };

  const passwordRequirements = validatePassword(newPassword);
  const isPasswordValid = passwordRequirements.every(req => req.test);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Password & Security Settings</h1>
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        {/* Change Password Section */}
        <SettingsSection icon={Lock} title="Change Password">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
                )}
              </div>
              
              <button 
                disabled={!isPasswordValid || newPassword !== confirmPassword || !currentPassword}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Key className="h-4 w-4" />
                Update Password
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">Password Requirements</h4>
                <ul className="space-y-2">
                  {passwordRequirements.map((req, index) => (
                    <li key={index} className={`text-sm flex items-center gap-2 ${
                      req.test ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                        req.test ? 'bg-green-600 text-white' : 'bg-gray-300'
                      }`}>
                        {req.test ? '✓' : '•'}
                      </span>
                      {req.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Password Tips</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Use a unique password for this medical system</li>
                  <li>• Consider using a password manager</li>
                  <li>• Avoid common words or personal information</li>
                  <li>• Change your password regularly</li>
                </ul>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection icon={Shield} title="Security Settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <SettingRow 
                label="Two-Factor Authentication" 
                description="Add an extra layer of security to your account"
              >
                <ToggleSwitch 
                  checked={twoFactorAuth} 
                  onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                  id="twoFactorAuth"
                />
              </SettingRow>

              <SettingRow 
                label="Login Alerts" 
                description="Get notified when someone signs into your account"
              >
                <ToggleSwitch 
                  checked={loginAlerts} 
                  onChange={() => setLoginAlerts(!loginAlerts)}
                  id="loginAlerts"
                />
              </SettingRow>

              <SettingRow 
                label="Trust This Device" 
                description="Remember this device for future logins"
              >
                <ToggleSwitch 
                  checked={deviceTrust} 
                  onChange={() => setDeviceTrust(!deviceTrust)}
                  id="deviceTrust"
                />
              </SettingRow>
            </div>

            <div className="space-y-8">
              <SettingRow 
                label="Session Timeout" 
                description="Auto-logout after inactivity (minutes)"
              >
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-40 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={240}>4 hours</option>
                </select>
              </SettingRow>

              <SettingRow 
                label="Password Expiry" 
                description="Force password change after (days)"
              >
                <select
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(e.target.value)}
                  className="w-40 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                  <option value={180}>180 days</option>
                  <option value={-1}>Never</option>
                </select>
              </SettingRow>

              <SettingRow 
                label="Max Login Attempts" 
                description="Lock account after failed attempts"
              >
                <select
                  value={loginAttempts}
                  onChange={(e) => setLoginAttempts(e.target.value)}
                  className="w-40 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value={3}>3 attempts</option>
                  <option value={5}>5 attempts</option>
                  <option value={10}>10 attempts</option>
                  <option value={-1}>Unlimited</option>
                </select>
              </SettingRow>
            </div>
          </div>
        </SettingsSection>

        {/* Active Sessions */}
        <SettingsSection icon={Smartphone} title="Active Sessions">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Current Session</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Chrome on Windows • IP: 192.168.1.100 • Started: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Active Now</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Mobile App</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    iOS App • IP: 192.168.1.105 • Last seen: 2 hours ago
                  </p>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                Revoke Access
              </button>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Firefox on MacOS</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    IP: 10.0.0.45 • Last seen: Yesterday at 3:45 PM
                  </p>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                Revoke Access
              </button>
            </div>

            <div className="mt-4">
              <button className="text-red-600 hover:text-red-700 font-medium">
                Sign out of all other sessions
              </button>
            </div>
          </div>
        </SettingsSection>

        {/* Action Buttons */}
        <div className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            Last updated: {new Date().toLocaleString()}
          </div>
          
          <div className="flex gap-4">
            <button className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-8 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
              Cancel Changes
            </button>
            <button className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Save Security Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;