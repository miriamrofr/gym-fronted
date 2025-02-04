import { useAuth } from "../context/UseAuth";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export const PricingCard = ({ data, onRecargar }: any) => {
  const [tarifa, setTarifa] = useState("");
  const { user } = useAuth() ?? {};
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [socioPlan, setSocioPlan] = useState(0);

  const getInfoUser = async () => {
    try {
      let url = `https://localhost:7245/api/socios/${user?.id}`;

      const response = await fetch(url);
      // URL de la API
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      const tarifa = data.tarifaNombre;
      const tarifaId = data.tarifaId;
      setTarifa(tarifa);
      setSelectedPlan(tarifaId);
      setSocioPlan(tarifaId);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };
  useEffect(() => {
    getInfoUser();
  }, []);

  const onSubmit = () => {
    if (selectedPlan === socioPlan) {
      Swal.fire({
        title: "Error",
        text: "Ya estás inscrito en este plan.",
        icon: "error",
        color: "#fff",
        background: "#1A1A1A",
        confirmButtonColor: "#3085d6",
      });
    } else {
      Swal.fire({
        title: "¿Seguro que quieres cambiar de plan?",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        color: "#fff",
        background: "#1A1A1A",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let url = `https://localhost:7245/api/socios/cambiar-tarifa?socioId=${user?.id}&tarifaId=${selectedPlan}`;
            const response = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
              Swal.fire({
                title: "¡Plan actualizado!",
                text: "Tu plan ha sido cambiado correctamente. En breve recibirás un correo de confirmación.",
                icon: "success",
                color: "#fff",
                background: "#1A1A1A",
                confirmButtonColor: "#3085d6",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  onRecargar(true);
                }
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "Hubo un problema al cambiar de plan. Inténtelo de nuevo más tarde.",
                icon: "error",
                color: "#fff",
                background: "#1A1A1A",
                confirmButtonColor: "#3085d6",
              });
            }
          } catch (error) {
            Swal.fire({
              title: "Error",
              text: "Hubo un problema al cambiar de plan. Inténtelo de nuevo más tarde",
              icon: "error",
              color: "#fff",
              background: "#1A1A1A",
              confirmButtonColor: "#3085d6",
            });
          }
        }
      });
    }
  };

  return (
    <section>
      <div className="bg-[#0A0A0A] p-4 rounded-md m-4 flex flex-col">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-[#f35a30]">
            NUESTRAS SUSCRIPCIONES
          </h2>
          <p className="mb-5 font-light text-white sm:text-xl">
            Actualmente tienes el{" "}
            <span className="text-[#f35a30]">plan {tarifa}</span>. Si deseas
            cambiar tu suscripción, revisa nuestras opciones y elige la que
            mejor se adapte a tus necesidades.
          </p>
        </div>
        <div className="flex flex-col space-y-8 md:m-auto md:space-x-5 xl:space-x-20 md:grid md:grid-cols-2 sm:gap-6 xl:gap-6 lg:gap-6 md:space-y-0 xl:grid-cols-2 ">
          {data.map((tarifa: any) => (
            <div
              key={tarifa.id}
              className="flex flex-col h-full  p-6 mx-auto  text-center text-gray-900 bg-[#1A1A1A] rounded-lg border border-gray-600 xl:max-w-[400px] lg:max-w-[400px] max-w-[400px]"
            >
              <div className="flex flex-col">
                <h3 className="mb-4 text-2xl font-semibold text-white">
                  {tarifa.nombre}
                </h3>
                <p className="font-light text-white sm:text-lg sm:min-h-[110px]  ">
                  {tarifa.descripcion}
                </p>
              </div>

              <div className="flex justify-center items-center mt-6 ">
                <span className="mr-2 text-5xl font-extrabold text-[#f35a30]">
                  {tarifa.precioMensual}€
                </span>
                <span className="text-white">/mes</span>
              </div>

              <ul
                role="list"
                className="mb-8 space-y-4 text-left text-white mt-10  sm:min-h-[300px] lg:min-h-[300spx] xl:min-h-[250px]"
              >
                {tarifa.incluye.split(",").map((item: any, index: any) => (
                  <li key={index} className="flex items-center space-x-3 ">
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-[#f35a30]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>{item}.</span>
                  </li>
                ))}
                {tarifa.accesoZonas
                  .split(",")
                  .filter((item: any) => item.toLowerCase() !== "no")
                  .map((item: any, index: any) => (
                    <li key={index} className="flex items-center space-x-3 ">
                      <svg
                        className="flex-shrink-0 w-5 h-5 text-[#f35a30]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span>{item}.</span>
                    </li>
                  ))}
              </ul>
              <div className="">
                <input
                  id={`radio-${tarifa.id}`}
                  type="radio"
                  name="default-radio"
                  value={tarifa.id}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500  focus:ring-2"
                  checked={selectedPlan === tarifa.id}
                  onChange={() => setSelectedPlan(tarifa.id)}
                />
                <label
                  htmlFor={`radio-${tarifa.id}`}
                  className="ms-2 text-sm font-medium text-white "
                >
                  Elige este plan
                </label>
              </div>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-[#f35a30] text-white p-2 rounded-md border-none w-max self-center md:self-start mt-10 m-auto"
          onClick={onSubmit}
        >
          Cambiar plan
        </button>
      </div>
    </section>
  );
};
