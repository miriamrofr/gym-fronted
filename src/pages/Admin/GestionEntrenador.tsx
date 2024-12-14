import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FormModal } from "./FormModal";
import { SearchBar } from "../../components/SearchBar";
import { Table } from "../../components/Table";
import { Pagination } from "../../components/Pagination";

type Entrenador = {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNac: Date; // Asegúrate de que el backend devuelve un formato de fecha compatible.
  especialidad: string;
  telefono: string;
  email: string;
  estado?: string; // Si estado no está en el backend, puedes hacerlo opcional.
  sexo: string;
};

const columns = [
  { header: "Nombre", accessor: "nombre" },
  {
    header: "Apellidos",
    accessor: "apellidos",
    className: "hidden md:table-cell",
  },
  { header: "Dni", accessor: "dni" },
  {
    header: "Fecha Nacimiento",
    accessor: "fechaNac",
    className: "hidden lg:table-cell",
  },
  {
    header: "Especialidad",
    accessor: "especialidad",
    className: "hidden md:table-cell",
  },
  { header: "Email", accessor: "email", className: "hidden lg:table-cell" },
  {
    header: "Telefono",
    accessor: "telefono",
    className: "hidden lg:table-cell",
  },
  { header: "Acciones", accessor: "acciones" },
];

export const GestionEntrenador = () => {
  const [entrenador, setEntrenador] = useState<Entrenador[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
    const fetchEntrenador = async (page: number, search: string) => {
      setLoading(true); // Empieza a cargar
      try {
        // Construir la URL con la búsqueda y paginación
        let url = `https://localhost:7245/api/entrenadores`;
        if (search) {
          url += `/search?value=${search}&page=${page}`;
          //https://localhost:7245/api/Socios/search?value=722&page=1
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

        const transformedData = data.entrenador.map((entrenador: any) => ({
          id: entrenador.id,
          nombre: entrenador.nombre,
          apellidos: entrenador.apellidos,
          dni: entrenador.dni,
          fechaNac: new Date(entrenador.fechaNacimiento), // Ajusta según la respuesta del backend
          especialidad: entrenador.especialidad,
          telefono: entrenador.telefono,
          email: entrenador.correoElectronico, // O ajusta el nombre si es diferente
          codigoPostal: entrenador.codigoPostal,
          localidad: entrenador.localidad,
          provincia: entrenador.provincia,
          calle: entrenador.calle,
          numero: entrenador.numero,
          sexo: entrenador.sexo,
        }));

        setEntrenador(transformedData);
      } catch (error) {
        console.error("Error al cargar los socios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntrenador(pageNumber, searchQuery);
  }, [pageNumber, searchQuery]);

  const renderRow = (item: Entrenador) => (
    <tr
      key={item.id}
      className="hover:bg-[#444] text-white text-sm border-b border-[#333] even:bg-[#1A1A1A]"
    >
      <td className="py-4">{item.nombre}</td>
      <td className="hidden md:table-cell py-4">{item.apellidos}</td>
      <td className=" py-4">{item.dni}</td>
      <td className="hidden lg:table-cell py-4">
        {new Date(item.fechaNac).toLocaleDateString()}
      </td>
      <td className="hidden md:table-cell py-4">{item.especialidad}</td>
      <td className="hidden lg:table-cell py-4">{item.email}</td>
      <td className="hidden lg:table-cell py-4">{item.telefono}</td>
      <td className="py-4">
        <div className="flex items-center gap-2">
          <FormModal table="entrenadores" id={item.id} data={item} type="ver" />
          <FormModal
            table="entrenadores"
            id={item.id}
            data={item}
            type="modificar"
          />
          <FormModal table="entrenadores" id={item.id} type="eliminar" />
        </div>
      </td>
    </tr>
  );
  return (
    <div className="bg-[#0A0A0A] p-4 rounded-md m-4 flex-1">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-lg font-semibold">Entrenador</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <SearchBar onSearch={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <div className="flex items-center">
              <FormModal table="entrenadores" type="crear" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Table columns={columns} renderRow={renderRow} data={entrenador} />
      </div>
      <div className="">
        <Pagination totalPages={totalPages} pageNumber={pageNumber} />
      </div>
    </div>
  );
};
