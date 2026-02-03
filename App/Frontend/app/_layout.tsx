import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

function Layout() {
  return (
    <SafeAreaView className="flex-1 bg-[#1c1f22]">
      <Slot screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}

export default Layout;
