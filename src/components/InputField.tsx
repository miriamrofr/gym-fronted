import React, { HtmlHTMLAttributes } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>; // Actualización aquí
  inputProps?: React.InputHTMLAttributes<HTMLHtmlElement>;
  disabled?: boolean;
};

export const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  inputProps,
  disabled = false,
  error,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label className="text-xs">{label}</label>
      <input
        type={type}
        disabled={disabled}
        {...register(name)}
        className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full ${
          disabled
            ? "bg-white text-black ring-gray-300"
            : "bg-gray-100 text-black ring-gray-300"
        }`}
        {...inputProps}
        defaultValue={defaultValue}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};
