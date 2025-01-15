import { useForm } from "react-hook-form";
import { InputField } from "../InputField";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";

export const TarifaForm = ({
  type,
  data,
}: {
  type: "ver" | "crear" | "modificar";
  data?: any;
}) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const tarifaSchema = z.object({
    nombre: z.string().min(1, { message: "Introduce el nombre" }).max(50, {
      message: "El nombre debe de tener como máximo 50 carácteres",
    }),

    descripcion: z
      .string()
      .min(1, {
        message: "Introduce la descripción",
      })
      .max(100, {
        message: "La descripción debe de tener como máximo 100 carácteres",
      }),

    incluye: z
      .string()
      .min(1, {
        message: "Introduce lo que incluye",
      })
      .max(100, {
        message: "El campo debe de tener como máximo 100 carácteres",
      }),
    precio: z.string().min(1, { message: "Introduce el precio" }),
    acceso: z.string().min(1, { message: "Introduce el acceso" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tarifaSchema),
  });

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);

  const onSubmit = handleSubmit(async (formData) => {
    const apiData = {
      nombre: formData.nombre,
      incluye: formData.incluye,
      descripcion: formData.descripcion,
      accesoZonas: formData.acceso,
      precioMensual: formData.precio,
    };

    try {
      var url;
      var method;
      if (type === "modificar") {
        url = `https://localhost:7245/api/gimnasio/1/tarifa/${data.id}`;
        method = "PUT";
      } else {
        url = `https://localhost:7245/api/gimnasio/1/tarifa`;
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
    <form className="flex flex-col gap-8 " onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "crear"
          ? "Registrar nueva tarifa"
          : type === "modificar"
          ? "Modificar tarifa"
          : "Ver tarifa"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">TARIFA</span>
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
          label="Descripcion"
          name="descripcion"
          defaultValue={data?.descripcion}
          register={register}
          disabled={type === "ver"}
          error={errors.descripcion}
        />
        <InputField
          label="Incluye"
          name="incluye"
          register={register}
          disabled={type === "ver"}
          defaultValue={data?.incluye}
          error={errors.incluye}
        />
        <InputField
          label="Acceso a zonas"
          name="acceso"
          register={register}
          disabled={type === "ver"}
          defaultValue={data?.accesoZonas}
          error={errors.acceso}
        />
        <InputField
          label="Precio mensual"
          name="precio"
          register={register}
          disabled={type === "ver"}
          defaultValue={data?.precioMensual}
          error={errors.precio}
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
