import * as SecureStore from "expo-secure-store";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL;

export async function getToken() {
  const token = await SecureStore.getItemAsync("access-token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  return token;
}
