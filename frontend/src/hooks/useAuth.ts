import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

import type {
  Body_login_login_access_token as AccessToken,
  UserPublic,
  UserRegister,
} from "@/client"
import { handleError } from "@/utils"
import useCustomToast from "./useCustomToast"

const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null
}

const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showErrorToast } = useCustomToast()

  // MOCK: Replace real API call with mock data
  const { data: user } = useQuery<UserPublic | null, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      // Simulate API Loading
      await new Promise((resolve) => setTimeout(resolve, 300))
      // Return dummy user
      return {
        id: "1",
        email: "admin@example.com",
        is_active: true,
        is_superuser: true,
        full_name: "Admin User",
      } as UserPublic
    },
    enabled: isLoggedIn(),
  })

  const signUpMutation = useMutation({
    mutationFn: async (data: UserRegister) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // Simulate success
      console.log("Mock signup: ", data)
      return { ...data, id: "new-user-id" }
    },
    onSuccess: () => {
      navigate({ to: "/login" })
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const login = async (_data: AccessToken) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Set fake token
    localStorage.setItem("access_token", "fake-jwt-token")
  }

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate({ to: "/" })
    },
    onError: handleError.bind(showErrorToast),
  })

  const logout = () => {
    localStorage.removeItem("access_token")
    navigate({ to: "/login" })
  }

  return {
    signUpMutation,
    loginMutation,
    logout,
    user,
  }
}

export { isLoggedIn }
export default useAuth
