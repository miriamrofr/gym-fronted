import { PricingCard } from "../../components/PricingCard";
import { useEffect, useState } from "react";

export const Inscripcion = () => {
  const [membresia, setMembresia] = useState<Membresia[]>([]);

  type Membresia = {
    id: string;
    nombre: string;
    incluye: string;
    descripcion: string;
    accesoZonas: string;
    precioMensual: number;
  };

  const recarga = (recarga: any) => {
    if (recarga) {
      window.location.reload();
    }
  };

  const getMembresias = async () => {
    try {
      let url = `https://localhost:7245/api/gimnasio`;

      const response = await fetch(url);
      // URL de la API
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      const mem = data[0].tarifas.map((m: any) => ({
        id: m.id,
        nombre: m.nombre,
        incluye: m.incluye,
        descripcion: m.descripcion,
        accesoZonas: m.accesoZonas,
        precioMensual: m.precioMensual,
      }));
      setMembresia(mem);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };
  useEffect(() => {
    getMembresias();
  }, []);
  return <PricingCard onRecargar={recarga} data={membresia} />;
};
