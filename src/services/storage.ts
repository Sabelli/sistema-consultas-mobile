import AsyncStorage from "@react-native-async-storage/async-storage";
import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import { Consulta } from "../interfaces/consulta";
import { Paciente } from "../types/paciente";
import { especialidadesIniciais, medicosIniciais, pacientesIniciais } from "../data/seedData";

// Definição das chaves usadas no AsyncStorage
const KEYS = {
  ESPECIALIDADES: "@consultas:especialidades",
  MEDICOS: "@consultas:medicos",
  CONSULTAS: "@consultas:consultas",
  PACIENTE_LOGADO: "@consultas:pacienteLogado",  // NOVO
  PACIENTES: "@consultas:pacientes",              // NOVO
};

// ========== PACIENTES ==========
// Salva lista de pacientes
export async function salvarPacientes(pacientes: Paciente[]) {
  try {
    await AsyncStorage.setItem(KEYS.PACIENTES, JSON.stringify(pacientes));
  } catch (erro) {
    console.error("Erro ao salvar pacientes:", erro);
  }
}

// Busca lista de pacientes
export async function obterPacientes(): Promise<Paciente[]> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.PACIENTES);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error("Erro ao obter pacientes:", erro);
    return [];
  }
}

// Salva paciente logado
export async function salvarPacienteLogado(paciente: Paciente) {
  try {
    console.log("Salvando paciente logado:", paciente.nome, `(${paciente.cpf})`);
    await AsyncStorage.setItem(KEYS.PACIENTE_LOGADO, JSON.stringify(paciente));
    console.log("Paciente salvo no storage com sucesso");
  } catch (erro) {
    console.error("Erro ao salvar paciente logado:", erro);
  }
}
// Busca paciente logado
export async function obterPacienteLogado(): Promise<Paciente | null> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.PACIENTE_LOGADO);
    const paciente = dados ? JSON.parse(dados) : null;
    console.log("obterPacienteLogado - Resultado:", 
      paciente ? `${paciente.nome} (${paciente.cpf})` : "nenhum");
    return paciente;
  } catch (erro) {
    console.error("Erro ao obter paciente logado:", erro);
    return null;
  }
}

// Remove paciente logado (logout)
export async function removerPacienteLogado() {
  try {
    console.log("Antes do logout - verificando storage...");
    const antes = await AsyncStorage.getItem(KEYS.PACIENTE_LOGADO);
    console.log("Paciente antes do logout:", 
      antes ? JSON.parse(antes).nome : "nenhum");
    
    await AsyncStorage.removeItem(KEYS.PACIENTE_LOGADO);
    console.log("AsyncStorage.removeItem executado");
    
    const depois = await AsyncStorage.getItem(KEYS.PACIENTE_LOGADO);
    console.log("Paciente após logout:", 
      depois ? JSON.parse(depois).nome : "nenhum (logout bem-sucedido)");
  } catch (erro) {
    console.error("Erro ao fazer logout:", erro);
  }
}

// ========== INICIALIZAÇÃO ==========
export async function inicializarDados() {
  try {
    console.log("Iniciando sistema...");
    
    // Verifica se já existem especialidades
    const especialidades = await obterEspecialidades();
    console.log(`Especialidades no storage: ${especialidades.length}`);
    if (especialidades.length === 0) {
      console.log("Cadastrando especialidades iniciais...");
      await salvarEspecialidades(especialidadesIniciais);
    }
    // Verifica se já existem médicos
    const medicos = await obterMedicos();
    console.log(`Médicos no storage: ${medicos.length}`);
    if (medicos.length === 0) {
      console.log("Cadastrando médicos iniciais...");
      await salvarMedicos(medicosIniciais);
    }
    // Verifica se já existem pacientes
    const pacientes = await obterPacientes();
    console.log(`Pacientes no storage: ${pacientes.length}`);
    console.log("Lista de pacientes:", 
      pacientes.map(p => ({ nome: p.nome, cpf: p.cpf })));
    
    if (pacientes.length === 0) {
      console.log("Cadastrando pacientes de teste...");
      await salvarPacientes(pacientesIniciais);
    }
    console.log("Sistema inicializado com sucesso!");
  } catch (erro) {
    console.error("Erro ao inicializar dados:", erro);
  }
}

// ========== ESPECIALIDADES ==========
// Salva array de especialidades no AsyncStorage
export async function salvarEspecialidades(especialidades: Especialidade[]) {
  try {
    await AsyncStorage.setItem(
      KEYS.ESPECIALIDADES,
      JSON.stringify(especialidades)
    );
  } catch (erro) {
    console.error("Erro ao salvar:", erro);
  }
}

// Busca array de especialidades do AsyncStorage
export async function obterEspecialidades(): Promise<Especialidade[]> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.ESPECIALIDADES);
    return dados ? JSON.parse(dados) : []; // Retorna array vazio se não houver dados
  } catch (erro) {
    console.error("Erro ao obter:", erro);
    return [];
  }
}

// ========== MÉDICOS ==========
// Salva array de médicos no AsyncStorage
export async function salvarMedicos(medicos: Medico[]) {
  try {
    await AsyncStorage.setItem(KEYS.MEDICOS, JSON.stringify(medicos));
  } catch (erro) {
    console.error("Erro ao salvar:", erro);
  }
}

// Busca array de médicos do AsyncStorage
export async function obterMedicos(): Promise<Medico[]> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.MEDICOS);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error("Erro ao obter:", erro);
    return [];
  }
}

// ========== CONSULTAS ==========
// Salva array de consultas no AsyncStorage
export async function salvarConsultas(consultas: Consulta[]) {
  try {
    await AsyncStorage.setItem(KEYS.CONSULTAS, JSON.stringify(consultas));
  } catch (erro) {
    console.error("Erro ao salvar:", erro);
  }
}

// Busca array de consultas do AsyncStorage
export async function obterConsultas(): Promise<Consulta[]> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.CONSULTAS);
    if (dados) {
      const consultas = JSON.parse(dados);
      // Reconverte strings de data para objetos Date
      return consultas.map((c: any) => ({
        ...c,
        data: new Date(c.data),
      }));
    }
    return [];
  } catch (erro) {
    console.error("Erro ao obter:", erro);
    return [];
  }
}