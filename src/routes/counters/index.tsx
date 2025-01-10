import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../../components/pageTemplate/component";
import ShortcutButton from "../../components/pageTemplate/components/shortcuts/shortcutButton";
import { AddCircle, ArrowLeft, Delete, Edit, Info } from "@mui/icons-material";
import { store } from "../../store";
import { SortableList } from "../../components/sortableList/component";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Counter } from "../../definitions";
import ConfirmationDialog from "../../components/confirmDialog/component";
import DynamicIcon from "../../components/dynamicIcon/component";

export const Route = createFileRoute("/counters/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const storeCounters = store.useCounters(null);
  const groups = store.useCounterGroups();
  const [localCounters, setLocalCounters] =
    useState<(Counter & { groupName?: string })[]>(storeCounters);

  // Sync with store when it updates
  // Used useEffect approach to handle lag.
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
      menuOptions={[
        <ShortcutButton
          key="addCounter"
          id={"addCounter"}
          color="info"
          icon={<AddCircle />}
          onClick={() => navigate({ to: "/counters/new" })}
        >
          Add new
        </ShortcutButton>,
      ]}
      rightOptions={localCounters.map((c) => (
        <ShortcutButton
          key={c.id}
          id={c.id}
          icon={<DynamicIcon icon={c.icon} />}
          onClick={() => {
            document.getElementById(c.id)?.scrollIntoView({ block: "center" });
          }}
        >
          {c.label}
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
              <Box sx={{ display: "flex", gap: 1 }}>
                <DynamicIcon icon={counter.icon} color="primary" />
                <Typography
                  variant="subtitle1"
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
              <Typography variant="caption" px={2}>
                {counter.groupName}
              </Typography>
              <Stack direction="row" justifyContent='center' spacing={1}>
                <Tooltip title="Edit">
                  <IconButton
                    color="info"
                    onClick={() => {
                      navigate({
                        to: `/counters/$id/edit`,
                        params: { id: counter.id },
                      });
                    }}
                  >
                    <Edit fontSize="inherit" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="More info">
                  <IconButton
                    color="info"
                    onClick={() => {
                      navigate({
                        to: `/counters/$id`,
                        params: { id: counter.id },
                      });
                    }}
                  >
                    <Info fontSize="inherit" />
                  </IconButton>
                </Tooltip>
                <Divider orientation="vertical" flexItem />
                <ConfirmationDialog
                  title="Delete Counter"
                  description="Are you sure you want to delete this group?"
                  response={() => {
                    store.deleteCounter(counter.id);
                  }}
                  confirmButtonProps={{ color: "error" }}
                >
                  {(showDialog) => (
                    <Tooltip title="Delete">
                      <IconButton
                        color="warning"
                        aria-label="delete"
                        onClick={showDialog}
                      >
                        <Delete fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  )}
                </ConfirmationDialog>
              </Stack>
            </Box>
          </SortableList.Item>
        )}
      />
    </PageTemplate>
  );
}
