import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../../components/pageTemplate/component";
import ShortcutButton from "../../components/pageTemplate/components/shortcuts/shortcutButton";
import {
  AddCircle,
  ArrowLeft,
  AutoGraph,
  Delete,
  Edit,
} from "@mui/icons-material";
import { store, useCounterGroups, useCounters } from "../../store";
import { SortableList } from "../../components/sortableList/component";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Counter } from "../../definitions";

export const Route = createFileRoute("/counters/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const storeCounters = useCounters(null);
  const groups = useCounterGroups();
  const [localCounters, setLocalCounters] =
    useState<(Counter & { groupName?: string })[]>(storeCounters);

  // Sync with store when it updates
  useEffect(() => {
    setLocalCounters(
      storeCounters.map((c) => ({
        ...c,
        groupName: groups.find((g) => g.id === c.groupId)?.label,
      }))
    );
  }, [storeCounters, groups]);

  return (
    <PageTemplate
      label="Counters"
      staticOptions={[
        <ShortcutButton
          key="addCounter"
          id={"addCounter"}
          icon={<AddCircle />}
          onClick={() => navigate({ to: "/counters/new" })}
        >
          Add new
        </ShortcutButton>,
      ]}
      rightOptions={localCounters.map((g) => (
        <ShortcutButton
          key={g.id}
          id={g.id}
          icon={g.label[0]}
          onClick={() => {
            document.getElementById(g.id)?.scrollIntoView();
          }}
        >
          {g.label}
        </ShortcutButton>
      ))}
      leftOptions={[
        <ShortcutButton
          key="back"
          id="back"
          icon={<ArrowLeft />}
          color="warning"
          onClick={() => {
            navigate({ to: ".." });
          }}
        >
          Back
        </ShortcutButton>,
      ]}
    >
      <SortableList
        items={localCounters}
        onChange={(active, before, after, newList) => {
          store.moveCounter(active.id, before?.id, after?.id);
          setLocalCounters(newList);
        }}
        renderItem={(counter) => (
          <SortableList.Item key={counter.id} id={counter.id}>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ display: "flex" }}>
                <Typography
                  variant="button"
                  sx={{
                    display: "block",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {counter.label}
                </Typography>
                <SortableList.DragHandle />
              </Box>
              <Typography variant="caption">{counter.groupName}</Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  color="warning"
                  aria-label="delete"
                  onClick={() => {
                    store.deleteCounter(counter.id);
                  }}
                >
                  <Delete fontSize="inherit" />
                </IconButton>
                <IconButton
                  size="small"
                  color="info"
                  onClick={() => {
                    navigate({ to: `/counters/${counter.id}` });
                  }}
                >
                  <Edit fontSize="inherit" />
                </IconButton>
                <IconButton size="small" color="info">
                  <AutoGraph fontSize="inherit" />
                </IconButton>
              </Stack>
            </Box>
          </SortableList.Item>
        )}
      />
    </PageTemplate>
  );
}
