import { ReactNode } from "react";

export type item = {
  id: string;
  onClick: () => void;
  isSelected?: boolean;
  icon: ReactNode;
  label: ReactNode;
};
