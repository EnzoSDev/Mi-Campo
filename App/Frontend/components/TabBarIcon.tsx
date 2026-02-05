import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  focused: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
}

function TabBarIcon({ focused, icon, title }: Props) {
  return (
    <View className="flex items-center justify-center gap-1 w-16">
      <MaterialIcons
        name={icon}
        size={24}
        color={focused ? "#267366" : "#888888"}
      />
      <Text
        className={`text-xs font-medium ${focused ? "text-[#267366]" : "text-gray-400"}`}
      >
        {title}
      </Text>
    </View>
  );
}

export default TabBarIcon;
