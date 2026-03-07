import * as SecureStore from "expo-secure-store";
import { getToken } from "./authManager";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL;

export const userAPI = {
  getCountryCodes,
  countryCodeToEmoji,
  checkSession,
  login,
  register,
  logout,
  getUserData,
  updateUsername,
  updatePassword,
  updateProfileImage,
};

export type CountryCode = {
  code: string;
  name: string;
  flag: string;
};

async function checkSession() {
  const token = await SecureStore.getItemAsync("access-token");
  if (!token) {
    return false;
  }
  try {
    const res = await fetch(`${API_URL}/user/validate-session`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.sessionActive) {
      await SecureStore.deleteItemAsync("access-token");
      return false;
    }
    return true;
  } catch (error) {
    await SecureStore.deleteItemAsync("access-token");
    return false;
  }
}

export function countryCodeToEmoji(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

async function login(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    if (data.token) {
      await SecureStore.setItemAsync("access-token", data.token);
    }
  } catch (error) {
    throw error;
  }
}

async function getCountryCodes() {
  try {
    const res = await fetch(`${API_URL}/user/country-codes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    return data.countryCodes.map((country: CountryCode) => ({
      ...country,
      flag: countryCodeToEmoji(country.code),
    }));
  } catch (error) {
    throw error;
  }
}

async function register(
  username: string,
  email: string,
  password: string,
  passwordConfirm: string,
  countryCode: number,
) {
  try {
    const res = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        passwordConfirm,
        countryCode,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
  } catch (error) {
    throw error;
  }
}

async function logout() {
  try {
    await SecureStore.deleteItemAsync("access-token");
  } catch (error) {
    throw error;
  }
}

async function getUserData() {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/user/data`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

async function updateUsername(newUsername: string) {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/user/username`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newUsername }),
    });
    if (!res.ok) {
      throw new Error("Error al actualizar el nombre de usuario");
    }
  } catch (error) {
    throw error;
  }
}

async function updatePassword(
  currentPassword: string,
  newPassword: string,
  newPasswordConfirm: string,
) {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/user/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        newPasswordConfirm,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Error al actualizar la contraseña");
    }
  } catch (error) {
    throw error;
  }
}

async function updateProfileImage(imageUri: string) {
  try {
    const token = await getToken();
    // FormData permite enviar archivos al backend
    const formData = new FormData();
    formData.append("profileImage", {
      // profileImage es la key que espera el backend
      uri: imageUri,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any);
    const res = await fetch(`${API_URL}/user/update-profile-image`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al actualizar la foto de perfil");
    }
    return data.profile_image;
  } catch (error) {
    throw error;
  }
}
