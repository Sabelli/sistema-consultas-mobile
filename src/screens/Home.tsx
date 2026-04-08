import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Button, Alert, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Consulta } from "../interfaces/consulta";
import { ConsultaCard } from "../components";
import { styles } from "../styles/app.styles";
// Importa funções do service layer
import { obterConsultas, obterPacienteLogado, removerPacienteLogado, salvarConsultas } from "../services/storage";
import { useFocusEffect } from "@react-navigation/native";

export default function Home({ navigation }: any) {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [nomePaciente, setNomePaciente] = useState("");
  // Carrega dados sempre que a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [])
  );

async function carregarDados() {
  // Verifica se há paciente logado
  const paciente = await obterPacienteLogado();
  if (!paciente) {
    // Se não houver, redireciona para login
    navigation.replace("Login");
    return;
  }
  setNomePaciente(paciente.nome);
  // Carrega consultas do paciente
  const todasConsultas = await obterConsultas();
  const consultasDoPaciente = todasConsultas.filter(
    (c) => c.paciente.id === paciente.id
  );
  setConsultas(consultasDoPaciente);
}

async function confirmarConsulta(consultaId: number) {
  // Atualiza estado local
  const consultasAtualizadas = consultas.map((c) =>
    c.id === consultaId ? { ...c, status: "confirmada" as const } : c
  );
  setConsultas(consultasAtualizadas);
  
  // Atualiza todas as consultas no storage
  const todasConsultas = await obterConsultas();
  const consultasAtualizadasCompletas = todasConsultas.map((c) =>
    c.id === consultaId ? { ...c, status: "confirmada" as const } : c
  );
  await salvarConsultas(consultasAtualizadasCompletas);
}
async function cancelarConsulta(consultaId: number) {
  // Atualiza estado local
  const consultasAtualizadas = consultas.map((c) =>
    c.id === consultaId ? { ...c, status: "cancelada" as const } : c
  );
  setConsultas(consultasAtualizadas);
  
  // Atualiza todas as consultas no storage
  const todasConsultas = await obterConsultas();
  const consultasAtualizadasCompletas = todasConsultas.map((c) =>
    c.id === consultaId ? { ...c, status: "cancelada" as const } : c
  );
  await salvarConsultas(consultasAtualizadasCompletas);
}

async function handleLogout() {
  Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
    { text: "Cancelar", style: "cancel" },
    {
      text: "Sair",
      onPress: async () => {
        console.log("Fazendo logout...");
        await removerPacienteLogado();
        console.log("Paciente removido, navegando para Login");
        navigation.replace("Login");
      },
    },
  ]);
}

return (
  <View style={styles.container}>
    <StatusBar style="light" />
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Olá, {nomePaciente}! </Text>
        <Text style={styles.subtitulo}>
          {consultas.length} consulta(s) agendada(s)
        </Text>
      </View>
      {/* Botões de ação */}
      <View style={{ marginBottom: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#4CAF50",
            padding: 16,
            borderRadius: 10,
            marginBottom: 10,
          }}
          onPress={() => navigation.navigate("Agendamento")}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold", 
            textAlign: "center" }}>
            + Agendar Nova Consulta
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            padding: 12,
            borderRadius: 10,
          }}
          onPress={handleLogout}
        >
          <Text style={{ color: "#fff", fontSize: 14, textAlign: "center" }}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>
      {/* Lista de consultas */}
      {consultas.length === 0 ? (
        <View style={{ 
          backgroundColor: "rgba(255,255,255,0.1)", 
          padding: 30, 
          borderRadius: 15, 
          alignItems: "center" 
        }}>
          <Text style={{ fontSize: 40, marginBottom: 15 }}>📅</Text>
          <Text style={{ color: "#fff", fontSize: 18, marginBottom: 10, 
            textAlign: "center" }}>
            Você ainda não tem consultas agendadas
          </Text>
        </View>
      ) : (
        consultas.map((consulta) => (
          <ConsultaCard
            key={consulta.id}
            consulta={consulta}
            onConfirmar={confirmarConsulta}
            onCancelar={cancelarConsulta}
          />
        ))
      )}
    </ScrollView>
  </View>
);








}