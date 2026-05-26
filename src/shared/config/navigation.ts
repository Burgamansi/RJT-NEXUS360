export type NavigationItem = {
  label: string;
  path: string;
  icon: string;
};

export const primaryNavigation: NavigationItem[] = [
  { label: "Executive Dashboard", path: "/dashboard", icon: "dashboard" },
  { label: "Financial Intelligence", path: "/financial", icon: "payments" },
  { label: "HR Analytics", path: "/hr", icon: "groups" },
  { label: "Operations Analytics", path: "/operations", icon: "precision_manufacturing" },
  { label: "Purchasing Intelligence", path: "/purchasing", icon: "shopping_cart" },
];
