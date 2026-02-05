import { View, Text, Image, Pressable } from "react-native";
import { router } from "expo-router";
import { userAPI } from "../../services/userAPI";

function Profile() {
  const handleLogout = async () => {
    try {
      await userAPI.logout();
      router.replace("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <View className="flex-1 bg-[#1c1f22] px-6 pt-10">
      <View className="items-center">
        <Image
          source={{ uri: "https://i.pravatar.cc/300" }}
          className="h-32 w-32 rounded-full border-2 border-[#267366]"
        />
        <Text className="mt-4 text-2xl font-semibold text-white">
          Juan Pérez
        </Text>
        <Text className="mt-2 text-base text-gray-300">
          juan.perez@email.com
        </Text>
      </View>

      <View className="mt-10 gap-4">
        <Pressable className="rounded-xl bg-[#2d3136] px-4 py-4">
          <Text className="text-lg font-medium text-white">
            Cambiar contraseña
          </Text>
        </Pressable>
      </View>

      <View className="mt-auto mb-8">
        <Pressable
          className="rounded-xl bg-[#267366] px-4 py-4"
          onPress={handleLogout}
        >
          <Text className="text-center text-lg font-semibold text-white">
            Cerrar sesión
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Profile;
