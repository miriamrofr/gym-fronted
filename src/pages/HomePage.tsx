import { useEffect, useState } from "react";
import { NavBarHome } from "../components/NavBarHome";
import { PricingCardLanding } from "../components/PricingCardLanding";
import { Footer } from "../components/Footer";

export const HomePage = () => {
  const [membresia, setMembresia] = useState<Membresia[]>([]);

  type Membresia = {
    id: string;
    nombre: string;
    incluye: string;
    descripcion: string;
    accesoZonas: string;
    precioMensual: number;
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
  return (
    <>
      <NavBarHome />
      <div className="relative pt-16 pb-32 flex content-center items-center justify-center h-[100vh] bg-black">
        <div
          id="/"
          className="absolute top-0 w-full h-full bg-top bg-cover  bg-[url(fondo3.jpg)]"
        >
          <span
            id="blackOverlay"
            className="w-full h-full absolute opacity-75 bg-black"
          ></span>
        </div>

        <div className="relative flex m-auto">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <div>
                <h1 className="text-white font-semibold text-5xl ">
                  Tu esfuerzo, tu <span className="text-[#f35a30]">éxito</span>
                </h1>
                <p className="mt-4 text-lg text-white">
                  Somos más que un gimnasio, somos una comunidad que te impulsa
                  a dar lo mejor de ti. Ya sea que busques fuerza, resistencia o
                  bienestar, estamos aquí para ayudarte a lograrlo. ¡Únete y
                  siente la energía!
                </p>
                <a
                  href="/signup"
                  className="bg-[#f35a30] hover:bg-[#e96d4a] text-white font-semibold  p-4   rounded inline-block mt-5 cursor-pointer"
                >
                  Apúntate
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-[90px]">
          <svg
            className="absolute bottom-0 overflow-hidden "
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>
      </div>
      <section id="precios">
        <div className="relative bg-black p-7">
          <PricingCardLanding data={membresia} />
        </div>
      </section>
      <div>
        <Footer />
      </div>
    </>
  );
};
