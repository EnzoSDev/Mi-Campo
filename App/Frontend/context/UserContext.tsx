import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { userAPI } from "../services/userAPI";

interface UserContextType {
  userId: number | null;
  email: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (userId: number, email: string, username: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión al iniciar la app
  useEffect(() => {
    const restoreToken = async () => {
      try {
        // Verificar si el token es válido
        const isValid = await userAPI.checkSession();
        if (isValid) {
          // Si es válido, obtener los datos del usuario del servidor
          const userData = await userAPI.getMe();
          setUserId(userData.id);
          setEmail(userData.email);
          setUsername(userData.username);
        } else {
          // Si no es válido, limpiar el almacenamiento
          await SecureStore.deleteItemAsync("access-token");
        }
      } catch (error) {
        await SecureStore.deleteItemAsync("access-token");
      } finally {
        setIsLoading(false);
      }
    };

    restoreToken();
  }, []);

  const setUser = async (userId: number, email: string, username: string) => {
    try {
      // El token ya se guarda en SecureStore en el login
      // Solo almacenamos los datos en el estado
      setUserId(userId);
      setEmail(email);
      setUsername(username);
    } catch (error) {
      console.error("Error guardando usuario:", error);
    }
  };

  const logout = async () => {
    try {
      // En userAPI ya se elimina el token de SecureStore
      await userAPI.logout();

      setUserId(null);
      setEmail(null);
      setUsername(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const value: UserContextType = {
    userId,
    email,
    username,
    isAuthenticated: userId !== null,
    isLoading,
    setUser,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }
  return context;
};
