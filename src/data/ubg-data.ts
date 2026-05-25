// RJT NEXUS360 — Real Data Layer
// Source: Custo - DRE 2026.csv, Indicadores RH 2026.csv, PPTX charts

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ─── DRE / FINANCEIRO ─────────────────────────────────────────────────────────

export interface DREMonth {
  mes: string;
  faturamento: number;
  cmv: number;
  impostos: number;
  comissao: number;
  folhaAdm: number;
  financeiro: number;
  outras: number;
  restaurante: number;
  consultoria: number;
  contabilidade: number;
  margemBruta: number;
  margemBrutaPct: number;
  resultadoLiquido: number;
}

export const dreData: DREMonth[] = [
  {
    mes: "Jan",
    faturamento: 1092204.73,
    cmv: 746463.25,
    impostos: 234962.62,
    comissao: 28840.94,
    folhaAdm: 47360.86,
    financeiro: 33848.95,
    outras: 44849.55,
    restaurante: 6627.03,
    consultoria: 5500.0,
    contabilidade: 1809.71,
    margemBruta: 345741.48,
    margemBrutaPct: 31.7,
    resultadoLiquido: -58054,
  },
  {
    mes: "Fev",
    faturamento: 1493351.91,
    cmv: 672254.48,
    impostos: 162493.59,
    comissao: 23898.02,
    folhaAdm: 33889.93,
    financeiro: 12738.99,
    outras: 38104.28,
    restaurante: 6225.62,
    consultoria: 5734.0,
    contabilidade: 2523.97,
    margemBruta: 821097.43,
    margemBrutaPct: 55.0,
    resultadoLiquido: 535493,
  },
  {
    mes: "Mar",
    faturamento: 1200628.8,
    cmv: 1139751.49,
    impostos: 271477.45,
    comissao: 4638.1,
    folhaAdm: 30351.16,
    financeiro: 52376.8,
    outras: 47385.62,
    restaurante: 5291.73,
    consultoria: 8326.0,
    contabilidade: 2402.27,
    margemBruta: 60877.31,
    margemBrutaPct: 5.1,
    resultadoLiquido: -361369,
  },
];

// Totais acumulados
export const dreAcumulado = {
  faturamento: dreData.reduce((s, d) => s + d.faturamento, 0),
  cmv: dreData.reduce((s, d) => s + d.cmv, 0),
  margemBruta: dreData.reduce((s, d) => s + d.margemBruta, 0),
  resultadoLiquido: dreData.reduce((s, d) => s + d.resultadoLiquido, 0),
};

// ─── COMERCIAL ────────────────────────────────────────────────────────────────

export interface ComercialMes {
  mes: string;
  volumeUB: number;
  volumeTerceiros: number;
  volumeTotal: number;
  ticketMedio: number;
  ticketMeta: number;
  faturamentoUB: number;
  faturamentoTotal: number;
}

export const comercialMensal: ComercialMes[] = [
  {
    mes: "Jan",
    volumeUB: 10330,
    volumeTerceiros: 10900,
    volumeTotal: 21230,
    ticketMedio: 68.15,
    ticketMeta: 75,
    faturamentoUB: 671339,
    faturamentoTotal: 671759,
  },
  {
    mes: "Fev",
    volumeUB: 13308,
    volumeTerceiros: 10852,
    volumeTotal: 24160,
    ticketMedio: 73.78,
    ticketMeta: 75,
    faturamentoUB: 974579,
    faturamentoTotal: 1042912,
  },
];

export const rankingClientes = [
  { nome: "Elfusa", valor: 854698 },
  { nome: "Mineração Curimbaba", valor: 770948 },
  { nome: "Mineração Jundu", valor: 329543 },
  { nome: "Castrolanda", valor: 123200 },
  { nome: "Comil", valor: 113530 },
  { nome: "Shinagawa", valor: 110075 },
  { nome: "WR Grace", valor: 91775 },
  { nome: "CJ Selecta", valor: 81800 },
  { nome: "Ebazar", valor: 59912 },
  { nome: "Coapeja", valor: 54204 },
];

export const margemVenda = [
  { faixa: "<8%", valor: 33934, pct: 2.7 },
  { faixa: "8-10%", valor: 313098, pct: 24.7 },
  { faixa: "10-12%", valor: 233190, pct: 18.4 },
  { faixa: "12-15%", valor: 813238, pct: 64.1 },
  { faixa: "15-20%", valor: 466936, pct: 36.8 },
  { faixa: ">20%", valor: 12065, pct: 1.0 },
];

export const tiposProduto = [
  { tipo: "Normais", valor: 1219650 },
  { tipo: "Liner", valor: 445589 },
  { tipo: "Gardelon", valor: 146040 },
  { tipo: "Travados", valor: 61183 },
];

export const periodicidade = [
  { tipo: "Mensal", pct: 72 },
  { tipo: "Bimestral", pct: 11 },
  { tipo: "Anual", pct: 9 },
  { tipo: "Semestral", pct: 8 },
  { tipo: "Trimestral", pct: 1 },
];

export const faccionistas = [
  { nome: "Marques", valor: 417527 },
  { nome: "Wanius", valor: 151496 },
  { nome: "Miranda", valor: 142900 },
  { nome: "JR", valor: 117629 },
  { nome: "Cassiano", valor: 54204 },
];

export const orcamentos = [
  { mes: "Jan", abertos: 1608675, fechados: 337821 },
  { mes: "Fev", abertos: 207785, fechados: 92000 },
];

// ─── OPERAÇÕES ────────────────────────────────────────────────────────────────

export interface ProducaoMes {
  mes: string;
  bagUB: number;
  sacarioUB: number;
  marques: number;
  wanius: number;
  miranda: number;
  totalTerceiros: number;
  combustivel: number;
  combustivelOrc: number;
  manutencao: number;
  manutencaoOrc: number;
}

export const producaoMensal: ProducaoMes[] = [
  {
    mes: "Jan",
    bagUB: 11866,
    sacarioUB: 9364,
    marques: 5350,
    wanius: 1200,
    miranda: 1000,
    totalTerceiros: 7550,
    combustivel: 10137,
    combustivelOrc: 10500,
    manutencao: 2165,
    manutencaoOrc: 4100,
  },
  {
    mes: "Fev",
    bagUB: 11150,
    sacarioUB: 11012,
    marques: 5150,
    wanius: 1100,
    miranda: 980,
    totalTerceiros: 7230,
    combustivel: 11340,
    combustivelOrc: 10500,
    manutencao: 1461,
    manutencaoOrc: 4100,
  },
  {
    mes: "Mar",
    bagUB: 11508,
    sacarioUB: 0,
    marques: 0,
    wanius: 0,
    miranda: 0,
    totalTerceiros: 0,
    combustivel: 0,
    combustivelOrc: 10500,
    manutencao: 0,
    manutencaoOrc: 4100,
  },
];

export const eficienciaCostureiras = [
  { faixa: "Afastada", qtd: 1, cor: "#94a3b8" },
  { faixa: "S/Marcação", qtd: 1, cor: "#64748b" },
  { faixa: "<50%", qtd: 0, cor: "#ef4444" },
  { faixa: "50-70%", qtd: 3, cor: "#f59e0b" },
  { faixa: "70-100%", qtd: 12, cor: "#22c55e" },
  { faixa: "100-125%", qtd: 2, cor: "#3b82f6" },
  { faixa: ">125%", qtd: 6, cor: "#a855f7" },
];

// ─── RH ───────────────────────────────────────────────────────────────────────

export interface RHMes {
  mes: string;
  colaboradores: number;
  horasTrabalhadas: number;
  contratacoes: number;
  demissoes: number;
  turnover: number;
  turnoverMeta: number;
  absenteismo: number;
  absenteismoMeta: number;
  hePct: number;
  heMeta: number;
  heValor: number;
  produtividadeGeral: number;
  produtividadeCostureiras: number;
  faturamentoBase: number;
}

export const rhMensal: RHMes[] = [
  {
    mes: "Jan",
    colaboradores: 50,
    horasTrabalhadas: 10770,
    contratacoes: 6,
    demissoes: 4,
    turnover: 10.42,
    turnoverMeta: 6,
    absenteismo: 7.3,
    absenteismoMeta: 5,
    hePct: 2.0,
    heMeta: 2.7,
    heValor: 4842,
    produtividadeGeral: 13435,
    produtividadeCostureiras: 29207,
    faturamentoBase: 671759,
  },
  {
    mes: "Fev",
    colaboradores: 52,
    horasTrabalhadas: 9736,
    contratacoes: 7,
    demissoes: 5,
    turnover: 12.0,
    turnoverMeta: 6,
    absenteismo: 6.11,
    absenteismoMeta: 5,
    hePct: 3.9,
    heMeta: 2.7,
    heValor: 8248,
    produtividadeGeral: 20056,
    produtividadeCostureiras: 40112,
    faturamentoBase: 1042912,
  },
  {
    mes: "Mar",
    colaboradores: 50,
    horasTrabalhadas: 9172,
    contratacoes: 9,
    demissoes: 11,
    turnover: 19.23,
    turnoverMeta: 6,
    absenteismo: 8.35,
    absenteismoMeta: 5,
    hePct: 0,
    heMeta: 2.7,
    heValor: 0,
    produtividadeGeral: 0,
    produtividadeCostureiras: 0,
    faturamentoBase: 0,
  },
];

export const recrutamentoFev = [
  { etapa: "Contatos", qtd: 66 },
  { etapa: "Agendados", qtd: 41 },
  { etapa: "Compareceu", qtd: 28 },
  { etapa: "Aprovados", qtd: 17 },
  { etapa: "Efetivados", qtd: 5 },
];

export const motivosDesligamento = [
  { motivo: "Produtividade", qtd: 3 },
  { motivo: "Melhor salário", qtd: 2 },
];
