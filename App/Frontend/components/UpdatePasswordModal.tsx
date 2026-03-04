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

interface UpdatePasswordModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function UpdatePasswordModal({ onClose, onSuccess }: UpdatePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleUpdatePassword = async () => {
    if (!currentPassword.trim()) {
      setError("Debes ingresar tu contraseña actual");
      return;
    }

    if (!newPassword.trim()) {
      setError("Debes ingresar una nueva contraseña");
      return;
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Debes confirmar la nueva contraseña");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (currentPassword === newPassword) {
      setError("La nueva contraseña debe ser diferente a la actual");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await userAPI.updatePassword(
        currentPassword,
        newPassword,
        confirmPassword,
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al actualizar la contraseña");
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
              <MaterialIcons name="lock" size={20} color="#267366" />
            </View>
            <Text className="text-lg font-bold text-white">
              Cambiar contraseña
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
          Ingresa tu contraseña actual y la nueva contraseña
        </Text>

        <View className="mb-4">
          <Text className="text-xs font-semibold text-gray-400 mb-2">
            Contraseña actual
          </Text>
          <View className="flex-row items-center bg-[#1c1f22] border border-white/10 rounded-lg px-4 py-3">
            <TextInput
              placeholder="Contraseña actual"
              placeholderTextColor="#64748b"
              secureTextEntry={!showCurrentPassword}
              className="flex-1 px-4 pl-3 text-white text-base"
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <MaterialIcons
                name={showCurrentPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-xs font-semibold text-gray-400 mb-2">
            Nueva contraseña
          </Text>
          <View className="flex-row items-center bg-[#1c1f22] border border-white/10 rounded-lg px-4 py-3">
            <TextInput
              placeholder="Contraseña nueva"
              placeholderTextColor="#64748b"
              secureTextEntry={!showNewPassword}
              className="flex-1 px-4 pl-3 text-white text-base"
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <MaterialIcons
                name={showNewPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-gray-500 mt-1">
            Mínimo 6 caracteres
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-xs font-semibold text-gray-400 mb-2">
            Confirmar nueva contraseña
          </Text>
          <View className="flex-row items-center bg-[#1c1f22] border border-white/10 rounded-lg px-4 py-3">
            <TextInput
              placeholder="Confirmar contraseña"
              placeholderTextColor="#64748b"
              secureTextEntry={!showConfirmPassword}
              className="flex-1 px-4 pl-3 text-white text-base"
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <MaterialIcons
                name={showConfirmPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
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
            onPress={handleUpdatePassword}
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

export default UpdatePasswordModal;
