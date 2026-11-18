import type { NavLink } from "./navigation";

export type KeyFigure = {
  label: string;
  value: string | null;
  period?: string;
  source?: string;
};

export type Pillar = {
  title: string;
  body: string;
  pending?: boolean;
  link?: NavLink;
};

export type ExplorePanel = {
  title: string;
  body: string;
  link: NavLink;
};
