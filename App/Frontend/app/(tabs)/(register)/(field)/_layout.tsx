import { Slot } from "expo-router";
import { SafeAreaView } from "react-native";

function Layout() {
  return (
    <SafeAreaView className="flex-1 justify-center bg-[#1c1f22]">
      <Slot />
    </SafeAreaView>
  );
}

export default Layout;
