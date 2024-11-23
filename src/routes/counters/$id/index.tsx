import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../../../components/pageTemplate/component";
import ShortcutButton from "../../../components/pageTemplate/components/shortcuts/shortcutButton";
import { ArrowLeft, Edit } from "@mui/icons-material";
import { useCounter, useCounterActions, useCounterGroup } from "../../../store";
import { Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

export const Route = createFileRoute("/counters/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const counter = useCounter(id);
  const group = useCounterGroup(counter?.groupId || null);
  const actions = useCounterActions(id);

  return (
    <PageTemplate
      label="Counter Info"
      leftOptions={[
        <ShortcutButton
          key="back"
          id="back"
          icon={<ArrowLeft />}
          color="warning"
          onClick={() => {
            navigate({ to: "/counters" });
          }}
        >
          Back
        </ShortcutButton>,
      ]}
      staticOptions={[
        [
          <ShortcutButton
            key="edit"
            id="edit"
            color="info"
            icon={<Edit />}
            onClick={() =>
              navigate({ to: "/counters/$id/edit", params: { id } })
            }
          >
            Edit
          </ShortcutButton>,
        ],
      ]}
    >
      <Stack spacing={2}>
        <Typography variant="h5">{counter?.label}</Typography>
        <Typography variant="caption" style={{ marginTop: 0 }} sx={{ px: 2 }}>
          {group?.label}
        </Typography>
        <Box>
          <Typography variant="h6">Actions</Typography>
          <Stack>
            {actions.map((action) => (
              <Box key={action.id}>
                <Typography variant="body1">
                  {dayjs(action.date).format("DD-MM-YYYY")} / {action.value}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </PageTemplate>
  );
}
