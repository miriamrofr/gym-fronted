import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenSquare,
  faPlus,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { SocioForm } from "../../components/Form/SocioForm";

export const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table: "socio" | "entrenador";
  type: "ver" | "crear" | "eliminar" | "modificar";
  data?: any;
  id?: number;
}) => {
  const size = type === "crear" ? "w-8 h-8" : "w-7 h-7";
  const bgColor = "bg-[#f35a30]";
  // Mapeo para seleccionar el ícono adecuado
  const iconMap: Record<string, any> = {
    crear: faPlus,
    ver: faEye,
    eliminar: faTrashCan,
    modificar: faPenSquare,
  };

  const [open, setOpen] = useState(false);

  const Form = () => {
    return type === "eliminar" ? (
      <form action="" className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          ¿Seguro que quieres eliminar este {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Eliminar
        </button>
      </form>
    ) : type === "ver" ? (
      <SocioForm type="ver" data={data} />
    ) : type === "modificar" ? (
      <SocioForm type="modificar" data={data} />
    ) : (
      <SocioForm type="crear" />
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon icon={iconMap[type]} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-[#1A1A1A] p-4 rounded-md relative max-w-[90%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] 2xl:max-w-[40%] w-full max-h-[90%] overflow-y-auto">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
