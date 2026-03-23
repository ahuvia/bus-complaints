import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const setAuth = useAuthStore((s) => s.setAuth);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.register(email, password),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
    },
  });

  return { user, isAuthenticated, logout, loginMutation, registerMutation };
}
