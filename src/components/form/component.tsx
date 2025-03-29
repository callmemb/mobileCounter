import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./context";
import TextInput from "./components/textInput";
import IconPicker from "./components/iconPicker";
import NumberInput from "./components/numberInput";
import SelectInput from "./components/selectInput";
import ImagePicker from "./components/imagePicker";
import FormPageTemplate from "./components/formPageTemplate";

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInput,
    IconPicker,
    NumberInput,
    SelectInput,
    ImagePicker,
  },
  formComponents: {
    FormPageTemplate,
  },
});
