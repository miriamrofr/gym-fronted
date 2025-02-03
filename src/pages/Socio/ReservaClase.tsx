import { useState } from "react";
import { Table } from "../../components/Table";
import CalendarioSemanal from "../../components/CalendarioSemanal";
import { useAuth } from "../../context/UseAuth";
import { toast } from "react-toastify";

export const ReservaClase = () => {
  const [clases, setClases] = useState<Clases[]>([]);
  const { user } = useAuth() ?? {};
  const [isSuccess, setIsSuccess] = useState(false);

  type Clases = {
    id: number;
    nombre: string;
    capacidadMaxima: string;
    horarios: Horario[];
  };

  type Horario = {
    id: number;
    inscrito: boolean;
    horaComienzo: Date;
    horaFin: Date;
    sociosInscritos: string;
  };

  const columns = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Hora", accessor: "hora" },
    {
      header: "Capacidad",
      accessor: "capacidad",
      className: "hidden md:table-cell",
    },
    { header: "", accessor: "acciones" },
  ];

  console.log(clases);
  const renderRow = (item: Clases) => (
    <tr
      key={item.id}
      className="hover:bg-[#444] text-white text-sm border-b border-[#333] even:bg-[#1A1A1A]"
    >
      <td className="py-4">{item.nombre}</td>
      <td className=" py-4">
        {item.horarios.length > 0 ? (
          <ul>
            {item.horarios.map((horario) => (
              <li
                key={horario.id}
                className="flex flex-col sm:flex-row sm:space-x-2"
              >
                <span>
                  {new Date(horario.horaComienzo).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(horario.horaFin).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          ""
        )}
      </td>
      <td className="py-4 hidden md:table-cell">
        {item.horarios.length > 0 ? item.horarios[0].sociosInscritos ?? "" : ""}
        /{item.capacidadMaxima}
      </td>

      <td className="py-4">
        <div className="flex items-center gap-2"></div>
        {item.horarios.length > 0 && !item.horarios[0].inscrito ? (
          <button
            className="bg-[#f35a30] hover:bg-[#ff7a47] text-white p-2 mt-2 rounded-md border-none w-max font-bold "
            onClick={() => reservar(item.id, item.horarios[0].id)}
          >
            Reservar
          </button>
        ) : (
          <button
            className="bg-red-600 hover:bg-red-500 text-white p-2 mt-2 rounded-md border-none w-max font-bold "
            onClick={() => cancelar(item.horarios[0].id)}
          >
            Cancelar
          </button>
        )}
      </td>
    </tr>
  );

  const reservar = async (idAct: number, idHorario: number) => {
    setIsSuccess(false);
    var url = `https://localhost:7245/api/actividad/reservar?idSocio=${user?.id}&idActividad=${idAct}&horarioId=${idHorario}`;

    try {
      const response = await fetch(url, {
        method: "POST", // O "PUT" si es para actualizar
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer <TOKEN>", // Si necesitas incluir un token
        },
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Clase reservada correctamente.");
      } else {
        const text = await response.text();
        toast.error(text);
      }
    } catch (error) {
      toast.error("Ocurrió un error al enviar los datos");
    }
  };

  const cancelar = async (idHorario: number) => {
    setIsSuccess(false);
    var url = `https://localhost:7245/api/actividad/quitar-reserva?idSocio=${user?.id}&idHorario=${idHorario}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer <TOKEN>", // Si necesitas incluir un token
        },
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Clase cancelada correctamente.");
      } else {
        const text = await response.text();
        toast.error(text);
      }
    } catch (error) {
      toast.error("Ocurrió un error al enviar los datos");
    }
  };
  const datosClases = async (datos: any) => {
    const transformedData = await Promise.all(
      datos.actividad.map(async (actividad: any) => ({
        id: actividad.id,
        nombre: actividad.nombre,
        capacidadMaxima: actividad.capacidadMaxima,
        horarios: actividad.horarios.map((horario: any) => ({
          id: horario.horarios.id,
          horaComienzo: new Date(horario.horarios.horaComienzo),
          horaFin: new Date(horario.horarios.horaFin),
          inscrito: horario.inscrito,
          sociosInscritos: horario.horarios.sociosInscritos,
        })),
      }))
    );
    setClases(transformedData);
  };
  return (
    <div className="bg-[#0A0A0A] p-4 rounded-md m-4 flex flex-col">
      <CalendarioSemanal onDatosClases={datosClases} isSuccess={isSuccess} />
      <div className="mt-8">
        {clases.length > 0 &&
        clases.some((clase) => clase.horarios.length > 0) ? (
          <Table columns={columns} renderRow={renderRow} data={clases} />
        ) : (
          <p className="text-center ">No hay clases disponibles</p>
        )}
      </div>
    </div>
  );
};
