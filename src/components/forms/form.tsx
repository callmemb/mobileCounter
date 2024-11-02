import './form.css';
import { SyntheticEvent } from "react";

/**
 * Form configuration props
 * @property {FieldItemType[]} config - Array of field configurations
 * @property {function} onSubmit - Callback function to handle form submission
 */
export type Props = {
  config: FieldItemType[];
  onSubmit: (data: FormData) => Promise<void>;
};

/**
 * Generic form component that renders form fields based on provided configuration
 * @param {Props} props - Component properties
 * @returns {JSX.Element} Rendered form with configured fields
 */
export default function Form({ config, onSubmit }: Props) {
  return (
    <form
      className="form"
      onSubmit={async (e: SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        await onSubmit(formData);
        target.reset();
      }}
    >
      {config.map((field) => (
        <FieldItem key={field.name} {...field} />
      ))}

      <button type="submit">Submit</button>
    </form>
  );
}

/**
 * Base field item type with common properties
 */
type _FieldItemType = {
  label: string;
  name: string;
};

/**
 * Number field configuration type
 */
type NumberFieldItemType = _FieldItemType & {
  type: "number";
  defaultValue: number;
};

/**
 * Text field configuration type
 */
type TextFieldItemType = _FieldItemType & {
  type?: "text";
  defaultValue: string;
};

/** Union type for all supported field types */
type FieldItemType = TextFieldItemType | NumberFieldItemType;

/**
 * Renders a single form field based on the provided configuration
 * @param {FieldItemType} props - Field configuration
 * @returns {JSX.Element} Rendered form field
 */
function FieldItem({ label, name, type, defaultValue }: FieldItemType) {
  return (
    <div>
      <label htmlFor={name}>{label}:</label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} />
    </div>
  );
}
