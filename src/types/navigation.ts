export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = NavLink & {
  children?: NavLink[];
};

export type FooterGroup = {
  title: string;
  links: NavLink[];
};
