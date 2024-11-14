import { ComponentInModalPropsType } from "../../hooks/useModal";
import Form from "./form";
import { Counter, CounterGroup } from "../../definitions";
import { store, useCounterGroups } from "../../store";
import { useSelectedCounterGroupId } from "../../hooks/useSelectedCounterGroupId";
import { useMemo } from "react";

/**
 * Configuration for the counter form fields.
 * Each object defines properties for a form input field.
 * @type {Array<{
 *   label: string,
 *   name: string,
 *   type?: "number",
 *   defaultValue: string | number
 * }>}
 */
const configFn = (
  groupOptions: CounterGroup[],
  defaultGroupId: CounterGroup["id"]
) => [
  { label: "Label", name: "label", defaultValue: "" },
  {
    label: "Group",
    name: "groupId",
    type: "select" as const,
    options: groupOptions.map((g) => ({ value: g.id, label: g.label })),
    defaultValue: defaultGroupId,
  },
  {
    label: "Default number of steps",
    name: "defaultNumberOfSteps",
    type: "number" as const,
    defaultValue: 1,
  },
  {
    label: "Maximum number of steps",
    name: "maxNumberOfSteps",
    type: "number" as const,
    defaultValue: 1,
  },
  {
    label: "Units in step",
    name: "unitsInStep",
    type: "number" as const,
    defaultValue: 1,
  },
  {
    label: "Units name",
    name: "unitsName",
    defaultValue: "u",
  },
  {
    label: "Daily goal of steps",
    name: "dailyGoalOfSteps",
    type: "number" as const,
    defaultValue: 1,
  },
];

/**
 * A form component for adding new counters.
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.hide - Function to hide the modal containing this form
 * @returns {JSX.Element} A form for creating new counters
 */
export default function CounterForm({
  hide,
  initialData,
}: ComponentInModalPropsType & {
  initialData?: Record<string, string | number>;
}) {
  const onSubmit = async (data: FormData) => {
    const record = config.reduce(
      (state, item) => {
        return { ...state, [item.name]: data.get(item.name) };
      },
      {
        ...initialData,
        currentSteps: initialData?.currentSteps || 0,
        id: initialData?.id || undefined,
      }
    );
    await store.upsertCounter(record as Counter).catch((e) => alert(e));
    hide();
  };

  const groupOptions = useCounterGroups();
  const { groupId } = useSelectedCounterGroupId();
  const config = useMemo(
    () => configFn(groupOptions, groupId || undefined),
    [groupId, groupOptions]
  );

  return <Form config={config} initialData={initialData} onSubmit={onSubmit} />;
}
