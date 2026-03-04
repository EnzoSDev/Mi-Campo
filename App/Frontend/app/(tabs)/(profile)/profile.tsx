import { View, Text, Image, Pressable, ScrollView, Modal } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { userAPI } from "../../../services/userAPI";
import { useEffect, useState } from "react";
import UpdateUsernameModal from "../../../components/UpdateUsernameModal";

function Profile() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const [showUpdateUsernameModal, setShowUpdateUsernameModal] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await userAPI.getUserData();
        if (data) {
          setUsername(data.username || "");
          setEmail(data.email || "");
          setCountryCode(data.country_code || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await userAPI.logout();
      router.replace("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <View className="flex-1 bg-[#1c1f22]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 36,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bold text-white mb-6">Mi perfil</Text>

        <View className="bg-[#2d3136] rounded-2xl p-6 border border-white/10 items-center">
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }}
            className="h-28 w-28 rounded-full border-2 border-[#267366]"
          />
          <Text className="mt-4 text-2xl font-semibold text-white">
            {username}&nbsp;
            {countryCode && userAPI.countryCodeToEmoji(countryCode)}
          </Text>
          <Text className="mt-1 text-base text-gray-300">{email}</Text>
          <View className="mt-4 bg-[#267366]/20 rounded-full px-4 py-1">
            <Text className="text-[#8de4d3] text-xs font-semibold">
              Cuenta activa
            </Text>
          </View>
        </View>

        <View className="mt-6 gap-3">
          <Pressable
            onPress={() => setShowUpdateUsernameModal(true)}
            className="rounded-xl bg-[#2d3136] border border-white/10 px-4 py-4 flex-row items-center justify-between active:opacity-80"
          >
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 rounded-lg bg-white/5 items-center justify-center">
                <MaterialIcons name="person" size={20} color="#BFDBFE" />
              </View>
              <Text className="text-base font-medium text-white">
                Cambiar nombre de usuario
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#94a3b8" />
          </Pressable>

          <Pressable className="rounded-xl bg-[#2d3136] border border-white/10 px-4 py-4 flex-row items-center justify-between active:opacity-80">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 rounded-lg bg-white/5 items-center justify-center">
                <MaterialIcons name="photo-camera" size={20} color="#BFDBFE" />
              </View>
              <Text className="text-base font-medium text-white">
                Cambiar foto de perfil
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#94a3b8" />
          </Pressable>

          <Pressable className="rounded-xl bg-[#2d3136] border border-white/10 px-4 py-4 flex-row items-center justify-between active:opacity-80">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 rounded-lg bg-white/5 items-center justify-center">
                <MaterialIcons name="lock" size={20} color="#BFDBFE" />
              </View>
              <Text className="text-base font-medium text-white">
                Cambiar contraseña
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#94a3b8" />
          </Pressable>

          <Pressable className="rounded-2xl bg-[#1F4B7A]/25 border border-[#1F4B7A] px-4 py-4 active:opacity-80">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 rounded-xl bg-[#1F4B7A]/40 items-center justify-center">
                <MaterialIcons name="support-agent" size={20} color="#BFDBFE" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-[#DBEAFE]">
                  Ayuda y soporte
                </Text>
                <Text className="text-xs text-[#BFDBFE]/90 mt-0.5">
                  Reportar problema o contactarte con nosotros
                </Text>
              </View>
              <MaterialIcons name="help-outline" size={20} color="#BFDBFE" />
            </View>
          </Pressable>
        </View>

        <View className="mt-8">
          <Pressable
            className="rounded-xl bg-[#267366] px-4 py-4 flex-row items-center justify-center gap-2 active:opacity-80"
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={20} color="white" />
            <Text className="text-center text-lg font-semibold text-white">
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={showUpdateUsernameModal}
        transparent={true}
        animationType="fade"
      >
        <UpdateUsernameModal
          currentUsername={username}
          onClose={() => setShowUpdateUsernameModal(false)}
          onSuccess={(newUsername) => {
            setUsername(newUsername);
            setShowUpdateUsernameModal(false);
          }}
        />
      </Modal>
    </View>
  );
}

export default Profile;
