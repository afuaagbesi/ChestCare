// hooks/useAppointments.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAppointments = () => {
  const { api } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all appointments
  const fetchAppointments = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/dashboard/api/appointments/${params ? `?${params}` : ''}`);
      
      if (response.status === 200) {
        setAppointments(response.data.results || response.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch today's appointments
  const fetchTodayAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/api/appointments/today/');
      
      if (response.status === 200) {
        setTodayAppointments(response.data);
      }
    } catch (error) {
      console.error('Error fetching today appointments:', error);
      setError('Failed to fetch today appointments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch upcoming appointments
  const fetchUpcomingAppointments = async (days = 7) => {
    try {
      setLoading(true);
      const response = await api.get(`/dashboard/api/appointments/upcoming/?days=${days}`);
      
      if (response.status === 200) {
        setUpcomingAppointments(response.data);
      }
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      setError('Failed to fetch upcoming appointments');
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const cancelAppointment = async (appointmentId, notes = '') => {
    try {
      setLoading(true);
      const response = await api.patch(`/dashboard/api/appointments/${appointmentId}/cancel/`, {
        notes
      });
      
      if (response.status === 200) {
        // Refresh appointments after cancellation
        await fetchAppointments();
        await fetchUpcomingAppointments();
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to cancel appointment' };
    } finally {
      setLoading(false);
    }
  };

  // Reschedule appointment
  const rescheduleAppointment = async (appointmentId, newDate, newTime, notes = '') => {
    try {
      setLoading(true);
      const response = await api.patch(`/dashboard/api/appointments/${appointmentId}/reschedule/`, {
        date: newDate,
        time: newTime,
        notes
      });
      
      if (response.status === 200) {
        // Refresh appointments after rescheduling
        await fetchAppointments();
        await fetchUpcomingAppointments();
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to reschedule appointment' };
    } finally {
      setLoading(false);
    }
  };

  // Complete appointment
  const completeAppointment = async (appointmentId, notes = '') => {
    try {
      setLoading(true);
      const response = await api.patch(`/dashboard/api/appointments/${appointmentId}/complete/`, {
        notes
      });
      
      if (response.status === 200) {
        // Refresh appointments after completion
        await fetchAppointments();
        await fetchUpcomingAppointments();
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      console.error('Error completing appointment:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to complete appointment' };
    } finally {
      setLoading(false);
    }
  };

  // Check available time slots
  const getAvailableSlots = async (date) => {
    try {
      const response = await api.get(`/dashboard/api/appointments/available-slots/?date=${date}`);
      
      if (response.status === 200) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch available slots' };
    }
  };

  return {
    appointments,
    todayAppointments,
    upcomingAppointments,
    loading,
    error,
    fetchAppointments,
    fetchTodayAppointments,
    fetchUpcomingAppointments,
    cancelAppointment,
    rescheduleAppointment,
    completeAppointment,
    getAvailableSlots
  };
};