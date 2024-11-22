import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../../components/pageTemplate/component";
import ShortcutButton from "../../components/pageTemplate/components/shortcuts/shortcutButton";
import { AddCircle, ArrowLeft, Delete, Edit } from "@mui/icons-material";
import { store, useCounterGroups } from "../../store";
import { SortableList } from "../../components/sortableList/component";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/groups/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const storeGroups = useCounterGroups();
  const [localGroups, setLocalGroups] = useState(storeGroups);

  // Sync with store when it updates
  useEffect(() => {
    setLocalGroups(storeGroups);
  }, [storeGroups]);

  return (
    <PageTemplate
      label="Groups"
      staticOptions={[
        <ShortcutButton
          key="addCounterGroup"
          id={"addCounterGroup"}
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
        items={localGroups}
        onChange={(active, before, after, newList) => {
          setLocalGroups(newList);
          store.moveCounterGroup(active.id, before?.id, after?.id);
        }}
        renderItem={(group) => (
          <SortableList.Item key={group.id} id={group.id}>
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
                  {group.label}
                </Typography>
                <SortableList.DragHandle />
              </Box>
              <Stack direction="row" spacing={1}>
                <IconButton
                  color="warning"
                  aria-label="delete"
                  onClick={() => {
                    store.deleteCounter(group.id);
                  }}
                >
                  <Delete fontSize="inherit" />
                </IconButton>
                <IconButton
                  size="small"
                  color="info"
                  onClick={() => {
                    navigate({ to: `/groups/${group.id}` });
                  }}
                >
                  <Edit fontSize="inherit" />
                </IconButton>
              </Stack>
            </Box>
          </SortableList.Item>
        )}
      />
    </PageTemplate>
  );
}
