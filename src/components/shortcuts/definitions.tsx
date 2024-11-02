import { ReactNode } from "react";

export type item = {
  id: string | number;
  onClick: () => void;
  isSelected?: boolean;
  icon: ReactNode;
  label: ReactNode;
};
