import { createContext, useContext, ReactNode, useState } from "react";

interface SelectedCounterGroupIdContextType {
  groupId: string | null;
  setGroupId: (id: string | null) => void;
}

const SelectedCounterGroupIdContext = createContext<
  SelectedCounterGroupIdContextType | undefined
>(undefined);

interface SelectedCounterGroupIdProviderProps {
  children: ReactNode;
  initialGroupId?: string;
}

export const SelectedCounterGroupIdProvider = ({
  children,
  initialGroupId = "",
}: SelectedCounterGroupIdProviderProps) => {
  const [groupId, setGroupId] = useState<string | null>(initialGroupId);

  return (
    <SelectedCounterGroupIdContext.Provider value={{ groupId, setGroupId }}>
      {children}
    </SelectedCounterGroupIdContext.Provider>
  );
};

export const useSelectedCounterGroupId = () => {
  const context = useContext(SelectedCounterGroupIdContext);
  if (!context) {
    throw new Error(
      "useSelectedCounterGroupId must be used within a SelectedCounterGroupIdProvider"
    );
  }
  return context;
};
