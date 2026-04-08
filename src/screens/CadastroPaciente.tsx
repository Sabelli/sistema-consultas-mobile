import { useEffect, useState } from "react";
import { obterPacienteLogado, obterPacientes, salvarPacienteLogado, salvarPacientes } from "../services/storage";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, TouchableOpacity, View, Text, TextInput } from "react-native";
import { Paciente } from "../types/paciente";
import { styles } from "../styles/cadastroPaciente.styles";
import React from "react";

export default function CadastroPaciente({ navigation }: any) {
    const [cpf, setCpf] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [etapa, setEtapa] = useState<"cpf" | "cadastro">("cpf");
    const [verificando, setVerificando] = useState(false);
    const [erro, setErro] = useState("");

    // Reseta o formulário quando a tela é focada
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            console.log("Tela de Login focada - verificando sessão");

            // Primeiro verifica se há um paciente logado
            try {
                const pacienteLogado = await obterPacienteLogado();
                if (pacienteLogado) {
                    console.log("Paciente já está logado:", pacienteLogado.nome);
                    console.log("Redirecionando para Home...");
                    navigation.replace("Home");
                    return; // Importante: sai da função
                }
                console.log("Nenhum paciente logado - mostrando tela de login");
            } catch (e) {
                console.error("Erro ao verificar paciente logado:", e);
            }

            // Se não há paciente logado, reseta o estado
            setEtapa("cpf");
            setCpf("");
            setNome("");
            setEmail("");
            setTelefone("");
            setErro("");
            setVerificando(false);
        });
        return unsubscribe;
    }, [navigation]);

    function validarCPF(cpf: string): boolean {
        const cpfLimpo = cpf.replace(/\D/g, "");
        return cpfLimpo.length === 11;
    }

    async function verificarCPF() {
        setErro(""); // Limpa erro anterior

        if (!cpf.trim()) {
            Alert.alert("Erro", "Por favor, preencha seu CPF");
            return;
        }
        if (!validarCPF(cpf)) {
            Alert.alert("Erro", "CPF deve ter 11 dígitos");
            return;
        }
        try {
            setVerificando(true);
            const pacientes = await obterPacientes();

            // Logs de debug (podem ser removidos em produção)
            console.log("Total de pacientes no storage:", pacientes.length);
            console.log("CPF buscado (sem formatação):", cpf.replace(/\D/g, ""));

            // Verifica se já existe um paciente com este CPF
            // Remove formatação de ambos os lados para garantir match
            const pacienteExistente = pacientes.find(
                (p) => p.cpf.replace(/\D/g, "") === cpf.replace(/\D/g, "")
            );
            if (pacienteExistente) {
                console.log("Paciente encontrado:", pacienteExistente.nome);
                // Paciente já cadastrado - faz login automaticamente
                await salvarPacienteLogado(pacienteExistente);
                console.log("Login realizado! Navegando para Home...");
                navigation.replace("Home");
            } else {
                console.log("Paciente NÃO encontrado");
                // CPF não encontrado - exibe mensagem de erro
                setErro("CPF não encontrado no cadastro. Verifique se digitou corretamente.");
            }
        } catch (erro) {
            console.error("Erro ao verificar CPF:", erro);
            Alert.alert("Erro", "Não foi possível verificar o CPF");
        } finally {
            setVerificando(false);
        }
    }

    async function completarCadastro() {
        // Validações
        if (!nome.trim()) {
            Alert.alert("Erro", "Por favor, preencha seu nome");
            return;
        }
        if (!email.trim()) {
            Alert.alert("Erro", "Por favor, preencha seu email");
            return;
        }
        try {
            setVerificando(true);

            // Cria novo paciente
            const novoPaciente: Paciente = {
                id: Date.now(),
                nome: nome.trim(),
                cpf: cpf.trim(),
                email: email.trim(),
                telefone: telefone.trim() || undefined,
            };
            // Adiciona à lista e salva
            const pacientes = await obterPacientes();
            const novaLista = [...pacientes, novoPaciente];
            await salvarPacientes(novaLista);

            // Loga o paciente automaticamente
            await salvarPacienteLogado(novoPaciente);
            console.log("Cadastro realizado! Navegando para Home...");
            navigation.replace("Home");
        } catch (erro) {
            console.error("Erro ao cadastrar:", erro);
            Alert.alert("Erro", "Não foi possível realizar o cadastro");
        } finally {
            setVerificando(false);
        }
    }
return (
  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    {/* <StatusBar style="light" /> */}
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.icone}>TDSPO</Text>
        <Text style={styles.titulo}>Bem-vindo!</Text>
        <Text style={styles.subtitulo}>
          {etapa === "cpf" 
            ? "Informe seu CPF para continuar"
            : "Complete seu cadastro"}
        </Text>
      </View>
      <View style={styles.form}>
        {/* ETAPA 1: Verificação de CPF */}
        {etapa === "cpf" && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>CPF *</Text>
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                value={cpf}
                onChangeText={(texto) => {
                  setCpf(texto);
                  setErro(""); // Limpa o erro ao digitar
                }}
                keyboardType="numeric"
                maxLength={14}
                editable={!verificando}
              />
            </View>
            <TouchableOpacity 
              style={[styles.botao, verificando && styles.botaoDesabilitado]} 
              onPress={verificarCPF}
              disabled={verificando}
            >
              <Text style={styles.botaoTexto}>
                {verificando ? "Verificando..." : "Continuar"}
              </Text>
            </TouchableOpacity>
            {/* Mensagem de erro com link para cadastro */}
            {erro && (
              <View style={styles.erroContainer}>
                <Text style={styles.erroTexto}>{erro}</Text>
                <TouchableOpacity 
                  style={styles.botaoCadastro} 
                  onPress={() => setEtapa("cadastro")}
                >
                  <Text style={styles.botaoCadastroTexto}>
                    Fazer cadastro agora
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.infoContainer}>
              <Text style={styles.infoTexto}>
                Se você já é cadastrado, faremos login automaticamente.
              </Text>
            </View>
          </>
        )}
        {/* ETAPA 2: Completar Cadastro */}
        {etapa === "cadastro" && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>CPF</Text>
              <TextInput
                style={[styles.input, styles.inputDesabilitado]}
                value={cpf}
                editable={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome Completo *</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome completo"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
                editable={!verificando}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!verificando}
              />
            </View>
            <TouchableOpacity 
              style={[styles.botao, verificando && styles.botaoDesabilitado]} 
              onPress={completarCadastro}
              disabled={verificando}
            >
              <Text style={styles.botaoTexto}>
                {verificando ? "Cadastrando..." : "Finalizar Cadastro"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.botaoVoltar} 
              onPress={() => setEtapa("cpf")}
              disabled={verificando}
            >
              <Text style={styles.botaoVoltarTexto}>← Voltar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);
}