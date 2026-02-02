import * as SecureStore from "expo-secure-store";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL;

export const userAPI = {
  getCountryCodes,
  login,
  register,
};

export type CountryCode = {
  code: string;
  name: string;
  flag: string;
};

function countryCodeToEmoji(code: string) {
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
    if (data.token) {
      await SecureStore.setItemAsync("access-token", data.token);
    }
  } catch (error) {
    throw error;
  }
}
