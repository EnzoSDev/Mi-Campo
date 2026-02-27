import { Slot } from "expo-router";
import { SafeAreaView } from "react-native";

function Layout() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#1e2125]">
      <Slot />
    </SafeAreaView>
  );
}
export default Layout;
