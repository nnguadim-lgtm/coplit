import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { handleApiError } from '../services/api';

// Hook for login
export const useLogin = () => {
  const { setUser, setProfile, setLoading, setError } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setUser(data.user);
      if (data.profile) {
        setProfile(data.profile);
      }
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      setLoading(false);
    },
  });
};

// Hook for registration
export const useRegister = () => {
  const { setUser, setProfile, setLoading, setError } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setUser(data.user);
      if (data.profile) {
        setProfile(data.profile);
      }
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      setLoading(false);
    },
  });
};

// Hook for logout
export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
    onError: (error) => {
      // Still logout locally even if server request fails
      logout();
      queryClient.clear();
      console.error('Logout error:', error);
    },
  });
};

// Hook for getting current user
export const useCurrentUser = () => {
  const { setUser, setLoading, setError } = useAuthStore();

  return useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
    enabled: !!localStorage.getItem('auth_token'),
    retry: false,
  });
};

// Hook for updating user profile
export const useUpdateProfile = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// Hook for getting user profile details
export const useUserProfile = () => {
  const { setProfile } = useAuthStore();

  return useQuery({
    queryKey: ['userProfile'],
    queryFn: authService.getUserProfile,
    enabled: !!localStorage.getItem('auth_token'),
  });
};

// Hook for updating user profile details
export const useUpdateUserProfile = () => {
  const { setProfile } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateUserProfile,
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

// Hook for password reset request
export const usePasswordResetRequest = () => {
  return useMutation({
    mutationFn: authService.requestPasswordReset,
  });
};

// Hook for password reset confirmation
export const usePasswordResetConfirm = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authService.confirmPasswordReset(token, password),
  });
};

// Hook for email verification
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: authService.verifyEmail,
  });
};

// Hook for resending verification email
export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: authService.resendVerificationEmail,
  });
};