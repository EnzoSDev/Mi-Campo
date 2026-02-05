import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";

function Layout() {
  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  return (
    <SafeAreaView className="flex-1 justify-center bg-[#1c1f22]">
      <Slot />
    </SafeAreaView>
  );
}

export default Layout;
