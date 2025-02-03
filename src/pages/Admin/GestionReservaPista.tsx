import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FormModal } from "./FormModal";
import { SearchBar } from "../../components/SearchBar";
import { Table } from "../../components/Table";
import { Pagination } from "../../components/Pagination";

type Horario = {
  id: number;
  diaSemana: string;
  disponibilidadComienzo: string;
  disponibilidadFin: string;
};
type Pista = {
  id: number;
  nombre: string;
  tipo: string;
  horarios: Horario[];
};

const columns = [
  { header: "Nombre", accessor: "nombre" },
  { header: "Tipo", accessor: "tipo", className: "hidden md:table-cell" },
  {
    header: "Disponibilidad",
    accessor: "disponibilidad",
  },
  { header: "Acciones", accessor: "acciones" },
];
export const GestionReservaPista = () => {
  const [pista, setPista] = useState<Pista[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNumber = parseInt(searchParams.get("page") || "1");
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (search: string) => {
    setSearchQuery(search);
    setTotalPages;
    // Actualiza el estado de búsqueda cuando se realiza la búsqueda
  };

  useEffect(() => {
    const fetchActividad = async (page: number, search: string) => {
      try {
        // Construir la URL con la búsqueda y paginación
        let url = `https://localhost:7245/api/pista`;
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
          data.pista.map(async (pista: any) => ({
            id: pista.id,
            nombre: pista.nombre,
            tipo: pista.tipo,
            horarios: pista.horarios.map((horario: any) => ({
              id: horario.id,
              diaSemana: horario.diaSemana,
              disponibilidadComienzo: horario.horaComienzo,
              disponibilidadFin: horario.horaFin,
            })),
          }))
        );

        setPista(transformedData);
      } catch (error) {
        console.error("Error al cargar las pistas:", error);
      }
    };

    fetchActividad(pageNumber, searchQuery);
  }, [pageNumber, searchQuery]);

  const renderRow = (item: Pista) => (
    <tr
      key={item.id}
      className="hover:bg-[#444] text-white text-sm border-b border-[#333] even:bg-[#1A1A1A]"
    >
      <td className="py-4">{item.nombre}</td>
      <td className="py-4 hidden md:table-cell">{item.tipo}</td>
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
                  {horario.disponibilidadComienzo
                    .split(":")
                    .slice(0, 2)
                    .join(":")}
                  - {horario.disponibilidadFin.split(":").slice(0, 2).join(":")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          ""
        )}
      </td>
      <td className="py-4">
        <div className="flex items-center gap-2">
          <FormModal table="pista" id={item.id} data={item} type="ver" />
          <FormModal table="pista" id={item.id} data={item} type="modificar" />
          <FormModal table="pista" id={item.id} type="eliminar" />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-[#0A0A0A] p-4 rounded-md m-4 flex-1">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-lg font-semibold">Reserva de pistas</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <SearchBar onSearch={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <div className="flex items-center">
              <FormModal table="pista" type="crear" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Table columns={columns} renderRow={renderRow} data={pista} />
      </div>
      <div className="">
        <Pagination totalPages={totalPages} pageNumber={pageNumber} />
      </div>
    </div>
  );
};
