// RJT NEXUS360 — Static Demo Data
// This data is used ONLY when companyId === 'demo_company'

export const DEMO_METRICS = {
  finance: [
    // ── Janeiro 2026 — DRE Estruturado ───────────────────────────────────────
    // Receita
    { name: "faturamento",      value: 1500000.00, period: "2026-01" },
    // Deduções da receita bruta
    { name: "impostos",         value: 162000.00,  period: "2026-01" }, // 10.8% fat
    { name: "comissao",         value: 45000.00,   period: "2026-01" }, // 3.0% fat (desp. vendas)
    // Receita Líquida calculada = 1.293.000
    { name: "receita_liquida",  value: 1293000.00, period: "2026-01" },
    // CMV (matéria-prima + produção)
    { name: "cmv",              value: 1050000.00, period: "2026-01" }, // 70.0% fat
    { name: "cmv_pct",          value: 70.0,       period: "2026-01" },
    // ADM (despesas operacionais)
    { name: "folhaAdm",         value: 150000.00,  period: "2026-01" },
    { name: "financeiro",       value: 25000.00,   period: "2026-01" },
    { name: "outras",           value: 25000.00,   period: "2026-01" },
    { name: "restaurante",      value: 5000.00,    period: "2026-01" },
    { name: "consultoria",      value: 3000.00,    period: "2026-01" },
    { name: "contabilidade",    value: 2000.00,    period: "2026-01" },
    { name: "adm_total",        value: 210000.00,  period: "2026-01" }, // 14.0% fat
    { name: "adm_pct",          value: 14.0,       period: "2026-01" },
    // EBITDA = Rec. Líq. - CMV - ADM = 1.293.000 - 1.050.000 - 210.000 = 33.000
    { name: "ebitda",           value: 33000.00,   period: "2026-01" },
    { name: "ebitda_pct",       value: 2.2,        period: "2026-01" },
    // Resultado Financeiro (aplicações - empréstimos)
    { name: "result_financeiro", value: -22000.00, period: "2026-01" },
    { name: "resultado_liquido", value: 11000.00,  period: "2026-01" },
    { name: "caixa_final",      value: 320000.00,  period: "2026-01" },

    // ── Fevereiro 2026 — DRE Estruturado ─────────────────────────────────────
    { name: "faturamento",      value: 1650000.00, period: "2026-02" },
    { name: "impostos",         value: 178200.00,  period: "2026-02" }, // 10.8%
    { name: "comissao",         value: 49500.00,   period: "2026-02" }, // 3.0%
    { name: "receita_liquida",  value: 1422300.00, period: "2026-02" },
    { name: "cmv",              value: 1254000.00, period: "2026-02" }, // 76.0%
    { name: "cmv_pct",          value: 76.0,       period: "2026-02" },
    { name: "folhaAdm",         value: 170000.00,  period: "2026-02" },
    { name: "financeiro",       value: 35000.00,   period: "2026-02" },
    { name: "outras",           value: 30000.00,   period: "2026-02" },
    { name: "restaurante",      value: 6000.00,    period: "2026-02" },
    { name: "consultoria",      value: 4000.00,    period: "2026-02" },
    { name: "contabilidade",    value: 2500.00,    period: "2026-02" },
    { name: "adm_total",        value: 247500.00,  period: "2026-02" }, // 15.0%
    { name: "adm_pct",          value: 15.0,       period: "2026-02" },
    // EBITDA = 1.422.300 - 1.254.000 - 247.500 = -79.200
    { name: "ebitda",           value: -79200.00,  period: "2026-02" },
    { name: "ebitda_pct",       value: -4.8,       period: "2026-02" },
    { name: "result_financeiro", value: -38000.00, period: "2026-02" },
    { name: "resultado_liquido", value: -117200.00, period: "2026-02" },
    { name: "caixa_final",      value: 255000.00,  period: "2026-02" },

    // ── Março 2026 — Real (fonte: Indicadores / DRE novo) ────────────────────
    { name: "faturamento",      value: 1850000.00, period: "2026-03" },
    { name: "impostos",         value: 199800.00,  period: "2026-03" }, // 10.8%
    { name: "comissao",         value: 55500.00,   period: "2026-03" }, // 3.0%
    { name: "receita_liquida",  value: 1594700.00, period: "2026-03" },
    { name: "cmv",              value: 1526250.00, period: "2026-03" }, // 82.5% (real)
    { name: "cmv_pct",          value: 82.5,       period: "2026-03" },
    { name: "folhaAdm",         value: 200000.00,  period: "2026-03" },
    { name: "financeiro",       value: 45000.00,   period: "2026-03" },
    { name: "outras",           value: 30000.00,   period: "2026-03" },
    { name: "restaurante",      value: 5500.00,    period: "2026-03" },
    { name: "consultoria",      value: 4000.00,    period: "2026-03" },
    { name: "contabilidade",    value: 2250.00,    period: "2026-03" },
    { name: "adm_total",        value: 286750.00,  period: "2026-03" }, // 15.5%
    { name: "adm_pct",          value: 15.5,       period: "2026-03" },
    // EBITDA = 1.594.700 - 1.526.250 - 286.750 = -218.300 (-11.8% real)
    { name: "ebitda",           value: -218300.00, period: "2026-03" },
    { name: "ebitda_pct",       value: -11.8,      period: "2026-03" },
    { name: "result_financeiro", value: -65000.00, period: "2026-03" },
    { name: "resultado_liquido", value: -283300.00, period: "2026-03" },
    { name: "caixa_final",      value: 185000.00,  period: "2026-03" },
  ],
  rh: [
    // ── Janeiro 2026 ──────────────────────────────────────────────────────────
    { name: "headcount",                      value: 50,        period: "2026-01" },
    { name: "horas_trabalhadas",              value: 10770,     period: "2026-01" },
    { name: "contratacoes",                   value: 6,         period: "2026-01" },
    { name: "demissoes",                      value: 4,         period: "2026-01" },
    { name: "turnover",                       value: 10.42,     period: "2026-01" },
    { name: "absenteeism_rate",               value: 7.30,      period: "2026-01" },
    { name: "absenteismo_justificados_pct",   value: 4.38,      period: "2026-01" },
    { name: "absenteismo_nao_justif_pct",     value: 2.19,      period: "2026-01" },
    { name: "absenteismo_atrasos_pct",        value: 0.73,      period: "2026-01" },
    { name: "he_horas",                       value: 217,       period: "2026-01" },
    { name: "he_pct",                         value: 2.0,       period: "2026-01" },
    { name: "he_valor",                       value: 15190,     period: "2026-01" },
    { name: "faturamento_rh",                 value: 671759,    period: "2026-01" },
    { name: "costureiras",                    value: 30,        period: "2026-01" },
    { name: "produtividade_geral",            value: 13435,     period: "2026-01" },
    { name: "produtividade_costureiras",      value: 22392,     period: "2026-01" },
    { name: "treinados",                      value: 55,        period: "2026-01" },
    { name: "horas_treinamento",              value: 134,       period: "2026-01" },
    { name: "treinamento_pct",                value: 1.24,      period: "2026-01" },
    { name: "dispensados",                    value: 3,         period: "2026-01" },
    { name: "solicitaram_desl",               value: 1,         period: "2026-01" },
    { name: "acordo",                         value: 0,         period: "2026-01" },
    { name: "funil_contatados",               value: 66,        period: "2026-01" },
    { name: "funil_sem_resposta",             value: 12,        period: "2026-01" },
    { name: "funil_agendados",                value: 41,        period: "2026-01" },
    { name: "funil_nao_compareceu",           value: 8,         period: "2026-01" },
    { name: "funil_desistiram",               value: 5,         period: "2026-01" },
    { name: "funil_reprovados",               value: 9,         period: "2026-01" },
    { name: "funil_ap_restricao",             value: 3,         period: "2026-01" },
    { name: "funil_aprovados",               value: 17,        period: "2026-01" },
    { name: "funil_nao_efetivados",           value: 3,         period: "2026-01" },
    { name: "funil_efetivados",               value: 14,        period: "2026-01" },
    { name: "efetivados_pct",                 value: 21.2,      period: "2026-01" },

    // ── Fevereiro 2026 ────────────────────────────────────────────────────────
    { name: "headcount",                      value: 52,        period: "2026-02" },
    { name: "horas_trabalhadas",              value: 9736,      period: "2026-02" },
    { name: "contratacoes",                   value: 7,         period: "2026-02" },
    { name: "demissoes",                      value: 5,         period: "2026-02" },
    { name: "turnover",                       value: 12.0,      period: "2026-02" },
    { name: "absenteeism_rate",               value: 6.11,      period: "2026-02" },
    { name: "absenteismo_justificados_pct",   value: 3.67,      period: "2026-02" },
    { name: "absenteismo_nao_justif_pct",     value: 1.83,      period: "2026-02" },
    { name: "absenteismo_atrasos_pct",        value: 0.61,      period: "2026-02" },
    { name: "he_horas",                       value: 383,       period: "2026-02" },
    { name: "he_pct",                         value: 3.9,       period: "2026-02" },
    { name: "he_valor",                       value: 26810,     period: "2026-02" },
    { name: "faturamento_rh",                 value: 1042912,   period: "2026-02" },
    { name: "costureiras",                    value: 32,        period: "2026-02" },
    { name: "produtividade_geral",            value: 20056,     period: "2026-02" },
    { name: "produtividade_costureiras",      value: 32591,     period: "2026-02" },
    { name: "treinados",                      value: 55,        period: "2026-02" },
    { name: "horas_treinamento",              value: 146,       period: "2026-02" },
    { name: "treinamento_pct",                value: 1.50,      period: "2026-02" },
    { name: "dispensados",                    value: 4,         period: "2026-02" },
    { name: "solicitaram_desl",               value: 1,         period: "2026-02" },
    { name: "acordo",                         value: 0,         period: "2026-02" },
    { name: "funil_contatados",               value: 48,        period: "2026-02" },
    { name: "funil_sem_resposta",             value: 7,         period: "2026-02" },
    { name: "funil_agendados",                value: 33,        period: "2026-02" },
    { name: "funil_nao_compareceu",           value: 5,         period: "2026-02" },
    { name: "funil_desistiram",               value: 4,         period: "2026-02" },
    { name: "funil_reprovados",               value: 17,        period: "2026-02" },
    { name: "funil_ap_restricao",             value: 2,         period: "2026-02" },
    { name: "funil_aprovados",               value: 7,         period: "2026-02" },
    { name: "funil_nao_efetivados",           value: 2,         period: "2026-02" },
    { name: "funil_efetivados",               value: 5,         period: "2026-02" },
    { name: "efetivados_pct",                 value: 10.4,      period: "2026-02" },

    // ── Março 2026 ────────────────────────────────────────────────────────────
    { name: "headcount",                      value: 50,        period: "2026-03" },
    { name: "horas_trabalhadas",              value: 9172,      period: "2026-03" },
    { name: "contratacoes",                   value: 9,         period: "2026-03" },
    { name: "demissoes",                      value: 11,        period: "2026-03" },
    { name: "turnover",                       value: 19.23,     period: "2026-03" },
    { name: "absenteeism_rate",               value: 8.35,      period: "2026-03" },
    { name: "absenteismo_justificados_pct",   value: 5.01,      period: "2026-03" },
    { name: "absenteismo_nao_justif_pct",     value: 2.51,      period: "2026-03" },
    { name: "absenteismo_atrasos_pct",        value: 0.83,      period: "2026-03" },
    { name: "he_horas",                       value: 295,       period: "2026-03" },
    { name: "he_pct",                         value: 3.2,       period: "2026-03" },
    { name: "he_valor",                       value: 20650,     period: "2026-03" },
    { name: "faturamento_rh",                 value: 0,         period: "2026-03" },
    { name: "costureiras",                    value: 30,        period: "2026-03" },
    { name: "produtividade_geral",            value: 0,         period: "2026-03" },
    { name: "produtividade_costureiras",      value: 0,         period: "2026-03" },
    { name: "treinados",                      value: 170,       period: "2026-03" },
    { name: "horas_treinamento",              value: 155,       period: "2026-03" },
    { name: "treinamento_pct",                value: 1.69,      period: "2026-03" },
    { name: "dispensados",                    value: 8,         period: "2026-03" },
    { name: "solicitaram_desl",               value: 2,         period: "2026-03" },
    { name: "acordo",                         value: 1,         period: "2026-03" },
    { name: "funil_contatados",               value: 0,         period: "2026-03" },
    { name: "funil_sem_resposta",             value: 0,         period: "2026-03" },
    { name: "funil_agendados",                value: 0,         period: "2026-03" },
    { name: "funil_nao_compareceu",           value: 0,         period: "2026-03" },
    { name: "funil_desistiram",               value: 0,         period: "2026-03" },
    { name: "funil_reprovados",               value: 0,         period: "2026-03" },
    { name: "funil_ap_restricao",             value: 0,         period: "2026-03" },
    { name: "funil_aprovados",               value: 0,         period: "2026-03" },
    { name: "funil_nao_efetivados",           value: 0,         period: "2026-03" },
    { name: "funil_efetivados",               value: 9,         period: "2026-03" },
    { name: "efetivados_pct",                 value: 0,         period: "2026-03" },
  ],
  commercial: [
    { name: "revenue", value: 671759, period: "2026-01" },
    { name: "leads", value: 66, period: "2026-01" },
    
    { name: "revenue", value: 1042912, period: "2026-02" },
    { name: "leads", value: 87, period: "2026-02" },
  ],
  operations: [
    { name: "total_production", value: 21230, period: "2026-01" },
    { name: "average_efficiency", value: 82.5, period: "2026-01" },
    
    { name: "total_production", value: 24160, period: "2026-02" },
    { name: "average_efficiency", value: 84.2, period: "2026-02" },
  ]
};

export const DEMO_REPORT_SUMMARY = {
  finance: {
    title: "Parecer Executivo Financeiro (DEMO)",
    businessStatus: "Crescimento controlado com eficiência operacional estável",
    priorityAction: {
      action: "Manter controle de custos e direcionar investimento para expansão comercial",
      impact: "Melhoria contínua da margem operacional e expansão de EBITDA",
      urgency: "Média"
    },
    riskLevel: "Baixo",
    summary: "Performance sólida no primeiro trimestre. Gestão de caixa eficiente com rentabilidade acima da meta."
  },
  // ... can be expanded
};

export const DEMO_INSIGHTS = {
  finance: [
    { type: "trending_up", text: "Margem EBITDA +2.4 p.p. — Eficiência operacional validada." },
    { type: "info", text: "Ciclo de Caixa -5 dias — Liquidez otimizada." },
    { type: "trending_up", text: "Fluxo Livre +12% — Capacidade de reinvestimento confirmada." }
  ],
  rh: [
    { type: "trending_up", text: "Engajamento +12% — Plano de carreira efetivo." },
    { type: "info", text: "Turnover Chave -15% — Estabilidade em posições críticas." }
  ]
};
