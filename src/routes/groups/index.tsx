import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../../components/pageTemplate/component";
import ShortcutButton from "../../components/pageTemplate/components/shortcuts/shortcutButton";
import { AddCircle, ArrowLeft, Delete, Edit } from "@mui/icons-material";
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
import ConfirmationDialog from "../../components/confirmDialog/component";
import DynamicIcon from "../../components/dynamicIcon/component";

export const Route = createFileRoute("/groups/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const storeGroups =store.useCounterGroups();
  const [localGroups, setLocalGroups] = useState(storeGroups);

  // Sync with store when it updates
  useEffect(() => {
    setLocalGroups(storeGroups);
  }, [storeGroups]);

  return (
    <PageTemplate
      label="Groups"
      menuOptions={[
        <ShortcutButton
          key="addCounterGroup"
          id={"addCounterGroup"}
          color="info"
          icon={<AddCircle />}
          onClick={() => navigate({ to: "/groups/new" })}
        >
          Add new
        </ShortcutButton>,
      ]}
      rightOptions={localGroups.map((g) => (
        <ShortcutButton
          key={g.id}
          id={g.id}
          icon={<DynamicIcon icon={g.icon} />}
          onClick={() => {
            document.getElementById(g.id)?.scrollIntoView({ block: "center" });
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
        items={localGroups}
        onChange={(active, before, after, newList) => {
          setLocalGroups(newList);
          store.moveCounterGroup(active.id, before?.id, after?.id);
        }}
        renderItem={(group) => (
          <SortableList.Item key={group.id} id={group.id}>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <DynamicIcon icon={group.icon} color="primary" />
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: "block",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {group.label}
                </Typography>
                <SortableList.DragHandle />
              </Box>
              <Stack direction="row" justifyContent="center" spacing={1}>
                <Tooltip title="Edit">
                  <IconButton
                    color="info"
                    onClick={() => {
                      navigate({ to: `/groups/${group.id}` });
                    }}
                  >
                    <Edit fontSize="inherit" />
                  </IconButton>
                </Tooltip>
                <Divider orientation="vertical" flexItem />
                <ConfirmationDialog
                  title="Delete Group"
                  description="Are you sure you want to delete this group?"
                  response={() => {
                    store.deleteCounterGroup(group.id);
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
