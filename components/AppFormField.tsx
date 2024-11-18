import { useFormikContext } from "formik";
import React from "react";
import ErrorMessage from "./ErrorMessage";
import InputField from "./InputField";
import { InputFieldProps } from "@/types/type";

const AppFormField = ({
  name,
  label,
  ...otherProps
}: InputFieldProps & {
  name: string;
}) => {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();
  return (
    <>
      <InputField
        label={label}
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        {...otherProps}
      />
      <ErrorMessage error={errors[name as keyof typeof errors]} visible={touched[name as keyof typeof touched]} />
    </>
  );
};

export default AppFormField;
