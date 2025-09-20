// hooks/useDoctorProfile.js
import { useState, useEffect } from 'react';
import { useDoctorApi } from './useDoctorApi';

export const useDoctorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const doctorApi = useDoctorApi();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const [profileData, statsData] = await Promise.all([
        doctorApi.getProfile(),
        doctorApi.getDashboardStats()
      ]);
      setProfile(profileData);
      setStats(statsData);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedProfile = await doctorApi.updateProfile(profileData);
      setProfile(updatedProfile.profile);
      return updatedProfile;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const result = await doctorApi.uploadAvatar(file);
      // Update profile with new avatar URL
      setProfile(prev => ({
        ...prev,
        avatar_url: result.avatar_url
      }));
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    stats,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    refetch: fetchProfile
  };
};

