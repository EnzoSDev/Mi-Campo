import { Tabs, router } from "expo-router";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";

function Layout() {
  const [activeTab, setActiveTab] = useState("lots");

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#1c1f22",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.1)",
          paddingTop: 16,
        }}
      >
        {/* Top Bar */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          {/* Back Button */}
          <TouchableOpacity
            className="p-2 rounded-full bg-background-dark mr-2"
            onPress={() => router.replace("/(tabs)/(register)/home")}
          >
            <MaterialIcons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>

          {/* Title */}
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: "#fff",
                textAlign: "center",
              }}
            >
              Mi Campo
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.5)",
                textAlign: "center",
                marginTop: 2,
                fontWeight: "600",
                letterSpacing: 1,
              }}
            >
              Mar del Plata, Argentina
            </Text>
          </View>
        </View>

        {/* Tabs Bar */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 9,
              padding: 2,
              flexDirection: "row",
              gap: 4,
            }}
          >
            <Pressable
              onPress={() => setActiveTab("lots")}
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 7,
                backgroundColor:
                  activeTab === "lots" ? "#2d3136" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color:
                    activeTab === "lots" ? "#fff" : "rgba(255,255,255,0.6)",
                }}
              >
                Lotes
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab("paddocks")}
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 7,
                backgroundColor:
                  activeTab === "paddocks" ? "#2d3136" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color:
                    activeTab === "paddocks" ? "#fff" : "rgba(255,255,255,0.6)",
                }}
              >
                Potreros
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Content */}
      <Tabs
        screenOptions={{
          sceneStyle: { backgroundColor: "#1c1f22" },
          headerShown: false,
          tabBarPosition: "top",
          lazy: false,
          tabBarStyle: {
            height: 0,
            display: "none",
          },
        }}
      >
        <Tabs.Screen
          name="lots"
          options={{
            title: "Lotes",
            tabBarIcon: () => null,
          }}
        />

        <Tabs.Screen
          name="paddocks"
          options={{
            title: "Potreros",
            tabBarIcon: () => null,
          }}
        />
      </Tabs>
    </View>
  );
}

export default Layout;
