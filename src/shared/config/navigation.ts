export type NavigationItem = {
  label: string;
  path: string;
  icon: string;
};

export const primaryNavigation: NavigationItem[] = [
  { label: "Painel executivo", path: "/dashboard", icon: "dashboard" },
  { label: "Orçamento", path: "/budget", icon: "account_balance" },
  { label: "Financeiro", path: "/financial", icon: "payments" },
  { label: "Comercial", path: "/commercial", icon: "sell" },
  { label: "Importação de dados", path: "/data-import", icon: "upload_file" },
  { label: "Pessoas", path: "/hr", icon: "groups" },
  { label: "Estoque", path: "/inventory", icon: "inventory_2" },
  { label: "Operações", path: "/operations", icon: "precision_manufacturing" },
  { label: "Compras", path: "/purchasing", icon: "shopping_cart" },
];
