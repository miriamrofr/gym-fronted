import { useForm, useFieldArray } from "react-hook-form";
import { InputField } from "../InputField";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";

export const ActividadForm = ({
  type,
  data,
}: {
  type: "ver" | "crear" | "modificar";
  data?: any;
}) => {
  const [entrenador, setEntrenador] = useState<Entrenador[]>([]);
  const [sala, setSala] = useState<Sala[]>([]);
  const isDisabled = type === "ver";
  const [isSuccess, setIsSuccess] = useState(false);

  type Entrenador = {
    id: number;
    nombre: string;
  };

  type Sala = {
    id: number;
    nombre: string;
  };

  const actividadSchema = z.object({
    idEntrenador: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "Selecciona un entrenador")
    ),
    salaId: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "Selecciona una sala")
    ),
    nombre: z
      .string()
      .min(3, { message: "El nombre debe de tener como mínimo 3 carácteres" })
      .max(50, { message: "El nombre debe de tener como máximo 3 carácteres" }),

    descripcion: z
      .string()
      .min(3, {
        message: "La descripción debe de tener como mínimo 3 carácteres",
      })
      .max(50, {
        message: "La descripción debe de tener como máximo 100 carácteres",
      }),
    capacidad: z.string().min(1, { message: "Introduce la capacidad" }),
    actividades: z.array(
      z.object({
        fecha: z.preprocess((val) => {
          if (typeof val === "string" && val.trim() !== "") {
            const parsedDate = new Date(val);
            return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
          }
          return undefined;
        }, z.date({ message: "Introduce fecha válida" })),
        horaComienzo: z
          .string()
          .regex(
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            "Introduce una hora válida"
          ),
        horaFin: z
          .string()
          .regex(
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            "Introduce una hora válida"
          ),
        id: z.string().optional(),
      })
    ),
  });

  type Actividad = {
    fecha: Date;
    horaComienzo: string;
    horaFin: string;
    id?: string;
  };

  type FormValues = {
    capacidad: string;
    nombre: string;
    descripcion: string;
    actividades: Actividad[];
    salaId: string;
    idEntrenador: string;
  };
  const transformedData = data
    ? data.horarios.map((item: any) => ({
        id: item.id.toString(),
        fecha: item.horaComienzo.toISOString().split("T")[0], // Fecha en formato 'YYYY-MM-DD'
        horaComienzo: item.horaComienzo.toTimeString().substring(0, 5), // Hora en formato 'HH:mm'
        horaFin: item.horaFin.toTimeString().substring(0, 5), // Hora en formato 'HH:mm'
      }))
    : [];
  // Obtener entrenadores
  const arrayEntrenadores = async () => {
    const response = await fetch(
      "https://localhost:7245/api/entrenadores?page=1"
    );
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    const entrenadores = data.entrenador.map((e: any) => ({
      id: e.id,
      nombre: e.nombre,
    }));
    setEntrenador(entrenadores);
  };

  // Obtener salas
  const arraySalas = async () => {
    const response = await fetch("https://localhost:7245/api/sala");
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    const salas = data.map((s: any) => ({ id: s.id, nombre: s.nombreSala }));
    setSala(salas);
  };

  useEffect(() => {
    arrayEntrenadores();
    arraySalas();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(actividadSchema),
    defaultValues: {
      idEntrenador: data?.idEntrenador || "", // Valor por defecto para el entrenador
      salaId: data?.salaId || "", // Valor por defecto para la sala
      actividades: transformedData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "actividades", // Este es el nombre del array
  });

  const onSubmit = async (dataForm: FormValues) => {
    // Transformar los datos antes de enviarlos a la API
    const transformedData = dataForm.actividades.map((actividad: any) => {
      const fecha = new Date(actividad.fecha); // La fecha en formato 'YYYY-MM-DD'
      const horaComienzo = `${actividad.horaComienzo}`; // Combina fecha + hora de inicio
      const horaFin = `${actividad.horaFin}`; // Combina fecha + hora de fin
      const formattedDate = fecha.toISOString().split("T")[0];
      const fechaHoraComienzo = `${formattedDate}T${horaComienzo}:00`;
      const fechaHoraFin = `${formattedDate}T${horaFin}:00`;
      return {
        id: actividad.id, // Si ya tienes un ID, lo mantienes
        diaSemana: new Date(fecha).toLocaleString("es-ES", { weekday: "long" }), // Obtener el día de la semana en español
        horaComienzo: fechaHoraComienzo, // Asegúrate de que sea ISO 8601
        horaFin: fechaHoraFin, // Asegúrate de que sea ISO 8601
      };
    });
    const apiData = {
      nombre: dataForm.nombre,
      descripcion: dataForm.descripcion,
      capacidadMaxima: dataForm.capacidad,
      entrenadorId: dataForm.idEntrenador,
      salaId: dataForm.salaId,
      horarios: transformedData.map((horario) => ({
        id: isNaN(Number(horario.id)) ? "0" : horario.id,
        diaSemana: horario.diaSemana,
        horaComienzo: horario.horaComienzo,
        horaFin: horario.horaFin,
      })),
    };

    console.log(apiData);

    try {
      var url;
      var method;
      if (type === "modificar") {
        url = `https://localhost:7245/api/actividad/${data.id}`;
        method = "PUT";
      } else {
        url = `https://localhost:7245/api/actividad/1`;
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
    } finally {
      setIsSuccess(true);
    }
  };
  useEffect(() => {
    if (data) {
      setValue("idEntrenador", data?.idEntrenador || ""); // Sincroniza el valor inicial del entrenador
      setValue("salaId", data?.salaId || ""); // Sincroniza el valor inicial de la sala
      console.log(data);
    }
  }, [data, setValue, sala, entrenador]);
  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);

  return (
    <form className="flex flex-col gap-8 " onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "crear"
          ? "Registrar nueva actividad grupal"
          : type === "modificar"
          ? "Modificar actividad grupal"
          : "Ver actividad grupal"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">ACTIVIDAD</span>
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
          label="Descripción"
          name="descripcion"
          defaultValue={data?.descripcion}
          register={register}
          disabled={type === "ver"}
          error={errors.descripcion}
        />
        <InputField
          label="Capacidad"
          name="capacidad"
          defaultValue={data?.capacidad}
          register={register}
          disabled={type === "ver"}
          error={errors.capacidad}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs">Entrenador</label>
          <select
            className={`ring-[1.5px] p-2 bg-white rounded-md text-sm text-black w-full ${
              isDisabled
                ? "bg-white text-black ring-gray-300 opacity-100"
                : "bg-white text-black ring-gray-300"
            }`}
            disabled={isDisabled}
            {...register("idEntrenador")}
            defaultValue={data?.idEntrenador || ""}
            /*onChange={(e) => {
              // Llamar manualmente al evento onChange para actualizar React Hook Form
              setSelectedEntrenador(e.target.value);
              register("entrenador").onChange(e);
            }}
            value={
              selectedEntrenador ||
              (entrenador.length > 0 ? entrenador[0].id : "")
            } // Si no hay idEntrenador, se selecciona el primero*/
          >
            {entrenador.map((entrenador) => (
              <option key={entrenador.id} value={entrenador.id}>
                {entrenador.nombre}
              </option>
            ))}
            {errors.idEntrenador && <span>{errors.idEntrenador.message}</span>}
          </select>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs">Sala</label>
          <select
            className={`ring-[1.5px] p-2 bg-white rounded-md text-sm text-black w-full ${
              isDisabled
                ? "bg-white text-black ring-gray-300 opacity-100"
                : "bg-white text-black ring-gray-300"
            }`}
            disabled={isDisabled}
            {...register("salaId")}
            defaultValue={data?.salaId || ""}
            /*onChange={(e) => {
              // Llamar manualmente al evento onChange para actualizar React Hook Form
              setSelectedSala(e.target.value);
              register("sala").onChange(e);
            }}
            value={selectedSala || (sala.length > 0 ? sala[0].id : "")}*/
          >
            {sala.map((sala) => (
              <option key={sala.id} value={sala.id}>
                {sala.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">HORARIO</span>
      <div className="flex items-center gap-2">
        {type !== "ver" && (
          <>
            <button
              type="button"
              onClick={() =>
                append({ fecha: new Date(), horaComienzo: "", horaFin: "" })
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
          <input
            type="hidden"
            {...register(`actividades.${index}.id`)} // Campo oculto para el id
            defaultValue={item.id}
          />
          <InputField
            label="Fecha"
            type="date"
            register={register}
            name={`actividades[${index}].fecha`} // Asegúrate de que el nombre coincida con los valores de `defaultValues`
            //defaultValue={item.fecha} // Usamos `item.fecha` aquí
            error={errors.actividades?.[index]?.fecha} // Maneja los errores correctamente
            disabled={isDisabled}
          />

          <InputField
            label="Hora Inicio"
            type="time"
            register={register}
            name={`actividades[${index}].horaComienzo`} // Nombre correcto del campo
            //defaultValue={item.horaComienzo} // Usamos `item.horaComienzo` aquí
            error={errors.actividades?.[index]?.horaComienzo} // Maneja los errores correctamente
            disabled={isDisabled}
          />

          <InputField
            label="Hora Fin"
            type="time"
            register={register}
            name={`actividades[${index}].horaFin`} // Nombre correcto del campo
            //defaultValue={item.horaFin} // Usamos `item.horaFin` aquí
            disabled={isDisabled}
            error={errors.actividades?.[index]?.horaFin} // Maneja los errores correctamente
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
