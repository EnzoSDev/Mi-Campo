import { Tabs } from "expo-router";

// Components
import TabBarIcon from "../../components/TabBarIcon";

function Layout() {
  return (
    <Tabs
      screenOptions={{
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
        name="home"
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
        name="analytics"
        options={{
          title: "Analisis",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="analytics" title="Analisis" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
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
