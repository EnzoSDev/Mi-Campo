import { Stack } from "expo-router";

function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="home"
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="add-field" />
    </Stack>
  );
}
export default Layout;
