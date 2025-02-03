import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputField } from "../InputField";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const EntrenadorForm = ({
  type,
  data,
}: {
  type: "ver" | "crear" | "modificar";
  data?: any;
}) => {
  const isDisabled = type === "ver";
  const [isSuccess, setIsSuccess] = useState(false);
  const schema = z.object({
    nombre: z
      .string()
      .min(3, { message: "El nombre debe de tener como mínimo 3 carácteres" })
      .max(50, { message: "El nombre debe de tener como máximo 3 carácteres" }),

    sexo: z.enum(["hombre", "mujer", "otro"], {
      message: "Selecciona el sexo",
    }),
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
    especialidad: z
      .string()
      .min(3, { message: "La especialidad debe tener al menos 3 caracteres" })
      .max(40, {
        message: "La especialidad debe tener como máximo 40 caracteres",
      }),
  });

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (formData) => {
    const apiData = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      dni: formData.dni,
      sexo: formData.sexo.toLowerCase(), // Asegurar que esté en minúsculas si la API lo requiere
      correoElectronico: formData.email,
      telefono: formData.telefono,
      calle: formData.calle,
      codigoPostal: parseInt(formData.codPostal, 10), // Convertir a número
      localidad: formData.localidad,
      provincia: formData.provincia,
      numero: parseInt(formData.numero, 10), // Convertir a número
      fechaNacimiento: formData.fechaNacimiento.toISOString(), // Convertir a ISO string
      rol: "Entrenador", // Asignar el rol requerido
      especialidad: formData.especialidad, // Puedes definir este campo según las reglas de tu sistema
    };
    try {
      var url;
      var method;
      if (type === "modificar") {
        url = `https://localhost:7245/api/entrenadores/${data.id}`;
        method = "PUT";
      } else {
        url = `https://localhost:7245/api/entrenadores/1`;
        method = "POST";
      }
      // Hacer la llamada a la API con el body y headers
      const response = await fetch(url, {
        method: method, // O "PUT" si es para actualizar
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer <TOKEN>", // Si necesitas incluir un token
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error("Error en la API");
      }

      setIsSuccess(true);
    } catch (error) {
      toast.error("Ocurrió un error al enviar los datos");
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "crear"
          ? "Registrar nuevo entrenador"
          : type === "modificar"
          ? "Modificar entrenador"
          : "Ver entrenador"}
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs">Sexo</label>
          <select
            className={`ring-[1.5px] p-2 bg-white rounded-md text-sm text-black w-full ${
              isDisabled
                ? "bg-white text-black ring-gray-300 opacity-100"
                : "bg-white text-black ring-gray-300"
            }`}
            disabled={isDisabled}
            {...register("sexo")}
            onChange={(e) => {
              // Llamar manualmente al evento onChange para actualizar React Hook Form
              register("sexo").onChange(e);
            }}
            defaultValue={data?.sexo?.toLowerCase() || "hombre"}
          >
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
            <option value="otro">Otro</option>
          </select>
        </div>
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
            data?.fechaNac
              ? new Date(data?.fechaNac).toLocaleDateString("en-CA")
              : ""
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
          label="Especialidad"
          name="especialidad"
          defaultValue={data?.especialidad || ""}
          disabled={type === "ver"}
          register={register}
          error={errors.especialidad}
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
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md border-none w-max self-center"
        >
          {type === "crear" ? "Registrar" : "Modificar"}
        </button>
      )}
    </form>
  );
};
