import { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import EconomyFilterModal from "@/components/EconomyFilterModal";
import { EconomyData, Transaction } from "@/types/economyTypes";
import { ResponseFieldType } from "@/types/fieldTypes";

function Economy() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [incomes, setIncomes] = useState<EconomyData[]>([]);
  const [expenses, setExpenses] = useState<EconomyData[]>([]);

  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [appliedField, setAppliedField] = useState<string | null>(null);
  const [appliedCampaign, setAppliedCampaign] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const profit = totalIncome - totalExpense;
  const profitMargin =
    totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(1) : "0";

  const handleFieldSelect = (field: string | null) => {
    setSelectedField(field);
    setSelectedCampaign(null);
  };

  const handleCampaignSelect = (campaign: string | null) => {
    setSelectedCampaign(campaign);
  };

  const handleClearFilter = () => {
    setSelectedField(null);
    setSelectedCampaign(null);
  };

  const handleApplyFilter = () => {
    setAppliedField(selectedField);
    setAppliedCampaign(selectedCampaign);
    setShowFilterModal(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1F242A]" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-6 border-b border-[#3B4450]">
        <View className="flex-row items-center justify-between">
          <Text className="text-[32px] font-semibold text-[#F3F4F6]">
            Economía
          </Text>
          <Pressable
            onPress={() => setShowFilterModal(true)}
            className="bg-[#1F4B7A] rounded-xl w-12 h-12 items-center justify-center active:bg-[#255D99]"
          >
            <MaterialIcons name="filter-list" size={24} color="#BFDBFE" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 py-6 gap-5">
          {/* Cards principales */}
          <View className="gap-3">
            {/* Ganancia Neta - Destacada */}
            <View className="bg-[#2A3138] rounded-xl p-5 border border-[#3B4450]">
              <Text className="text-[#2E7D32] text-base font-medium mb-2">
                Ganancia neta
              </Text>
              <Text className="text-[#F3F4F6] text-[34px] font-bold mb-2">
                {formatCurrency(profit)}
              </Text>
              <Text className="text-[#CBD5E1] text-base">
                {profitMargin}% margen
              </Text>
            </View>

            {/* Ingresos y Gastos lado a lado */}
            <View className="flex-row gap-3">
              {/* Ingresos */}
              <View className="flex-1 bg-[#2A3138] rounded-xl p-4 border border-[#3B4450]">
                <Text className="text-[#2E7D32] text-base font-medium mb-2">
                  Ingresos
                </Text>
                <Text className="text-[#F3F4F6] text-2xl font-bold">
                  {formatCurrency(totalIncome)}
                </Text>
              </View>

              {/* Gastos */}
              <View className="flex-1 bg-[#2A3138] rounded-xl p-4 border border-[#3B4450]">
                <Text className="text-[#C62828] text-base font-medium mb-2">
                  Gastos
                </Text>
                <Text className="text-[#F3F4F6] text-2xl font-bold">
                  {formatCurrency(totalExpense)}
                </Text>
              </View>
            </View>
          </View>

          {/* Divisor */}
          <View className="h-px bg-[#3B4450] my-2" />

          {/* Transacciones */}
          <View>
            <View className="mb-4">
              {/* Tabs */}
              <View className="flex-row gap-2 mb-5 bg-[#2A3138] rounded-xl border border-[#3B4450] p-1">
                <Pressable
                  onPress={() => setActiveTab("all")}
                  className={`flex-1 py-2 rounded-lg ${
                    activeTab === "all" ? "bg-[#1F4B7A]" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-base font-medium text-center ${
                      activeTab === "all" ? "text-[#BFDBFE]" : "text-[#CBD5E1]"
                    }`}
                  >
                    Todos
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveTab("income")}
                  className={`flex-1 py-2 rounded-lg ${
                    activeTab === "income" ? "bg-[#1D4D2A]" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-base font-medium text-center ${
                      activeTab === "income"
                        ? "text-[#86EFAC]"
                        : "text-[#CBD5E1]"
                    }`}
                  >
                    Ingresos
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveTab("expense")}
                  className={`flex-1 py-2 rounded-lg ${
                    activeTab === "expense" ? "bg-[#5A1D1D]" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-base font-medium text-center ${
                      activeTab === "expense"
                        ? "text-[#FCA5A5]"
                        : "text-[#CBD5E1]"
                    }`}
                  >
                    Gastos
                  </Text>
                </Pressable>
              </View>

              {/* Lista de transacciones sin scroll */}
              <View className="gap-2">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <Pressable
                      key={transaction.id}
                      onPress={() => {
                        setSelectedTransaction(transaction);
                        setShowModal(true);
                      }}
                      className={`bg-[#2A3138] rounded-xl p-4 border active:opacity-70 ${
                        transaction.type === "income"
                          ? "border-[#315C3C]"
                          : "border-[#6E3A3A]"
                      }`}
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-2 flex-1">
                          <View
                            className={`w-2 h-2 rounded-full ${
                              transaction.type === "income"
                                ? "bg-[#2E7D32]"
                                : "bg-[#C62828]"
                            }`}
                          />
                          <Text className="text-[#F3F4F6] text-base font-medium flex-1">
                            {transaction.concept}
                          </Text>
                        </View>
                        <Text
                          className={`text-base font-semibold ml-2 ${
                            transaction.type === "income"
                              ? "text-[#2E7D32]"
                              : "text-[#C62828]"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-[#CBD5E1] text-sm">
                          {formatDate(transaction.date)}
                        </Text>
                        <Text className="text-[#CBD5E1] text-sm">
                          {transaction.category}
                        </Text>
                      </View>
                    </Pressable>
                  ))
                ) : (
                  <View className="bg-[#2A3138] rounded-lg p-8 items-center justify-center border border-[#3B4450]">
                    <Text className="text-[#CBD5E1] text-base">
                      No hay transacciones
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de detalles */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <Pressable
            onPress={() => setShowModal(false)}
            className="absolute inset-0"
          />
          <View className="bg-[#2A3138] rounded-2xl w-full max-w-sm border border-[#3B4450]">
            {/* Header */}
            <View className="p-5 border-b border-[#3B4450]">
              <View className="flex-row items-center justify-between">
                <Text className="text-[#F3F4F6] text-2xl font-semibold">
                  Detalles
                </Text>
                <Pressable
                  onPress={() => setShowModal(false)}
                  className="bg-[#3B4450] p-3 rounded-lg active:bg-[#4B5563]"
                >
                  <MaterialIcons name="close" size={20} color="#F3F4F6" />
                </Pressable>
              </View>
            </View>

            {selectedTransaction && (
              <ScrollView className="max-h-[500px]">
                <View className="p-5 gap-4">
                  {/* Monto */}
                  <View className="py-4">
                    <Text className="text-[#CBD5E1] text-base mb-2">Monto</Text>
                    <Text
                      className={`text-[34px] font-bold ${
                        selectedTransaction.type === "income"
                          ? "text-[#2E7D32]"
                          : "text-[#C62828]"
                      }`}
                    >
                      {selectedTransaction.type === "income" ? "+" : "-"}
                      {formatCurrency(selectedTransaction.amount)}
                    </Text>
                  </View>

                  <View className="h-px bg-[#3B4450]" />

                  {/* Información */}
                  <View className="gap-3">
                    <View>
                      <Text className="text-[#CBD5E1] text-base mb-1">
                        Concepto
                      </Text>
                      <Text className="text-[#F3F4F6] text-lg">
                        {selectedTransaction.concept}
                      </Text>
                    </View>

                    <View>
                      <Text className="text-[#CBD5E1] text-base mb-1">
                        Categoría
                      </Text>
                      <Text className="text-[#F3F4F6] text-lg">
                        {selectedTransaction.category}
                      </Text>
                    </View>

                    <View>
                      <Text className="text-[#CBD5E1] text-base mb-1">
                        Fecha
                      </Text>
                      <Text className="text-[#F3F4F6] text-lg">
                        {formatDate(selectedTransaction.date)}
                      </Text>
                    </View>

                    <View className="h-px bg-[#3B4450]" />

                    <View>
                      <Text className="text-[#CBD5E1] text-base mb-1">
                        Campo
                      </Text>
                      <Text className="text-[#F3F4F6] text-lg">
                        {selectedTransaction.field}
                      </Text>
                    </View>

                    <View>
                      <Text className="text-[#CBD5E1] text-base mb-1">
                        Lote
                      </Text>
                      <Text className="text-[#F3F4F6] text-lg">
                        {selectedTransaction.lot}
                      </Text>
                    </View>

                    <View>
                      <Text className="text-[#CBD5E1] text-base mb-1">
                        Campaña
                      </Text>
                      <Text className="text-[#F3F4F6] text-lg">
                        {selectedTransaction.campaign}
                      </Text>
                    </View>
                  </View>

                  {/* Botón cerrar */}
                  <Pressable
                    onPress={() => setShowModal(false)}
                    className="bg-[#1565C0] rounded-lg py-4 mt-2 active:bg-[#0F4EA0]"
                  >
                    <Text className="text-white font-semibold text-center text-lg">
                      Cerrar
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Filtros */}
      <EconomyFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        fieldOptions={fields.map((field) => field.fieldName)}
        campaignOptions={campaignOptions}
        selectedField={selectedField}
        selectedCampaign={selectedCampaign}
        onFieldSelect={handleFieldSelect}
        onCampaignSelect={handleCampaignSelect}
        onApplyFilter={handleApplyFilter}
        onClearFilter={handleClearFilter}
      />
    </SafeAreaView>
  );
}

export default Economy;
