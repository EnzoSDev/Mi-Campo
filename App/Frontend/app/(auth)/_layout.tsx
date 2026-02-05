import { Slot } from "expo-router";
import "../../global.css";

function Layout() {
  return <Slot screenOptions={{ headerShown: false }} />;
}

export default Layout;
