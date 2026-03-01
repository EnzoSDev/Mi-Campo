import { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { campaignAPI } from "@/services/campaignAPI";

function Income() {
  const { campaignId } = useLocalSearchParams();
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState<number>(-1);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const [incomeCategories, setIncomeCategories] = useState<
    { id: number; description: string }[]
  >([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const categories = await campaignAPI.getIncomeCategories();
        setIncomeCategories(categories);
      } catch (error) {
        setError("No se pudieron cargar las categorías de ingresos");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const formatDate = (value: Date | null) => {
    if (!value) return "Seleccionar fecha";
    return value.toLocaleDateString("es-AR");
  };

  const formattedAmount = useMemo(() => {
    const parsed = Number(amount.replace(",", "."));
    if (!amount || Number.isNaN(parsed) || parsed <= 0) return "-";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(parsed);
  }, [amount]);

  const handleSave = async () => {
    const parsed = Number(amount.replace(",", "."));

    if (!concept.trim()) {
      setError("Ingresá el concepto del ingreso.");
      return;
    }

    if (category === -1) {
      setError("Seleccioná una categoría de ingreso.");
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
    setIsLoading(true);

    console.log("Attempting to register income with data:", {
      campaignId,
      category,
      concept,
      amount: parsed,
      date,
      notes,
    });
    try {
      await campaignAPI.registerIncome(
        Number(campaignId),
        category,
        concept,
        parsed,
        date,
        notes,
      );
      router.back();
    } catch (error) {
      setError("Error al registrar el ingreso");
      setIsLoading(false);
    }
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
              {isLoadingCategories ? (
                <View className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 items-center justify-center h-12">
                  <ActivityIndicator size="small" color="#10b981" />
                </View>
              ) : (
                <View className="bg-white/5 border border-white/10 rounded-2xl px-1">
                  <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                    dropdownIconColor="#9ca3af"
                    style={{ color: "white" }}
                  >
                    <Picker.Item
                      label="Seleccionar categoría..."
                      value={-1}
                      enabled={false}
                    />
                    {incomeCategories.map((item) => (
                      <Picker.Item
                        key={item.id}
                        label={item.description}
                        value={item.id}
                      />
                    ))}
                  </Picker>
                </View>
              )}
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
          className={`bg-emerald-500 rounded-2xl py-4 items-center active:opacity-80 ${
            isLoading ? "opacity-70" : ""
          }`}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#0F1113" />
          ) : (
            <Text className="text-[#0F1113] font-bold text-sm">
              Guardar ingreso
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export default Income;
