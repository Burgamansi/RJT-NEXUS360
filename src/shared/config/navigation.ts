export type NavigationItem = {
  label: string;
  path: string;
  icon: string;
};

export const primaryNavigation: NavigationItem[] = [
  { label: "Executive Hub", path: "/executive", icon: "dashboard" },
  { label: "Financial Intelligence", path: "/financial", icon: "payments" },
  { label: "Management", path: "/executive", icon: "account_tree" },
  { label: "Data Center", path: "/executive", icon: "database" },
  { label: "Audit Center", path: "/executive", icon: "fact_check" },
  { label: "Risk Analytics", path: "/executive", icon: "security" },
  { label: "Nexus Settings", path: "/executive", icon: "settings" },
];
