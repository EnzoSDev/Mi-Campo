import * as SecureStore from "expo-secure-store";

export async function getToken() {
  const token = await SecureStore.getItemAsync("access-token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  return token;
}
