import { Tabs } from "expo-router";

// Components
import TabBarIcon from "../../components/TabBarIcon";

function Layout() {
  return (
    <Tabs
      screenOptions={{
        sceneStyle: { backgroundColor: "#2d3136w" },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#2d3136",
          height: 70,
          paddingBottom: 15,
          paddingTop: 15,
        },
      }}
    >
      <Tabs.Screen
        name="(register)"
        options={{
          title: "Registro",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon="app-registration"
              title="Registro"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(analytics)/analytics"
        options={{
          title: "Analisis",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="analytics" title="Analisis" />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)/profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="person" title="Perfil" />
          ),
        }}
      />
    </Tabs>
  );
}

export default Layout;
