import { useForm, useFieldArray } from "react-hook-form";
import { InputField } from "../InputField";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";

export const PistaForm = ({
  type,
  data,
}: {
  type: "ver" | "crear" | "modificar";
  data?: any;
}) => {
  const isDisabled = type === "ver";
  const [isSuccess, setIsSuccess] = useState(false);

  const pistaSchema = z.object({
    nombre: z
      .string()
      .min(3, { message: "El nombre debe de tener como mínimo 3 carácteres" })
      .max(50, {
        message: "El nombre debe de tener como máximo 50 carácteres",
      }),

    tipo: z
      .string()
      .min(3, {
        message: "El tipo debe de tener como mínimo 3 carácteres",
      })
      .max(50, {
        message: "El tipo debe de tener como máximo 100 carácteres",
      }),

    horarios: z.array(
      z.object({
        fecha: z.preprocess((val) => {
          if (typeof val === "string" && val.trim() !== "") {
            const parsedDate = new Date(val);
            return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
          }
          return undefined;
        }, z.date({ message: "Introduce fecha válida" })),
        disponibilidadComienzo: z
          .string()
          .regex(
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            "Introduce una hora válida"
          ),
        disponibilidadFin: z
          .string()
          .regex(
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            "Introduce una hora válida"
          ),
      })
    ),
  });

  type Horario = {
    fecha: Date;
    disponibilidadComienzo: string;
    disponibilidadFin: string;
  };

  type FormValues = {
    nombre: string;
    tipo: string;
    horarios: Horario[];
    salaId: string;
    idEntrenador: string;
  };

  const transformedData = data
    ? data.horarios.map((item: any) => ({
        id: item.id.toString(),
        fecha: item.disponibilidadComienzo.toISOString().split("T")[0], // Fecha en formato 'YYYY-MM-DD'
        disponibilidadComienzo: item.disponibilidadComienzo
          .toTimeString()
          .substring(0, 5), // Hora en formato 'HH:mm'
        disponibilidadFin: item.disponibilidadFin
          .toTimeString()
          .substring(0, 5), // Hora en formato 'HH:mm'
      }))
    : [];

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(pistaSchema),
    defaultValues: {
      idEntrenador: data?.idEntrenador || "", // Valor por defecto para el entrenador
      salaId: data?.salaId || "", // Valor por defecto para la sala
      horarios: transformedData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "horarios", // Este es el nombre del array
  });

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);

  const onSubmit = async (dataForm: FormValues) => {
    // Transformar los datos antes de enviarlos a la API
    const transformedData = dataForm.horarios.map((horario: any) => {
      const fecha = new Date(horario.fecha); // La fecha en formato 'YYYY-MM-DD'
      const disponibilidadComienzo = `${horario.disponibilidadComienzo}`; // Combina fecha + hora de inicio
      const disponibilidadFin = `${horario.disponibilidadFin}`; // Combina fecha + hora de fin
      const formattedDate = fecha.toISOString().split("T")[0];
      const fechaHoraComienzo = `${formattedDate}T${disponibilidadComienzo}:00`;
      const fechaHoraFin = `${formattedDate}T${disponibilidadFin}:00`;
      return {
        id: horario.id, // Si ya tienes un ID, lo mantienes
        diaSemana: new Date(fecha).toLocaleString("es-ES", { weekday: "long" }), // Obtener el día de la semana en español
        disponibilidadComienzo: fechaHoraComienzo, // Asegúrate de que sea ISO 8601
        disponibilidadFin: fechaHoraFin, // Asegúrate de que sea ISO 8601
      };
    });

    const apiData = {
      nombre: dataForm.nombre,
      tipo: dataForm.tipo,
      horarios: transformedData.map((horario) => ({
        diaSemana: horario.diaSemana,
        disponibilidadComienzo: horario.disponibilidadComienzo,
        disponibilidadFin: horario.disponibilidadFin,
      })),
    };

    console.log(apiData);
    console.log(data.id);

    try {
      var url;
      var method;
      if (type === "modificar") {
        url = `https://localhost:7245/api/pista/${data.id}`;
        method = "PUT";
      } else {
        url = `https://localhost:7245/api/pista/1`;
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
  };

  return (
    <form className="flex flex-col gap-8 " onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "crear"
          ? "Registrar nueva pista"
          : type === "modificar"
          ? "Modificar pista"
          : "Ver pista"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">PISTA</span>
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
          label="Tipo"
          name="tipo"
          defaultValue={data?.tipo}
          register={register}
          disabled={type === "ver"}
          error={errors.tipo}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">HORARIO</span>
      <div className="flex items-center gap-2">
        {type !== "ver" && (
          <>
            <button
              type="button"
              onClick={() =>
                append({
                  fecha: new Date(),
                  disponibilidadComienzo: "",
                  disponibilidadFin: "",
                })
              }
              className="bg-[#f35a30] text-white w-7 h-7 flex items-center justify-center rounded font-bold"
            >
              +
            </button>
            <span className="text-white text-sm">Añadir nuevo horario</span>
          </>
        )}
      </div>
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="flex justify-between items-center flex-wrap gap-4"
        >
          <InputField
            label="Fecha"
            type="date"
            register={register}
            name={`horarios[${index}].fecha`} // Asegúrate de que el nombre coincida con los valores de `defaultValues`
            //defaultValue={item.fecha} // Usamos `item.fecha` aquí
            error={errors.horarios?.[index]?.fecha} // Maneja los errores correctamente
            disabled={isDisabled}
          />

          <InputField
            label="Inicio Disponibilidad"
            type="time"
            register={register}
            name={`horarios[${index}].disponibilidadComienzo`} // Nombre correcto del campo
            //defaultValue={item.horaComienzo} // Usamos `item.horaComienzo` aquí
            error={errors.horarios?.[index]?.disponibilidadComienzo} // Maneja los errores correctamente
            disabled={isDisabled}
          />

          <InputField
            label="Fin Disponibilidad"
            type="time"
            register={register}
            name={`horarios[${index}].disponibilidadFin`} // Nombre correcto del campo
            //defaultValue={item.horaFin} // Usamos `item.horaFin` aquí
            disabled={isDisabled}
            error={errors.horarios?.[index]?.disponibilidadFin} // Maneja los errores correctamente
          />
          {type !== "ver" && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="bg-[#f35a30] text-white w-8 h-8 flex items-center justify-center rounded-full mt-5"
            >
              -
            </button>
          )}
        </div>
      ))}
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
