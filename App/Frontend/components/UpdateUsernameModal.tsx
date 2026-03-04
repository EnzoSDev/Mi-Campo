import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { userAPI } from "../services/userAPI";

interface UpdateUsernameModalProps {
  currentUsername: string;
  onClose: () => void;
  onSuccess: (newUsername: string) => void;
}

function UpdateUsernameModal({
  currentUsername,
  onClose,
  onSuccess,
}: UpdateUsernameModalProps) {
  const [newUsername, setNewUsername] = useState<string>(currentUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      setError("El nombre de usuario no puede estar vacío");
      return;
    }

    if (newUsername === currentUsername) {
      setError("El nuevo nombre debe ser diferente");
      return;
    }

    if (newUsername.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await userAPI.updateUsername(newUsername);
      onSuccess(newUsername);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al actualizar el username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-6 bg-black/90">
      <View className="w-full bg-[#2d3136] border border-white/10 rounded-2xl p-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-[#267366]/15 items-center justify-center">
              <MaterialIcons name="person" size={20} color="#267366" />
            </View>
            <Text className="text-lg font-bold text-white">
              Cambiar nombre de usuario
            </Text>
          </View>
          <TouchableOpacity
            accessibilityLabel="Cerrar"
            onPress={onClose}
            className="w-9 h-9 items-center justify-center rounded-full bg-gray-700/30"
          >
            <MaterialIcons name="close" size={18} color="#E5E7EB" />
          </TouchableOpacity>
        </View>

        <Text className="text-sm text-gray-400 mb-4">
          Ingresa tu nuevo nombre de usuario
        </Text>

        <View className="mb-4">
          <Text className="text-xs font-semibold text-gray-400 mb-2">
            Nombre actual
          </Text>
          <View className="bg-[#1c1f22] border border-white/5 rounded-lg px-4 py-3">
            <Text className="text-gray-500">{currentUsername}</Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-xs font-semibold text-gray-400 mb-2">
            Nuevo nombre
          </Text>
          <TextInput
            className="bg-[#1c1f22] border border-white/10 rounded-lg px-4 py-3 text-white"
            placeholderTextColor="#6B7280"
            placeholder="Nuevo nombre de usuario"
            value={newUsername}
            onChangeText={(text) => {
              setNewUsername(text);
              setError("");
            }}
            editable={!loading}
            maxLength={30}
          />
          <Text className="text-xs text-gray-500 mt-1">
            {newUsername.length}/30 caracteres
          </Text>
        </View>

        {error && (
          <View className="mb-4 bg-red-500/15 border border-red-500/30 rounded-lg p-3">
            <Text className="text-red-400 text-sm">{error}</Text>
          </View>
        )}

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={onClose}
            disabled={loading}
            className="flex-1 bg-gray-700 rounded-lg py-3"
          >
            <Text className="text-white font-semibold text-center">
              Cancelar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleUpdateUsername}
            disabled={loading}
            className="flex-1 bg-[#267366] rounded-lg py-3 flex-row items-center justify-center gap-2"
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialIcons name="check" size={18} color="white" />
                <Text className="text-white font-semibold text-center">
                  Guardar
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default UpdateUsernameModal;
