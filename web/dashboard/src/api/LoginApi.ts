import ApiManager from "./ApiManagement";

export const login = async (data: unknown) => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), 10000)
  );

  const response = await Promise.race([
    ApiManager.post("auth/login", data),
    timeoutPromise,
  ]);
  return response;
};