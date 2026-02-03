import { Text } from "react-native";
import "../../global.css";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text>Bienvenido a la sección de autenticación</Text>
    </SafeAreaView>
  );
}
