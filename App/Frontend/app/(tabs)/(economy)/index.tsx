import { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function Economy() {
  const [totalIncome] = useState(250000);
  const [totalExpense] = useState(80000);
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const profit = totalIncome - totalExpense;
  const profitMargin = ((profit / totalIncome) * 100).toFixed(1);

  const transactions = [
    {
      id: 1,
      type: "income",
      field: "Campo Norte",
      lot: "Lote A",
      campaign: "Soja 2024",
      date: "2024-03-01",
      concept: "Venta de soja",
      amount: 50000,
      category: "Venta",
    },
    {
      id: 2,
      type: "expense",
      field: "Campo Norte",
      lot: "Lote A",
      campaign: "Soja 2024",
      date: "2024-02-25",
      concept: "Compra fertilizante",
      amount: 15000,
      category: "Fertilizante",
    },
    {
      id: 3,
      type: "income",
      field: "Campo Sur",
      lot: "Lote B",
      campaign: "Maíz 2024",
      date: "2024-03-02",
      concept: "Venta de maíz",
      amount: 80000,
      category: "Venta",
    },
    {
      id: 4,
      type: "expense",
      field: "Campo Sur",
      lot: "Lote B",
      campaign: "Maíz 2024",
      date: "2024-02-20",
      concept: "Fungicida",
      amount: 8000,
      category: "Fungicida",
    },
    {
      id: 5,
      type: "expense",
      field: "Campo Norte",
      lot: "Lote A",
      campaign: "Soja 2024",
      date: "2024-02-15",
      concept: "Laboreo del terreno",
      amount: 12000,
      category: "Laboreo",
    },
  ];

  const filteredTransactions = transactions.filter((t) => {
    if (activeTab === "income") return t.type === "income";
    if (activeTab === "expense") return t.type === "expense";
    return true;
  });

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
    <View className="flex-1 bg-[#0F1113]">
      {/* Header */}
      <View className="px-4 py-6 border-b border-white/10">
        <Text className="text-2xl font-bold text-white mb-1">Economía</Text>
        <Text className="text-xs text-white/50">
          Resumen de todos tus campos
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6 gap-6">
          {/* Cards principales */}
          <View className="gap-4">
            {/* Ganancia Neta - Destacada */}
            <View className="bg-gradient-to-br from-teal-500/20 to-teal-500/5 border border-teal-500/30 rounded-2xl p-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white/60 text-xs font-semibold tracking-wider">
                  GANANCIA NETA
                </Text>
                <MaterialIcons name="trending-up" size={20} color="#3FA39B" />
              </View>
              <Text className="text-teal-400 text-4xl font-bold mb-2">
                {formatCurrency(profit)}
              </Text>
              <Text className="text-teal-400/80 text-sm font-semibold">
                Margen: {profitMargin}%
              </Text>
            </View>

            {/* Ingresos y Gastos lado a lado */}
            <View className="flex-row gap-4">
              {/* Ingresos */}
              <View className="flex-1 bg-[#141618] border border-teal-500/20 rounded-2xl p-4">
                <View className="flex-row items-center gap-2 mb-3">
                  <View className="bg-teal-500/20 p-2 rounded-lg">
                    <MaterialIcons
                      name="arrow-downward"
                      size={16}
                      color="#3FA39B"
                    />
                  </View>
                  <Text className="text-white/60 text-xs font-semibold">
                    INGRESOS
                  </Text>
                </View>
                <Text className="text-teal-400 text-2xl font-bold">
                  {formatCurrency(totalIncome)}
                </Text>
              </View>

              {/* Gastos */}
              <View className="flex-1 bg-[#141618] border border-rose-500/20 rounded-2xl p-4">
                <View className="flex-row items-center gap-2 mb-3">
                  <View className="bg-rose-500/20 p-2 rounded-lg">
                    <MaterialIcons
                      name="arrow-upward"
                      size={16}
                      color="#f43f5e"
                    />
                  </View>
                  <Text className="text-white/60 text-xs font-semibold">
                    GASTOS
                  </Text>
                </View>
                <Text className="text-rose-400 text-2xl font-bold">
                  {formatCurrency(totalExpense)}
                </Text>
              </View>
            </View>
          </View>

          {/* Divisor */}
          <View className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Transacciones */}
          <View>
            <View className="mb-4">
              <Text className="text-white font-bold text-lg mb-4">
                Movimientos
              </Text>

              {/* Tabs */}
              <View className="flex-row gap-2 mb-4">
                <Pressable
                  onPress={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === "all"
                      ? "bg-teal-500/30 border border-teal-500/50"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      activeTab === "all" ? "text-teal-400" : "text-white/60"
                    }`}
                  >
                    TODOS
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveTab("income")}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === "income"
                      ? "bg-teal-500/30 border border-teal-500/50"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      activeTab === "income" ? "text-teal-400" : "text-white/60"
                    }`}
                  >
                    INGRESOS
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveTab("expense")}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === "expense"
                      ? "bg-rose-500/30 border border-rose-500/50"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      activeTab === "expense"
                        ? "text-rose-400"
                        : "text-white/60"
                    }`}
                  >
                    GASTOS
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
                      className="bg-[#141618] border border-white/10 rounded-xl p-3 active:bg-white/5"
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-1 pr-2">
                          <Text className="text-white font-semibold text-sm">
                            {transaction.concept}
                          </Text>
                        </View>
                        <Text
                          className={`text-sm font-bold ${
                            transaction.type === "income"
                              ? "text-teal-400"
                              : "text-rose-400"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </Text>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <Text className="text-white/60 text-xs">
                            {formatDate(transaction.date)}
                          </Text>
                          <View className="w-px h-4 bg-white/20" />
                          <Text className="text-white/60 text-xs">
                            {transaction.category}
                          </Text>
                        </View>
                        <Text
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            transaction.type === "income"
                              ? "bg-teal-500/20 text-teal-400"
                              : "bg-rose-500/20 text-rose-400"
                          }`}
                        >
                          {transaction.type === "income" ? "Ingreso" : "Gasto"}
                        </Text>
                      </View>
                    </Pressable>
                  ))
                ) : (
                  <View className="bg-[#141618] border border-white/10 rounded-xl p-4 items-center justify-center">
                    <Text className="text-white/60 text-sm">
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
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-[#141618] rounded-2xl border border-white/10 w-full max-w-sm p-6 gap-4">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white font-bold text-lg">Detalles</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={24} color="white" />
              </Pressable>
            </View>

            {selectedTransaction && (
              <View className="gap-4">
                {/* Concepto */}
                <View className="bg-white/5 rounded-lg p-3">
                  <Text className="text-white/60 text-xs font-semibold mb-1">
                    CONCEPTO
                  </Text>
                  <Text className="text-white text-sm">
                    {selectedTransaction.concept}
                  </Text>
                </View>

                {/* Monto */}
                <View className="bg-white/5 rounded-lg p-3">
                  <Text className="text-white/60 text-xs font-semibold mb-1">
                    MONTO
                  </Text>
                  <Text
                    className={`text-lg font-bold ${
                      selectedTransaction.type === "income"
                        ? "text-teal-400"
                        : "text-rose-400"
                    }`}
                  >
                    {selectedTransaction.type === "income" ? "+" : "-"}
                    {formatCurrency(selectedTransaction.amount)}
                  </Text>
                </View>

                {/* Categoría */}
                <View className="bg-white/5 rounded-lg p-3">
                  <Text className="text-white/60 text-xs font-semibold mb-1">
                    CATEGORÍA
                  </Text>
                  <Text className="text-white text-sm">
                    {selectedTransaction.category}
                  </Text>
                </View>

                {/* Fecha */}
                <View className="bg-white/5 rounded-lg p-3">
                  <Text className="text-white/60 text-xs font-semibold mb-1">
                    FECHA
                  </Text>
                  <Text className="text-white text-sm">
                    {formatDate(selectedTransaction.date)}
                  </Text>
                </View>

                {/* Campo */}
                <View className="bg-white/5 rounded-lg p-3">
                  <Text className="text-white/60 text-xs font-semibold mb-1">
                    CAMPO
                  </Text>
                  <Text className="text-white text-sm">
                    {selectedTransaction.field}
                  </Text>
                </View>

                {/* Lote */}
                <View className="bg-white/5 rounded-lg p-3">
                  <Text className="text-white/60 text-xs font-semibold mb-1">
                    LOTE
                  </Text>
                  <Text className="text-white text-sm">
                    {selectedTransaction.lot}
                  </Text>
                </View>

                {/* Campaña */}
                <View className="bg-white/5 rounded-lg p-3">
                  <Text className="text-white/60 text-xs font-semibold mb-1">
                    CAMPAÑA
                  </Text>
                  <Text className="text-white text-sm">
                    {selectedTransaction.campaign}
                  </Text>
                </View>

                {/* Tipo de Transacción */}
                <View className="bg-white/5 rounded-lg p-3">
                  <Text className="text-white/60 text-xs font-semibold mb-1">
                    TIPO DE TRANSACCIÓN
                  </Text>
                  <Text
                    className={`text-sm font-semibold ${
                      selectedTransaction.type === "income"
                        ? "text-teal-400"
                        : "text-rose-400"
                    }`}
                  >
                    {selectedTransaction.type === "income"
                      ? "Ingreso"
                      : "Gasto"}
                  </Text>
                </View>

                {/* Botón cerrar */}
                <Pressable
                  onPress={() => setShowModal(false)}
                  className="bg-teal-500/30 border border-teal-500/50 rounded-lg py-3 mt-2"
                >
                  <Text className="text-teal-400 font-bold text-center text-sm">
                    CERRAR
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Economy;
