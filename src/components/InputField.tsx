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
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Cambio aquí para recibir una función
  className?: string;
};

export const InputField = ({
  label,
  type,
  register,
  name,
  defaultValue,
  inputProps,
  disabled = false,
  error,
  value,
  onChange,
  className,
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
            : "bg-white text-black ring-gray-300"
        } ${className ?? ""}`}
        {...inputProps}
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e); // Si `onChange` fue pasado como prop, ejecutamos la función
          }
        }}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};
