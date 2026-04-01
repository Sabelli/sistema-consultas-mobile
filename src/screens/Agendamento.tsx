import { useEffect, useState } from "react";
import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import { obterConsultas, obterEspecialidades, obterMedicos, obterPacienteLogado, salvarConsultas } from "../services/storage";
import { Alert } from "react-native";
import { Consulta } from "../interfaces/consulta";

export default function Agendamento({ navigation }: any) {
    const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [medicosFiltrados, setMedicosFiltrados] = useState<Medico[]>([]);
    const [especialidadeSelecionada, setEspecialidadeSelecionada] =
        useState<Especialidade | null>(null);
    const [medicoSelecionado, setMedicoSelecionado] = useState<Medico | null>(null);
    const [dataConsulta, setDataConsulta] = useState("");
    useEffect(() => {
        carregarDados();
    }, []);
    async function carregarDados() {
        const esps = await obterEspecialidades();
        const meds = await obterMedicos();
        setEspecialidades(esps);
        setMedicos(meds);
    }

    // Filtra médicos quando uma especialidade é selecionada
    function selecionarEspecialidade(esp: Especialidade) {
        setEspecialidadeSelecionada(esp);
        setMedicoSelecionado(null); // Reseta médico ao mudar especialidade
        // Filtra médicos da especialidade
        const medicosEsp = medicos.filter((m) => m.especialidade.id === esp.id);
        setMedicosFiltrados(medicosEsp);
    }

    async function agendarConsulta() {
        // Validações
        if (!especialidadeSelecionada) {
            Alert.alert("Atenção", "Selecione uma especialidade");
            return;
        }
        if (!medicoSelecionado) {
            Alert.alert("Atenção", "Selecione um médico");
            return;
        }
        if (!dataConsulta) {
            Alert.alert("Atenção", "Informe a data da consulta");
            return;
        }
        // Valida formato da data
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataConsulta)) {
            Alert.alert("Erro", "Use o formato DD/MM/AAAA para a data");
            return;
        }
        try {
            // Busca paciente logado
            const paciente = await obterPacienteLogado();
            if (!paciente) {
                Alert.alert("Erro", "Você precisa estar logado para agendar");
                navigation.replace("Login");
                return;
            }
            // Converte data
            const [dia, mes, ano] = dataConsulta.split("/");
            const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
            // Valida se a data não é no passado
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            if (data < hoje) {
                Alert.alert("Erro", "Não é possível agendar consultas no passado");
                return;
            }
            // Cria nova consulta
            const novaConsulta: Consulta = {
                id: Date.now(),
                medico: medicoSelecionado,
                paciente: paciente,
                data: data,
                valor: 350,
                status: "agendada",
                observacoes: `Consulta agendada via app`,
            };
            // Salva consulta
            const consultas = await obterConsultas();
            await salvarConsultas([...consultas, novaConsulta]);
            Alert.alert(
                "Sucesso!",
                `Consulta agendada com ${medicoSelecionado.nome} para ${dataConsulta}`,
                [
                    {
                        text: "Ver minhas consultas",
                        onPress: () => navigation.navigate("Home"),
                    },
                ]
            );
            // Limpa formulário
            setEspecialidadeSelecionada(null);
            setMedicoSelecionado(null);
            setDataConsulta("");
            setMedicosFiltrados([]);
        } catch (erro) {
            console.error("Erro ao agendar:", erro);
            Alert.alert("Erro", "Não foi possível agendar a consulta");
        }
    }
}