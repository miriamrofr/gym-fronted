import { useAuth } from "../../context/UseAuth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table } from "../../components/Table";

const VerReserva = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const { user } = useAuth() ?? {};
  const [isSuccess, setIsSuccess] = useState(false);

  type Reserva = {
    idReserva: string;
    deporte: string;
    fecha: Date;
    horaComienzo: string;
    horaFin: string;
  };

  const columns = [
    { header: "Deporte", accessor: "tipo" },
    { header: "Fecha", accessor: "fecha" },
    {
      header: "Hora",
      accessor: "horas",
      className: "hidden md:table-cell",
    },
    { header: "", accessor: "acciones" },
  ];

  const renderRow = (item: Reserva) => (
    <tr
      key={item.idReserva}
      className="hover:bg-[#444] text-white text-sm border-b border-[#333] even:bg-[#1A1A1A]"
    >
      <td className="py-4">{item.deporte}</td>
      <td className="py-4 "> {new Date(item.fecha).toLocaleDateString()}</td>

      <td className=" py-4 hidden md:table-cell">
        <span>
          {item.horaComienzo.split(":").slice(0, 2).join(":")} -{" "}
          {item.horaFin.split(":").slice(0, 2).join(":")}
        </span>
      </td>

      <td className="py-4">
        <div className="flex items-center gap-2">
          <button
            className="bg-red-600 hover:bg-red-500 text-white p-2 mt-2 rounded-md border-none w-max font-bold "
            onClick={() => cancelar(item.idReserva)}
          >
            Cancelar
          </button>
        </div>
      </td>
    </tr>
  );

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);

  const cancelar = async (idHorario: string) => {
    var url = `https://localhost:7245/api/pista/quitar-reserva?idSocio=${user?.id}&idHorario=${idHorario} `;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer <TOKEN>", // Si necesitas incluir un token
        },
      });

      if (response.ok) {
        toast.success("Pista cancelada correctamente.");
        setIsSuccess(true);
      } else {
        const text = await response.text();
        toast.error(text);
      }
    } catch (error) {
      toast.error("Ocurrió un error al enviar los datos");
    }
  };

  useEffect(() => {
    getReservas();
  }, []);

  const getReservas = async () => {
    try {
      var url = `https://localhost:7245/api/pista/mis-reservas?idSocio=${user?.id}`;

      // Hacer la llamada a la API con el body y headers
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error en la API");
      }

      const data = await response.json();

      const transformedData = data.map((reserva: any) => ({
        idReserva: reserva.id,
        fecha: new Date(reserva.fecha), // Asegúrate de convertir la fecha a un objeto Date
        horaFin: reserva.horaFin,
        horaComienzo: reserva.horaInicio,
        deporte: reserva.deporte,
      }));

      console.log(transformedData);
      setReservas(transformedData);
    } catch (error) {
      toast.error("Error al buscar clases colectivas.");
    }
  };
  return (
    <div className="mt-8">
      {reservas.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={reservas} />
      ) : (
        <p className="text-center ">No tienes pistas reservadas.</p>
      )}
    </div>
  );
};

export default VerReserva;
