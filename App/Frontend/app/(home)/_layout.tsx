import { Redirect, Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

function HomeLayout() {
  const sessionActive = false;
  if (!sessionActive) {
    return <Redirect href="/login" />;
  }
  return (
    <SafeAreaView>
      <Slot />;
    </SafeAreaView>
  );
}

export default HomeLayout;
