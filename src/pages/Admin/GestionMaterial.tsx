import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FormModal } from "./FormModal";
import { SearchBar } from "../../components/SearchBar";
import { Table } from "../../components/Table";
import { Pagination } from "../../components/Pagination";

type Material = {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  fechaAdquisicion: Date; // Asegúrate de que el backend devuelve un formato de fecha compatible.
  categoria: string;
  precio: number;
  img?: string;
};

const columns = [
  { header: "Nombre", accessor: "nombre" },
  {
    header: "Descripcion",
    accessor: "descripcion",
    className: "hidden md:table-cell",
  },
  { header: "Cantidad", accessor: "cantidad" },
  {
    header: "Fecha Adquisicion",
    accessor: "fechaAdquisicion",
    className: "hidden lg:table-cell",
  },
  {
    header: "Categoria",
    accessor: "categoria",
    className: "hidden md:table-cell",
  },
  { header: "Precio", accessor: "precio", className: "hidden lg:table-cell" },
  { header: "Acciones", accessor: "acciones" },
];
export const GestionMaterial = () => {
  const [material, setMaterial] = useState<Material[]>([]);
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
    const fetchMaterial = async (page: number, search: string) => {
      try {
        // Construir la URL con la búsqueda y paginación
        let url = `https://localhost:7245/api/material`;
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

        const transformedData = data.material.map((material: any) => ({
          id: material.id,
          nombre: material.nombre,
          fechaAdquisicion: new Date(material.fechaAdquisicion), // Ajusta según la respuesta del backend
          descripcion: material.descripcion,
          cantidad: material.cantidad,
          categoria: material.categoria, // O ajusta el nombre si es diferente
          precio: material.precio,
          img: material.imagenUrl,
        }));

        setMaterial(transformedData);
      } catch (error) {
        console.error("Error al cargar los materiales:", error);
      }
    };

    fetchMaterial(pageNumber, searchQuery);
  }, [pageNumber, searchQuery]);

  const renderRow = (item: Material) => (
    <tr
      key={item.id}
      className="hover:bg-[#444] text-white text-sm border-b border-[#333] even:bg-[#1A1A1A]"
    >
      <td className="py-4">{item.nombre}</td>
      <td className="hidden md:table-cell py-4">{item.descripcion}</td>
      <td className=" py-4">{item.cantidad}</td>
      <td className="hidden lg:table-cell py-4">
        {new Date(item.fechaAdquisicion).toLocaleDateString()}
      </td>
      <td className="hidden md:table-cell py-4">{item.categoria}</td>
      <td className="hidden lg:table-cell py-4">{item.precio}</td>
      <td className="py-4">
        <div className="flex items-center gap-2">
          <FormModal table="material" id={item.id} data={item} type="ver" />
          <FormModal
            table="material"
            id={item.id}
            data={item}
            type="modificar"
          />
          <FormModal table="material" id={item.id} type="eliminar" />
        </div>
      </td>
    </tr>
  );
  return (
    <div className="bg-[#0A0A0A] p-4 rounded-md m-4 flex-1">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-lg font-semibold">Material</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <SearchBar onSearch={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <div className="flex items-center">
              <FormModal table="material" type="crear" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Table columns={columns} renderRow={renderRow} data={material} />
      </div>
      <div className="">
        <Pagination totalPages={totalPages} pageNumber={pageNumber} />
      </div>
    </div>
  );
};
