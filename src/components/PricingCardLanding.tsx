export const PricingCardLanding = ({ data }: any) => {
  return (
    <section>
      <div className="bg-black flex flex-col pt-10">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-[#f35a30]">
            NUESTRAS SUSCRIPCIONES
          </h2>
          <p className="mb-5 font-light text-white sm:text-xl">
            Elige el plan que más te convenga y comienza a entrenar con
            nosotros. Te esperamos con los brazos abiertos para ayudarte a
            alcanzar tus metas.
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
                <a
                  href="/signup"
                  className="bg-[#f35a30] text-white p-2 rounded-md border-none w-max self-center md:self-start mt-10 m-auto"
                >
                  Quiero este plan
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
