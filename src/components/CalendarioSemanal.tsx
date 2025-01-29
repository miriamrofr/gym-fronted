import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/UseAuth";

const CalendarioSemanal = ({ onDatosClases, isSuccess }: any) => {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [semanaArray, setSemanaArray] = useState<Date[]>([]);
  const [isNextWeek, setIsNextWeek] = useState(false);
  const { user } = useAuth() ?? {};

  useEffect(() => {
    getClases(selectedDay);
  }, [isSuccess]);

  const getCurrentDate = () => {
    let currentDate = new Date();
    setSelectedDay(currentDate);

    if (isNextWeek) {
      var lunesProxSemana = new Date();
      lunesProxSemana.setDate(
        lunesProxSemana.getDate() +
          ((1 + 7 - lunesProxSemana.getDay()) % 7 || 7)
      );

      currentDate = lunesProxSemana;
      setSelectedDay(currentDate);
    }

    var semana: Date[] = [];

    for (let i = 0; i < 7; i++) {
      semana[i] = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - ((currentDate.getDay() + 6) % 7) + i
      );
    }
    setSemanaArray(semana);
  };

  useEffect(() => {
    getCurrentDate();
    getClases(selectedDay);
  }, [isNextWeek]);

  const goToNextWeek = () => {
    setIsNextWeek(true);
  };

  const goToCurrentWeek = () => {
    setIsNextWeek(false);
  };

  useEffect(() => {
    getCurrentDate();
    getClases(new Date());
  }, []);

  const getClases = async (dia: Date) => {
    let fechaISO = dia.toLocaleDateString("en-CA");
    setSelectedDay(dia);
    try {
      var url = `https://localhost:7245/api/actividad/buscar-por-dia?value=${fechaISO}&idSocio=${user?.id}`;

      // Hacer la llamada a la API con el body y headers
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error en la API");
      }

      const data = await response.json();
      onDatosClases(data);
    } catch (error) {
      toast.error("Error al buscar clases colectivas.");
    }
  };

  return (
    <div className="flex md:justify-center items-center">
      <FontAwesomeIcon
        onClick={goToCurrentWeek}
        icon={faAngleLeft}
        className={`mx-2 md:mx-4 cursor-pointer ${
          isNextWeek ? "text-white" : "cursor-not-allowed opacity-50"
        }`}
      />
      <div className="flex shadow-md rounded-lg overflow-x-auto mx-auto py-4 px-2  md:mx-12">
        {semanaArray.map((dia, index) =>
          selectedDay.getDate() !== dia.getDate() ? (
            <div
              key={index}
              onClick={() => getClases(dia)}
              className="flex group hover:bg-[#2e2e2e] hover:shadow-lg hover-light-shadow rounded-lg mx-1 transition-all	duration-300	 cursor-pointer justify-center w-16"
            >
              <div className="flex items-center px-4 py-4">
                <div className="text-center">
                  <p className="text-white  text-sm transition-all	duration-300">
                    {dia.toLocaleDateString("es-ES", { weekday: "short" })}
                  </p>
                  <p className="text-white  mt-3 group-hover:font-bold transition-all	duration-300">
                    {dia.getDate()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              key={index}
              onClick={() => getClases(dia)}
              className="flex group bg-[#1a1a1a] shadow-lg light-shadow rounded-lg mx-1 cursor-pointer justify-center relative w-16 content-center"
            >
              <span className="flex h-3 w-3 absolute -top-1 -right-1">
                <span className="animate-ping absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-[#f35a30] "></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f35a30]"></span>
              </span>
              <div className="flex items-center px-4 py-4">
                <div className="text-center">
                  <p className="text-white text-sm">
                    {" "}
                    {dia.toLocaleDateString("es-ES", {
                      weekday: "short",
                    })}{" "}
                  </p>
                  <p className="text-white  mt-3 font-bold">
                    {" "}
                    {dia.getDate()}{" "}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
      <FontAwesomeIcon
        onClick={goToNextWeek}
        icon={faAngleRight}
        className={`mx-2 md:mx-4 cursor-pointer ${
          !isNextWeek ? "text-white" : "cursor-not-allowed opacity-50"
        }`}
      />
    </div>
  );
};
export default CalendarioSemanal;
