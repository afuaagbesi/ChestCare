import { useAuth } from '../contexts/AuthContext';

// Custom hook to use doctor API with your existing auth context
export const useDoctorApi = () => {
  const { api } = useAuth();

  return {
    // Get current doctor's profile
    getProfile: async () => {
      try {
        const response = await api.get('/dashboard/api/doctors/profile/');
        return response.data;
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        throw error;
      }
    },

    // Update doctor profile
    updateProfile: async (profileData) => {
      try {
        const response = await api.patch('/dashboard/api/doctors/update-profile/', profileData);
        return response.data;
      } catch (error) {
        console.error('Error updating doctor profile:', error);
        throw error;
      }
    },

    // Upload avatar
    uploadAvatar: async (avatarFile) => {
      try {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const response = await api.post('/dashboard/api/doctors/upload-avatar/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        return response.data;
      } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
      }
    },

    // Get dashboard statistics
    getDashboardStats: async () => {
      try {
        const response = await api.get('/dashboard/api/doctors/dashboard-stats/');
        return response.data;
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }
    },

    // Get recent activity
    getRecentActivity: async (limit = 10) => {
      try {
        const response = await api.get(`/dashboard/api/doctors/recent-activity/?limit=${limit}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        throw error;
      }
    },

    // Get specialization statistics
    getSpecializationStats: async () => {
      try {
        const response = await api.get('/dashboard/api/doctors/specialization-stats/');
        return response.data;
      } catch (error) {
        console.error('Error fetching specialization stats:', error);
        throw error;
      }
    },

    // Get comprehensive profile summary
    getProfileSummary: async () => {
      try {
        const response = await api.get('/dashboard/doctor-profile-summary/');
        return response.data;
      } catch (error) {
        console.error('Error fetching profile summary:', error);
        throw error;
      }
    },
  };
};


