import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { store } from "@/store";
import PageTemplate from "@/components/pageTemplate/component";
import ShortcutButton from "@/components/pageTemplate/components/shortcuts/shortcutButton";
import { ArrowLeft, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  Tooltip,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import DynamicIcon from "@/components/dynamicIcon/component";
import ConfirmationDialog from "@/components/confirmDialog/component";
import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2"; // added import
import type { ChartOptions } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip);

export const Route = createFileRoute("/counters/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const counter = store.useCounter(id);
  const group = store.useCounterGroup(counter?.groupId || null);
  const [tab, setTab] = useState(0);

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
            navigate({ to: "/" });
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

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value={0} label="Actions" />
          <Tab value={1} label="By day" />
          <Tab value={2} label="By month" />
        </Tabs>
        <Actions isTab={0} activeTab={tab} counterId={id} />
        <ByDay isTab={1} activeTab={tab} counterId={id} />
        <ByMonth isTab={2} activeTab={tab} counterId={id} />
      </Stack>
    </PageTemplate>
  );
}

type TabProps = { isTab: number; activeTab: number; counterId: string };

function Actions({ isTab, activeTab, counterId }: TabProps) {
  const actions = store.useCounterActions(counterId);
  return (
    <Box hidden={activeTab !== isTab}>
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
                {dayjs(action.date).format("DD-MM-YYYY HH:mm")}
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
  );
}

const chartStaticOptions: ChartOptions<"bar"> = {
  responsive: true,
  indexAxis: "y" as const,
  maintainAspectRatio: false,
  animation: false,
  scales: {
    x: {
      beginAtZero: true,
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
  layout: {
    padding: {
      right: 10,
    },
  },
};

function ByDay({ isTab, activeTab, counterId }: TabProps) {
  const data = store.useCounterActionsByDay(counterId);
  const theme = useTheme();

  const chartData = useMemo(
    () => ({
      labels: data.map((item) => dayjs(item.day, "YYYY-MM-DD").format("DD-MM")),
      datasets: [
        {
          data: data.map((item) => item.value),
          backgroundColor: theme.palette.primary.main,
        },
      ],
    }),
    [data, theme]
  );

  const chartHeight = Math.max(10, data.length * 3);

  return (
    <Box hidden={activeTab !== isTab} sx={{ height: `${chartHeight}rem` }}>
      <Bar data={chartData} options={chartStaticOptions} />
    </Box>
  );
}

function ByMonth({ isTab, activeTab, counterId }: TabProps) {
  const data = store.useCounterActionsByMonth(counterId);
  const theme = useTheme();

  const chartData = useMemo(
    () => ({
      labels: data.map((item) => dayjs(item.month, "YYYY-MM").format("MM")),
      datasets: [
        {
          data: data.map((item) => item.value),
          backgroundColor: theme.palette.primary.main,
        },
      ],
    }),
    [data, theme]
  );

  const chartHeight = Math.max(10, data.length * 3);

  return (
    <Box hidden={activeTab !== isTab} sx={{ height: `${chartHeight}rem` }}>
      <Bar data={chartData} options={chartStaticOptions} />
    </Box>
  );
}
