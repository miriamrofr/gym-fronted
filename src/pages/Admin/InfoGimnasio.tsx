import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputField } from "../../components/InputField";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FormModal } from "./FormModal";
import { Table } from "../../components/Table";
import { toast } from "react-toastify";

const infoGymSchema = z.object({
  direccion: z
    .string()
    .min(3, { message: "La dirección debe de tener como mínimo 3 carácteres" })
    .max(50, {
      message: "La dirección debe de tener como máximo 50 carácteres",
    }),
  telefono: z.string().min(1, { message: "Introduce teléfono" }),

  email: z.string().email({ message: "Introduce correo electrónico" }),
  horario: z.string().min(1, { message: "Introduce el horario" }).max(50, {
    message: "El horario debe de tener como máximo 50 carácteres",
  }),
});

const columns = [
  { header: "Nombre", accessor: "nombre" },
  {
    header: "Precio",
    accessor: "precio",
  },
  {
    header: "Descripción",
    accessor: "descripcion",
    className: "hidden md:table-cell",
  },
  {
    header: "Incluye",
    accessor: "incluye",
    className: "hidden md:table-cell",
  },
  {
    header: "Acceso zonas",
    accessor: "acceso",
    className: "hidden md:table-cell",
  },
  { header: "Acciones", accessor: "acciones" },
];

type Gimnasio = {
  id: number;
  nombre: string;
  direccion: string;
  horario: string;
  telefono: string;
  capacidad: string;
  email: string;
  tarifas: Tarifa[];
};

type Tarifa = {
  id: number;
  nombre: string;
  incluye: string;
  descripcion: string;
  accesoZonas: string;
  precioMensual: number;
};

export const InfoGimnasio = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(infoGymSchema),
  });
  const [modificando, setModificando] = useState(false);
  const [gimnasio, setGimanasio] = useState<Gimnasio | null>(null); // Cambiado a objeto
  const [tarifa, setTarifa] = useState<Tarifa[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleModificar = () => {
    setModificando(true); // Cambiar estado a edición
  };

  const handleCancelar = () => {
    setModificando(false); // Cancelar y volver al estado inicial
  };
  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);
  const handleAceptar = handleSubmit(async (formData) => {
    const apiData = {
      nombre: gimnasio?.nombre,
      direccion: formData.direccion,
      horario: formData.horario,
      capacidad: formData.capacidad,
      telefonoContacto: formData.telefono,
      email: formData.email,
    };

    try {
      var url;

      url = `https://localhost:7245/api/gimnasio/1`;

      const response = await fetch(url, {
        method: "PUT", // O "PUT" si es para actualizar
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
    setModificando(false); // Guardar cambios y volver al estado inicial
  });

  useEffect(() => {
    const fetchGimnasio = async () => {
      try {
        // Construir la URL con la búsqueda y paginación
        let url = `https://localhost:7245/api/gimnasio`;

        const response = await fetch(url);
        // URL de la API
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();

        console.log(data);
        const transformedData = {
          id: data[0].id,
          nombre: data[0].nombre,
          direccion: data[0].direccion,
          email: data[0].email,
          capacidad: data[0].capacidad,
          telefono: data[0].telefonoContacto,
          horario: data[0].horario, // Asegúrate de que este campo exista en la API
          tarifas: data[0].tarifas.map((tarifa: any) => ({
            id: tarifa.id,
            nombre: tarifa.nombre,
            incluye: tarifa.incluye,
            descripcion: tarifa.descripcion,
            accesoZonas: tarifa.accesoZonas,
            precioMensual: tarifa.precioMensual,
          })),
        };

        setGimanasio(transformedData);
        setTarifa(transformedData.tarifas);
        // Actualizar los valores del formulario
        setValue("direccion", transformedData.direccion);
        setValue("email", transformedData.email);
        setValue("telefono", transformedData.telefono);
        setValue("horario", transformedData.horario);
        console.log(transformedData);
      } catch (error) {
        console.error("Error al cargar:", error);
      }
    };

    fetchGimnasio();
  }, []);

  const renderRow = (item: Tarifa) => (
    <tr
      key={item.id}
      className="hover:bg-[#444] text-white text-sm border-b border-[#333] even:bg-[#1A1A1A]"
    >
      <td className="py-4 ">{item.nombre}</td>

      <td className="py-4 ">{item.precioMensual}</td>
      <td className="py-4 hidden md:table-cell">{item.descripcion}</td>
      <td className="py-4 hidden md:table-cell">{item.incluye}</td>
      <td className="py-4 hidden md:table-cell">{item.accesoZonas}</td>
      <td className="py-4">
        <div className="flex items-center gap-2">
          <FormModal table="tarifa" id={item.id} data={item} type="ver" />
          <FormModal table="tarifa" id={item.id} data={item} type="modificar" />
          <FormModal
            table="tarifa"
            id={item.id}
            type="eliminar"
            data={gimnasio}
          />
        </div>
      </td>
    </tr>
  );
  return (
    <div className="bg-[#0A0A0A] p-4 rounded-md m-4 flex-1">
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">AceFit Información</h1>
        <form
          className="flex flex-col gap-8 " /*onSubmit={handleSubmit(onSubmit)}*/
        >
          <div className=" flex  flex-col justify-between flex-wrap gap-2">
            <InputField
              label="Dirección"
              name="direccion"
              register={register}
              error={errors.direccion}
              disabled={!modificando}
              defaultValue={gimnasio?.direccion}
            />
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label htmlFor="horario" className="text-xs">
                Horario
              </label>
              <textarea
                id="horario"
                {...register("horario")} // Conectar con react-hook-form
                className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full ${
                  modificando
                    ? "bg-white text-black ring-gray-300"
                    : "bg-white text-black ring-gray-300"
                } h-20`} // Personalización de estilos
                disabled={!modificando} // Desactivar si no estás modificando
                defaultValue={gimnasio?.horario}
              ></textarea>
              {errors?.message && (
                <p className="text-xs text-red-400">
                  {errors.message.toString()}
                </p>
              )}
            </div>

            <InputField
              label="Correo de contacto"
              name="email"
              defaultValue={gimnasio?.email}
              disabled={!modificando}
              register={register}
              error={errors.email}
            />
            <InputField
              label="Teléfono de contacto"
              name="telefono"
              register={register}
              disabled={!modificando}
              defaultValue={gimnasio?.telefono}
              error={errors.telefono}
            />
            <div className="flex flex-row gap-8">
              {!modificando ? (
                <button
                  type="button"
                  className="bg-[#f35a30] text-white p-2 mt-2 rounded-md border-none w-max"
                  onClick={handleModificar}
                >
                  Modificar
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="bg-[#f35a30] text-white p-2 mt-2 rounded-md border-none w-max"
                    onClick={handleAceptar}
                  >
                    Aceptar
                  </button>
                  <button
                    type="button"
                    className="bg-[#f35a30] text-white p-2 mt-2 rounded-md border-none w-max"
                    onClick={handleCancelar}
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </form>

        {/* Botón "Crear" y Tabla */}
        <div className="flex flex-col gap-4 mt-6">
          {/* Botón "Crear" alineado a la derecha */}
          <div className="flex justify-end">
            <FormModal table="tarifa" type="crear" />
          </div>
          {/* Tabla */}
          <div>
            {" "}
            <Table columns={columns} renderRow={renderRow} data={tarifa} />
          </div>
        </div>
      </div>
    </div>
  );
};
