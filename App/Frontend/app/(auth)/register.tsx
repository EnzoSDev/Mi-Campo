import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";

// Services
import { userAPI } from "../../services/userAPI";

import type { CountryCode } from "../../services/userAPI";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState<number>();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countryCodes, setCountryCodes] = useState<CountryCode[] | undefined>();

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const res = await userAPI.getCountryCodes();
        setCountryCodes(res);
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };

    fetchCountryCodes();
  }, []);

  const handleRegister = async () => {
    setIsLoading(true);
    if (!username || !email || !password || !passwordConfirm || !countryCode) {
      setErrorMessage("Por favor, completa todos los campos.");
      setIsLoading(false);
    } else if (password !== passwordConfirm) {
      setErrorMessage("Las contraseñas no coinciden.");
      setIsLoading(false);
    } else {
      setErrorMessage("");
      try {
        await userAPI.register(
          username,
          email,
          password,
          passwordConfirm,
          countryCode,
        );
        setSuccessMessage("Registro exitoso");
      } catch (error: any) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      <View className="w-full max-w-[480px] py-10">
        {/* TITULO */}
        <View className="mb-8 items-center">
          <Text className="text-white text-[32px] font-bold text-center">
            Crea tu cuenta
          </Text>
          <Text className="text-slate-400 text-base mt-2">
            Únete para gestionar tus campos de forma fácil y rápida
          </Text>
        </View>

        {/* ERROR */}
        <View>
          {errorMessage ? (
            <Text className="text-red-500 mb-4 text-center">
              {errorMessage}
            </Text>
          ) : null}
        </View>

        {/* SUCCESS */}
        <View>
          {successMessage ? (
            <Text className="text-green-500 mb-4 text-center">
              {successMessage}
            </Text>
          ) : null}
        </View>

        {/* FORM */}
        <View className="space-y-4">
          {/* USERNAME */}
          <View className="h-14">
            <View className="flex-row items-center bg-[#2d3136] rounded-xl h-full overflow-hidden">
              <View className="pl-4">
                <MaterialIcons
                  name="person-outline"
                  size={22}
                  color="#94a3b8"
                />
              </View>
              <TextInput
                placeholder="Nombre de Usuario"
                placeholderTextColor="#64748b"
                autoCapitalize="none"
                className="flex-1 px-4 pl-3 text-white text-base"
                onChangeText={setUsername}
              />
            </View>
          </View>

          {/* EMAIL */}
          <View className="h-14 mt-4">
            <View className="flex-row items-center bg-[#2d3136] rounded-xl h-full overflow-hidden">
              <View className="pl-4">
                <MaterialIcons name="mail-outline" size={22} color="#94a3b8" />
              </View>
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor="#64748b"
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 px-4 pl-3 text-white text-base"
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* COUNTRY CODE */}
          <View className="h-14 mt-4">
            <View className="flex-row items-center bg-[#2d3136] rounded-xl h-full px-4">
              <View className="mr-2">
                <MaterialIcons name="public" size={22} color="#94a3b8" />
              </View>
              {countryCodes === undefined ? (
                <ActivityIndicator size="small" color="#267366" />
              ) : (
                <Picker
                  selectedValue={countryCode}
                  onValueChange={(itemValue) => setCountryCode(itemValue)}
                  style={{
                    flex: 1,
                    color: "white",
                    height: 56,
                  }}
                  dropdownIconColor="#94a3b8"
                >
                  <Picker.Item label="Selecciona tu país" value={undefined} />
                  {(countryCodes as CountryCode[]).map((country) => (
                    <Picker.Item
                      key={country.code}
                      label={`${country.flag} ${country.name}`}
                      value={country.code}
                    />
                  ))}
                </Picker>
              )}
            </View>
          </View>

          {/* PASSWORD */}
          <View className="h-14 mt-4">
            <View className="flex-row items-center bg-[#2d3136] rounded-xl h-full overflow-hidden">
              <View className="pl-4">
                <MaterialIcons name="lock-outline" size={22} color="#94a3b8" />
              </View>
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor="#64748b"
                secureTextEntry={secureText}
                className="flex-1 px-4 pl-3 text-white text-base"
                onChangeText={setPassword}
              />
              <Pressable
                onPress={() => setSecureText(!secureText)}
                className="pr-4"
              >
                <MaterialIcons
                  name={secureText ? "visibility-off" : "visibility"}
                  size={22}
                  color="#94a3b8"
                />
              </Pressable>
            </View>
          </View>

          {/* PASSWORD CONFIRM */}
          <View className="h-14 mt-4">
            <View className="flex-row items-center bg-[#2d3136] rounded-xl h-full overflow-hidden">
              <View className="pl-4">
                <MaterialIcons name="lock-reset" size={22} color="#94a3b8" />
              </View>
              <TextInput
                placeholder="Repetir contraseña"
                placeholderTextColor="#64748b"
                secureTextEntry={secureTextConfirm}
                className="flex-1 px-4 pl-3 text-white text-base"
                onChangeText={setPasswordConfirm}
              />
              <Pressable
                onPress={() => setSecureTextConfirm(!secureTextConfirm)}
                className="pr-4"
              >
                <MaterialIcons
                  name={secureTextConfirm ? "visibility-off" : "visibility"}
                  size={22}
                  color="#94a3b8"
                />
              </Pressable>
            </View>
          </View>

          {/* REGISTER BUTTON */}
          {isLoading ? (
            <View className="pt-6 items-center">
              <ActivityIndicator size="large" color="#267366" />
            </View>
          ) : (
            <View className="pt-6">
              <Pressable
                className="h-14 rounded-xl bg-[#267366] items-center justify-center active:scale-95"
                onPress={handleRegister}
              >
                <Text className="text-white text-base font-bold">
                  Registrarse
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* LOGIN */}
        <View className="mt-10 items-center">
          <Text className="text-slate-400 text-sm mb-4">
            ¿Ya tienes una cuenta?
          </Text>

          <Pressable
            className="flex-row items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5"
            onPress={() => router.push("/login")}
          >
            <Text className="text-[#ffffff] font-semibold">Inicia sesión</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
