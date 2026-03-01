import { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

function Income() {
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState<
    "Venta" | "Subsidio" | "Servicio" | "Otro"
  >("Venta");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const categories = ["Venta", "Subsidio", "Servicio", "Otro"] as const;

  const formatDate = (value: Date | null) => {
    if (!value) return "Seleccionar fecha";
    return value.toLocaleDateString("es-AR");
  };

  const formattedAmount = useMemo(() => {
    const parsed = Number(amount.replace(",", "."));
    if (!amount || Number.isNaN(parsed) || parsed <= 0) return "-";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 2,
    }).format(parsed);
  }, [amount]);

  const handleSave = () => {
    const parsed = Number(amount.replace(",", "."));

    if (!concept.trim()) {
      setError("Ingresá el concepto del ingreso.");
      return;
    }

    if (Number.isNaN(parsed) || parsed <= 0) {
      setError("Ingresá un monto válido mayor a 0.");
      return;
    }

    if (!date) {
      setError("Seleccioná una fecha válida.");
      return;
    }

    setError("");
    Alert.alert("Ingreso registrado", "El ingreso se registró correctamente.", [
      {
        text: "Aceptar",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-[#0F1113]">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-white/10">
        <Pressable className="p-1" onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={28} color="#3FA39B" />
        </Pressable>
        <Text className="text-lg font-bold text-white">Registrar Ingreso</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
      >
        <View className="bg-[#141618] border border-white/10 rounded-3xl p-5">
          <View className="absolute inset-x-0 top-0 h-1 bg-emerald-500/60 rounded-t-3xl" />

          <Text className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
            Datos del ingreso
          </Text>

          {error ? (
            <View className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-xl flex-row items-center gap-2">
              <MaterialIcons name="error-outline" size={18} color="#ef4444" />
              <Text className="text-red-300 text-xs flex-1">{error}</Text>
            </View>
          ) : null}

          <View className="gap-4">
            <View>
              <Text className="text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-2">
                Concepto
              </Text>
              <TextInput
                value={concept}
                onChangeText={setConcept}
                placeholder="Ej: Venta de soja"
                placeholderTextColor="#9ca3af"
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white"
              />
            </View>

            <View>
              <Text className="text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-2">
                Monto
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="Ej: 250000"
                placeholderTextColor="#9ca3af"
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white"
              />
              <Text className="text-xs text-emerald-400 mt-2">
                Vista previa: {formattedAmount}
              </Text>
            </View>

            <View>
              <Text className="text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-2">
                Fecha
              </Text>
              <Pressable
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3"
                onPress={() => setShowDatePicker(true)}
              >
                <Text className={date ? "text-white" : "text-white/50"}>
                  {formatDate(date)}
                </Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={date ?? new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}
            </View>

            <View>
              <Text className="text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-2">
                Categoría
              </Text>
              <View className="bg-white/5 border border-white/10 rounded-2xl px-1">
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                  style={{
                    color: "white",
                    height: 50,
                  }}
                  dropdownIconColor="#9ca3af"
                >
                  {categories.map((item) => (
                    <Picker.Item key={item} label={item} value={item} />
                  ))}
                </Picker>
              </View>
            </View>

            <View>
              <Text className="text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-2">
                Notas (opcional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Detalle adicional..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white min-h-[100px]"
                style={{ textAlignVertical: "top" }}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-5 pb-6 pt-3 border-t border-white/10 bg-[#0F1113]">
        <Pressable
          className="bg-emerald-500 rounded-2xl py-4 items-center active:opacity-80"
          onPress={handleSave}
        >
          <Text className="text-[#0F1113] font-bold text-sm">
            Guardar ingreso
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Income;
