import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { LoginUser, RegisterUser } from "@shared/schema";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  lastLogin?: string;
}

export function useAuth() {
  const { data: user, isLoading, error, isError } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: Infinity, // Cache until manually invalidated
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        
        if (response.status === 401) {
          return null; // Not authenticated, return null
        }
        
        if (!response.ok) {
          return null; // Any other error, treat as not authenticated
        }
        
        return await response.json();
      } catch (err) {
        return null; // Network error, treat as not authenticated
      }
    },
  });

  return {
    user: user || undefined,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    error: isError ? error : undefined,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: LoginUser) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return await response.json() as { user: User; message: string };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data.user);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userData: RegisterUser) => {
      const response = await apiRequest("POST", "/api/auth/register", userData);
      return await response.json() as { user: User; message: string };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data.user);
      toast({
        title: "Account created!",
        description: "Welcome to the recruitment platform.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "There was an issue logging out.",
        variant: "destructive",
      });
    },
  });
}