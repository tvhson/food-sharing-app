import ApiManager from "./ApiManagement";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  console.log("Login data:", data);
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), 10000)
  );

  const response = (await Promise.race([
    ApiManager.post<LoginResponse>("auth/login", data),
    timeoutPromise,
  ])) as LoginResponse;
  return response;
};
