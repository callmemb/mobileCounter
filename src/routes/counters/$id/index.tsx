import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../../../components/pageTemplate/component";
import ShortcutButton from "../../../components/pageTemplate/components/shortcuts/shortcutButton";
import { ArrowLeft, Delete, Edit } from "@mui/icons-material";
import {
  store,
  useCounter,
  useCounterActions,
  useCounterGroup,
} from "../../../store";
import {
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import DynamicIcon from "../../../components/dynamicIcon/component";
import ConfirmationDialog from "../../../components/confirmDialog/component";

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
      menuOptions={[
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
        <Box sx={{ display: "flex", gap: 1 }}>
          <DynamicIcon icon={counter?.icon || ""} color="primary" />
          <Typography variant="h5">{counter?.label}</Typography>
        </Box>
        <Typography variant="caption" style={{ marginTop: 0 }} sx={{ px: 2 }}>
          {group?.label}
        </Typography>
        <Box>
          <Typography variant="h6">Actions</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ py: 0 }}>date</TableCell>
                <TableCell sx={{ py: 0 }} align="right">
                  value
                </TableCell>
                <TableCell sx={{ py: 0 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {actions.map((action) => (
                <TableRow
                  key={action.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {dayjs(action.date).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell align="right">{action.value}</TableCell>
                  <TableCell align="right">
                    <ConfirmationDialog
                      title="Delete Counter Action"
                      description="Are you sure you want to delete this action?"
                      response={() => {
                        store.deleteCounterAction(action.id);
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Stack>
    </PageTemplate>
  );
}
