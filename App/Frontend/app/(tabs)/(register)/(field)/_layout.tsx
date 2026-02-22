import { Slot } from "expo-router";
import { View } from "react-native";
import { FieldProvider } from "@/context/FieldContext";

function Layout() {
  return (
    <FieldProvider>
      {/* Proveemos el contexto a toda la pantalla de Field y sus hijos */}
      <View className="flex-1 justify-center bg-[#1c1f22]">
        <Slot />
      </View>
    </FieldProvider>
  );
}

export default Layout;
