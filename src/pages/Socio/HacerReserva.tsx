import { useForm } from "react-hook-form";
import { InputField } from "../../components/InputField";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { useAuth } from "../../context/UseAuth";

const pistaSchema = z.object({
  fecha: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() !== "") {
      const parsedDate = new Date(val);
      return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
    }
    return undefined;
  }, z.date({ message: "Introduce fecha válida" })),

  tipoId: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Selecciona un deporte")
  ),

  horaComienzo: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Introduce una hora válida"),

  horFin: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Introduce una hora válida"),
});

type FormValues = {
  fecha: Date;
  horFin: string;
  horaComienzo: string;
  tipoId: number;
  nombreId: number;
};

type Deporte = {
  id: string;
  tipo: string;
  //horarios: Horario[];
};
/*type Horario = {
  fecha: Date;
  horaComienzo: string;
  horaFin: string;
  id?: string;
};*/

const HacerReserva = () => {
  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const { user } = useAuth() ?? {};
  const [pistaId, setPistaId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(pistaSchema),
  });

  useEffect(() => {
    arrayDeportes();
  }, []);

  const arrayDeportes = async () => {
    const response = await fetch("https://localhost:7245/api/pista?page=1");
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    const dep = data.pista.map((s: any) => ({ id: s.id, tipo: s.tipo }));
    setDeportes(dep);
  };

  const onSubmit = async (dataForm: FormValues) => {
    const apiData = {
      diaSemana: dataForm.fecha,
      horaComienzo: dataForm.horaComienzo,
      horaFin: dataForm.horFin,
      pistaId: dataForm.tipoId,
      socioId: user?.id,
    };

    try {
      var url = "https://localhost:7245/api/pista/reservar";

      const response = await fetch(url, {
        method: "POST", // O "PUT" si es para actualizar
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer <TOKEN>", // Si necesitas incluir un token
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        toast.success("Pista reservada correctamente.");
      } else {
        const text = await response.text();
        toast.error(text);
      }
    } catch (error) {
      toast.error("Ocurrió un error al enviar los datos");
    }
    console.log(dataForm);
  };

  return (
    <form className="flex flex-col gap-8 " onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs">Deporte</label>
        <select
          className={`ring-[1.5px] p-2 bg-white rounded-md text-sm text-black w-full`}
          {...register("tipoId")}
          defaultValue=""
        >
          <option value="" disabled>
            Selecciona un deporte
          </option>
          {deportes.map((deporte) => (
            <option key={deporte.id} value={deporte.id}>
              {deporte.tipo}
            </option>
          ))}
        </select>
        {errors.tipoId?.message && (
          <p className="text-xs text-red-400">
            {errors.tipoId.message.toString()}
          </p>
        )}
      </div>
      <InputField
        label="Fecha"
        type="date"
        register={register}
        name="fecha"
        error={errors.fecha}
        minDate="S"
      />

      <InputField
        label="Hora inicio"
        type="time"
        register={register}
        name="horaComienzo"
        error={errors.horaComienzo}
        step="1800"
      />

      <InputField
        label="Hora fin"
        type="time"
        register={register}
        name="horFin"
        error={errors.horFin}
        step="1800"
      />

      <button
        type="submit"
        className="bg-[#f35a30] text-white p-2 rounded-md border-none w-max self-center md:self-start "
      >
        Reservar
      </button>
    </form>
  );
};

export default HacerReserva;
