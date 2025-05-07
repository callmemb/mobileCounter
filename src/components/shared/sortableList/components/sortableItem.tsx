import { createContext, useContext, useMemo } from "react";
import type { PropsWithChildren } from "react";
import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button } from "@mui/material";
import { DragIndicator } from "@mui/icons-material";

interface Props {
  id: UniqueIdentifier;
}

interface Context {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export default function SortableItem({
  children,
  id,
}: PropsWithChildren<Props>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  );

  return (
    <SortableItemContext.Provider value={context}>
      <Box
        ref={setNodeRef}
        id={`${id}`}
        sx={{
          opacity: isDragging ? 0.4 : undefined,
          transform: CSS.Translate.toString(transform),
          transition,
          display: "flex",
          justifyContent: "space-between",
          flexGrow: 1,
          alignItems: "center",
          padding: "18px 20px",
          backgroundColor: "#fff",
          boxShadow: `0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05),
            0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)`,
          borderRadius: "8px",
        }}
      >
        {children}
      </Box>
    </SortableItemContext.Provider>
  );
}

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <Button
      variant="outlined"
      {...attributes}
      {...listeners}
      sx={
        {
          alignItems: "center",
          justifyContent: "center",
          touchAction: "none",
          appearance: "none",
          minWidth: "32px",
        }
      }
      ref={ref}
    >
      <DragIndicator fontSize='inherit' />
    </Button>
  );
}
