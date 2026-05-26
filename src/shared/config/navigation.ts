export type NavigationItem = {
  label: string;
  path: string;
  icon: string;
};

export const primaryNavigation: NavigationItem[] = [
  { label: "Executive Dashboard", path: "/dashboard", icon: "dashboard" },
  { label: "Budget Intelligence", path: "/budget", icon: "account_balance" },
  { label: "Financial Intelligence", path: "/financial", icon: "payments" },
  { label: "Commercial Intelligence", path: "/commercial", icon: "sell" },
  { label: "Data Import Center", path: "/data-import", icon: "upload_file" },
  { label: "HR Analytics", path: "/hr", icon: "groups" },
  { label: "Inventory Intelligence", path: "/inventory", icon: "inventory_2" },
  { label: "Operations Analytics", path: "/operations", icon: "precision_manufacturing" },
  { label: "Purchasing Intelligence", path: "/purchasing", icon: "shopping_cart" },
];
