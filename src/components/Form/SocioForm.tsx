import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputField } from "../InputField";

export const SocioForm = ({
  type,
  data,
}: {
  type: "ver" | "crear" | "modificar";
  data?: any;
}) => {
  const schema = z.object({
    nombre: z
      .string()
      .min(3, { message: "El nombre debe de tener como mínimo 3 carácteres" })
      .max(50, { message: "El nombre debe de tener como máximo 3 carácteres" }),

    apellidos: z
      .string()
      .min(3, {
        message: "Los apellildos debe de tener como mínimo 3 carácteres",
      })
      .max(100, {
        message: "Los apellildos debe de tener como máximo 100 carácteres",
      }),

    dni: z
      .string()
      .min(9, {
        message: "Introduce un DNI válido",
      })
      .max(9, {
        message: "Introduce un DNI válido",
      }),
    telefono: z.string().min(1, { message: "Introduce un teléfono" }),

    email: z.string().email({ message: "Correo electrónico inválido" }),

    calle: z
      .string()
      .min(3, {
        message: "La calle debe de tener como mínimo 3 carácteres",
      })
      .max(100, {
        message: "La calle debe de tener como máximo 100 carácteres",
      }),
    provincia: z
      .string()
      .min(3, {
        message: "La provincia debe de tener como mínimo 3 carácteres",
      })
      .max(50, {
        message: "La provincia debe de tener como máximo 50 carácteres",
      }),
    localidad: z
      .string()
      .min(3, {
        message: "La localidad debe de tener como mínimo 3 carácteres",
      })
      .max(50, {
        message: "La localidad debe de tener como máximo 50 carácteres",
      }),
    codPostal: z.string().min(1, { message: "Introduce el código de postal" }),
    numero: z.string().min(1, { message: "Introduce el número" }),
    fechaNacimiento: z.preprocess((val) => {
      if (typeof val === "string" && val.trim() !== "") {
        const parsedDate = new Date(val);
        return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
      }
      return undefined;
    }, z.date({ message: "Introduce fecha de nacimiento válida" })),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const onsubmits = handleSubmit((data) => {
    if (type === "modificar") {
    } else if (type === "crear") {
    }
  });
  return (
    <form className="flex flex-col gap-8" onSubmit={onsubmits}>
      <h1 className="text-xl font-semibold">
        {type === "crear"
          ? "Registrar nuevo socio"
          : type === "modificar"
          ? "Modificar socio"
          : "Ver socio"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        DATOS PERSONALES
      </span>
      <div className=" flex justify-between flex-wrap gap-2">
        <InputField
          label="Nombre"
          name="nombre"
          register={register}
          disabled={type === "ver"}
          defaultValue={data?.nombre}
          error={errors.nombre}
        />
        <InputField
          label="Apellidos"
          name="apellidos"
          defaultValue={data?.apellidos}
          register={register}
          disabled={type === "ver"}
          error={errors.apellidos}
        />
        <InputField
          label="DNI"
          name="dni"
          defaultValue={data?.dni}
          register={register}
          disabled={type === "ver"}
          error={errors.dni}
        />
        <InputField
          label="Número de teléfono"
          name="telefono"
          register={register}
          disabled={type === "ver"}
          defaultValue={data?.telefono}
          error={errors.telefono}
        />
        <InputField
          label="Fecha de Nacimiento"
          name="fechaNacimiento"
          register={register}
          disabled={type === "ver"}
          defaultValue={
            data?.fechaNac ? data?.fechaNac.toISOString().split("T")[0] : ""
          } // Convierte la fecha a formato YYYY-MM-DD
          type="date"
          error={errors.fechaNacimiento}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          disabled={type === "ver"}
          register={register}
          error={errors.email}
        />
        <InputField
          label="Membresia"
          name="membresia"
          defaultValue={data?.membresia}
          disabled={type === "ver"}
          register={register}
          error={errors.membresia}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">DATOS DOMICILIO</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Codigo postal"
          name="codPostal"
          defaultValue={data?.codigoPostal}
          disabled={type === "ver"}
          register={register}
          error={errors.codPostal}
        />
        <InputField
          label="Calle"
          name="calle"
          defaultValue={data?.calle}
          disabled={type === "ver"}
          register={register}
          error={errors.calle}
        />
        <InputField
          label="Número"
          name="numero"
          defaultValue={data?.numero}
          disabled={type === "ver"}
          register={register}
          error={errors.numero}
        />
        <InputField
          label="Localidad"
          name="localidad"
          defaultValue={data?.localidad}
          disabled={type === "ver"}
          register={register}
          error={errors.localidad}
        />
        <InputField
          label="Provincia"
          name="provincia"
          defaultValue={data?.provincia}
          disabled={type === "ver"}
          register={register}
          error={errors.provincia}
        />
      </div>
      {type !== "ver" && (
        <button className="bg-blue-500 text-white p-2 rounded-md border-none w-max self-center">
          {type === "crear" ? "Registrar" : "Modificar"}
        </button>
      )}
    </form>
  );
};
