// utils/api.ts
export async function apiFetch(url: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || ""
      : ""

  const headers: any = { ...options.headers }

  // Only set JSON header if body is NOT FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  // Add Authorization if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, { ...options, headers })

  // Handle 401 Unauthorized
  if (response.status === 401) {
    localStorage.removeItem("token")
    localStorage.removeItem("user-role")
    window.location.href = "/auth/signin"
    throw new Error("Unauthorized")
  }

  // Handle other errors
  if (!response.ok) {
    let errorMsg = "API request failed"
    try {
      const errorData = await response.json()
      if (errorData.message) errorMsg = errorData.message
    } catch {}
    throw new Error(errorMsg)
  }

  return response.json()
}
