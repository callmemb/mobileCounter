import { ComponentInModalPropsType } from "../../hooks/useModal";
import Form from "./form";
import { Counter } from "../../definitions";
import { store } from "../../store";

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
const config = [
  { label: "Label", name: "label", defaultValue: "" },
  {
    label: "Default number of units",
    name: "defaultNumberOfUnits",
    type: "number" as const,
    defaultValue: 1,
  },
  {
    label: "Units name",
    name: "unitsName",
    defaultValue: "u",
  },
  {
    label: "Units in step",
    name: "unitsInStep",
    type: "number" as const,
    defaultValue: 1,
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
export default function AddCounterForm({ hide }: ComponentInModalPropsType) {
  /**
   * Handles form submission by creating a new counter record.
   * @param {FormData} data - Form data containing counter properties
   */
  const onSubmit = async (data: FormData) => {
    // Convert form data to counter record
    const record = config.reduce(
      (state, item) => {
        return { ...state, [item.name]: data.get(item.name) };
      },
      { currentSteps: 0 } // Initialize with zero steps
    );
    
    console.log(record);
    await store.upsertCounter(record as Counter).catch(e=>alert(e));
    hide();
  };

  return <Form config={config} onSubmit={onSubmit} />;
}
