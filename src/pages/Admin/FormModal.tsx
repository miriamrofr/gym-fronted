import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import {
  faEye,
  faPenSquare,
  faPlus,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { SocioForm } from "../../components/Form/SocioForm";
import { EntrenadorForm } from "../../components/Form/EntrenadorForm";

export const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table: "socios" | "entrenadores";
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
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);
  const onSubmit = async (e: React.FormEvent) => {
    try {
      let url = `https://localhost:7245/api/${table}/${id}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el socio");
      }
      setIsSuccess(true);
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Ocurrió un error al enviar los datos");
    }
  };
  const Form = () => {
    const FormComponent = table === "socios" ? SocioForm : EntrenadorForm;
    return type === "eliminar" ? (
      <form onSubmit={onSubmit} className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          ¿Seguro que quieres eliminar este {table}?
        </span>
        <button
          type="submit"
          className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
        >
          Eliminar
        </button>
      </form>
    ) : type === "ver" ? (
      <FormComponent type="ver" data={data} />
    ) : type === "modificar" ? (
      <FormComponent type="modificar" data={data} />
    ) : (
      <FormComponent type="crear" />
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
