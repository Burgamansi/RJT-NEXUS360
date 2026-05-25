import type { ModuleDefinition } from "../types/modules.js";

export const systemModules: ModuleDefinition[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Visao executiva e indicadores principais.",
    order: 10,
    sidebar: true,
    routeBase: "/dashboard",
  },
  {
    id: "financeiro",
    label: "Financeiro",
    description: "DRE, fluxo financeiro, analises e exportacoes.",
    order: 20,
    sidebar: true,
    routeBase: "/financeiro",
  },
  {
    id: "rh",
    label: "RH",
    description: "Indicadores e operacoes de recursos humanos.",
    order: 30,
    sidebar: true,
    routeBase: "/rh",
  },
  {
    id: "qualidade",
    label: "Qualidade",
    description: "SGQ, nao conformidades e melhoria continua.",
    order: 40,
    sidebar: true,
    routeBase: "/qualidade",
  },
  {
    id: "operacoes",
    label: "Operacoes",
    description: "Producao, capacidade, eficiencia e rotina operacional.",
    order: 50,
    sidebar: true,
    routeBase: "/operacoes",
  },
  {
    id: "compras",
    label: "Compras",
    description: "Fornecedores, requisicoes, compras e custos.",
    order: 60,
    sidebar: true,
    routeBase: "/compras",
  },
  {
    id: "comercial",
    label: "Comercial",
    description: "Clientes, vendas, pipeline e performance comercial.",
    order: 70,
    sidebar: true,
    routeBase: "/comercial",
  },
  {
    id: "auditoria",
    label: "Auditoria",
    description: "Eventos, trilhas de auditoria e rastreabilidade.",
    order: 80,
    sidebar: true,
    routeBase: "/auditoria",
  },
  {
    id: "uploads",
    label: "Uploads",
    description: "Importacao e gestao de arquivos.",
    order: 90,
    sidebar: true,
    routeBase: "/uploads",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Configuracoes, usuarios, plano e permissoes.",
    order: 100,
    sidebar: true,
    routeBase: "/admin",
  },
];

export const sidebarModules = systemModules
  .filter((module) => module.sidebar)
  .sort((a, b) => a.order - b.order);
