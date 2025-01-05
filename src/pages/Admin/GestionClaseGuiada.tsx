import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FormModal } from "./FormModal";
import { SearchBar } from "../../components/SearchBar";
import { Table } from "../../components/Table";
import { Pagination } from "../../components/Pagination";

type Horario = {
  id: number;
  diaSemana: string;
  horaComienzo: Date;
  horaFin: Date;
};
type Clases = {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  idEntrenador: number;
  salaId: number;
  nombreSala: string;
  horarios: Horario[];
};

const columns = [
  { header: "Nombre", accessor: "nombre" },
  {
    header: "Horario",
    accessor: "horario",
  },
  {
    header: "Capacidad",
    accessor: "capacidad",
    className: "hidden lg:table-cell",
  },
  { header: "Sala", accessor: "sala", className: "hidden lg:table-cell" },

  { header: "Acciones", accessor: "acciones" },
];

export const GestionClaseGuiada = () => {
  const [clase, setClase] = useState<Clases[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNumber = parseInt(searchParams.get("page") || "1");
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (search: string) => {
    setSearchQuery(search);
    setTotalPages;
    // Actualiza el estado de búsqueda cuando se realiza la búsqueda
  };
  const searchNombreSala = async (search: number) => {
    let url = `https://localhost:7245/api/sala/${search}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.nombreSala;
  };
  useEffect(() => {
    const fetchActividad = async (page: number, search: string) => {
      try {
        // Construir la URL con la búsqueda y paginación
        let url = `https://localhost:7245/api/actividad`;
        if (search) {
          url += `/search?value=${search}&page=${page}`;
        } else {
          url += `?page=${page}`;
        }

        const response = await fetch(url);
        // URL de la API
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setTotalPages(data.totalPages);

        const transformedData = await Promise.all(
          data.actividad.map(async (actividad: any) => ({
            id: actividad.id,
            nombre: actividad.nombre,
            descripcion: actividad.descripcion,
            capacidad: actividad.capacidadMaxima,
            idEntrenador: actividad.entrenadorId,
            salaId: actividad.salaId,
            nombreSala: await searchNombreSala(actividad.salaId),
            horarios: actividad.horarios.map((horario: any) => ({
              id: horario.id,
              diaSemana: horario.diaSemana,
              horaComienzo: new Date(horario.horaComienzo),
              horaFin: new Date(horario.horaFin),
              actividadId: horario.actividadId,
            })),
          }))
        );

        setClase(transformedData);
      } catch (error) {
        console.error("Error al cargar los materiales:", error);
      }
    };

    fetchActividad(pageNumber, searchQuery);
  }, [pageNumber, searchQuery]);

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
                <span className="font-bold">{horario.diaSemana}:</span>
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
      <td className="hidden md:table-cell py-4">{item.capacidad}</td>
      <td className="hidden md:table-cell py-4">{item.nombreSala}</td>
      <td className="py-4">
        <div className="flex items-center gap-2">
          <FormModal table="actividad" id={item.id} data={item} type="ver" />
          <FormModal
            table="actividad"
            id={item.id}
            data={item}
            type="modificar"
          />
          <FormModal table="actividad" id={item.id} type="eliminar" />
        </div>
      </td>
    </tr>
  );
  return (
    <div className="bg-[#0A0A0A] p-4 rounded-md m-4 flex-1">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-lg font-semibold">Actividades grupales</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <SearchBar onSearch={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <div className="flex items-center">
              <FormModal table="actividad" type="crear" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Table columns={columns} renderRow={renderRow} data={clase} />
      </div>
      <div className="">
        <Pagination totalPages={totalPages} pageNumber={pageNumber} />
      </div>
    </div>
  );
};
