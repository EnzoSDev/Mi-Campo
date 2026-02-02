import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Link } from "expo-router";

// Services
import { userAPI } from "../services/userAPI";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    if (!email || !password) {
      setErrorMessage("Por favor, completa todos los campos.");
      setIsLoading(false);
    } else {
      setErrorMessage("");
      try {
        await userAPI.login(email, password);
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
        {/* LOGO */}
        <View className="items-center mb-8">
          <Image
            source={require("../assets/images/Logo.png")}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>

        {/* TITULO */}
        <View className="mb-8 items-center">
          <Text className="text-white text-[32px] font-bold text-center">
            Bienvenido a <Text className="text-[#267366]">Mi Campo</Text>
          </Text>
          <Text className="text-slate-400 text-base mt-2">
            Ingresa para gestionar tus campos
          </Text>
        </View>

        {/* FORM */}
        <View>
          {errorMessage ? (
            <Text className="text-red-500 mb-2">{errorMessage}</Text>
          ) : null}
        </View>
        <View className="space-y-4">
          {/* EMAIL */}
          <View className="h-14">
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
          {/* PASSWORD */}
          <View className="h-14 mt-5 ">
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
          {/* FORGOT */}
          <View className="items-end pt-1">
            <Pressable>
              <Text className="text-[#267366] text-sm font-medium">
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>
          </View>
          {/* LOGIN BUTTON */}
          {isLoading ? (
            <View className="pt-6 items-center">
              <ActivityIndicator size="large" color="#267366" />
            </View>
          ) : (
            <View className="pt-6">
              <Pressable
                className="h-14 rounded-xl bg-[#267366] items-center justify-center active:scale-95"
                onPress={handleLogin}
              >
                <Text className="text-white text-base font-bold">Ingresar</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* REGISTER */}
        <View className="mt-10 items-center">
          <Text className="text-slate-400 text-sm mb-4">
            ¿No tienes una cuenta?
          </Text>

          <Link href="/register" asChild>
            <Pressable className="flex-row items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5">
              <MaterialIcons name="add" size={20} color="#267366" />
              <Text className="text-white font-semibold">Regístrate</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
