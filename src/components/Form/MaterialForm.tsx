import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputField } from "../InputField";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const MaterialForm = ({
  type,
  data,
}: {
  type: "ver" | "crear" | "modificar";
  data?: any;
}) => {
  const isDisabled = type === "ver";
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string>(
    data?.img ? `https://localhost:7245${data.img}` : ""
  );

  console.log(isDisabled);
  const schema = z.object({
    nombre: z
      .string()
      .min(3, { message: "El nombre debe de tener como mínimo 3 carácteres" })
      .max(50, {
        message: "El nombre debe de tener como máximo 50 carácteres",
      }),
    descripcion: z
      .string()
      .min(3, {
        message: "La descripcion debe de tener como mínimo 3 carácteres",
      })
      .max(100, {
        message: "La descripcion debe de tener como máximo 100 carácteres",
      }),
    cantidad: z.string().min(1, { message: "Introduce una cantidad" }),

    categoria: z
      .string()
      .min(3, {
        message: "La categoria debe de tener como mínimo 3 carácteres",
      })
      .max(50, {
        message: "La categoria debe de tener como máximo 50 carácteres",
      }),
    precio: z.string().min(1, { message: "Introduce el precio" }),
    fechaAdquisicion: z.preprocess((val) => {
      if (typeof val === "string" && val.trim() !== "") {
        const parsedDate = new Date(val);
        return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
      }
      return undefined;
    }, z.date({ message: "Introduce fecha válida" })),
  });

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    setSelectedFile(file);

    // Generar URL para previsualización
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) setPreviewURL(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    console.log("aaaa");
    setSelectedFile(null);
    setPreviewURL("");
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Permite el drop
  };

  const onSubmit = handleSubmit(async (formData) => {
    const apiData = new FormData();
    apiData.append("Nombre", formData.nombre);
    apiData.append("Descripcion", formData.descripcion);
    apiData.append("Cantidad", formData.cantidad);
    apiData.append("Categoria", formData.categoria);
    apiData.append("FechaAdquisicion", formData.fechaAdquisicion.toISOString());
    apiData.append("Precio", formData.precio);
    if (selectedFile) {
      apiData.append("Imagen", selectedFile);
    }

    console.log(apiData);
    console.log(formData);
    try {
      var url;
      var method;

      if (type === "modificar") {
        url = `https://localhost:7245/api/material/${data.id}`;
        method = "PUT";
      } else {
        url = `https://localhost:7245/api/material/1`;
        method = "POST";
      }
      // Hacer la llamada a la API con el body y headers
      const response = await fetch(url, {
        method: method, // O "PUT" si es para actualizar
        body: apiData,
      });

      if (!response.ok) {
        throw new Error("Error en la API");
      }
      setIsSuccess(true);
    } catch (error) {
      toast.error("Ocurrió un error al enviar los datos");
    }
  });
  console.log("aa");
  console.log(previewURL);
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "crear"
          ? "Registrar nuevo material"
          : type === "modificar"
          ? "Modificar material"
          : "Ver material"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">DATOS</span>
      <div className=" flex justify-between flex-wrap gap-2">
        <InputField
          label="Nombre"
          name="nombre"
          register={register}
          disabled={type === "ver"}
          defaultValue={data?.nombre}
          error={errors.nombre}
        />
        <InputField
          label="Descripción"
          name="descripcion"
          defaultValue={data?.descripcion}
          register={register}
          disabled={type === "ver"}
          error={errors.descripcion}
        />

        <InputField
          label="Cantidad"
          name="cantidad"
          defaultValue={data?.cantidad}
          register={register}
          disabled={type === "ver"}
          error={errors.cantidad}
        />
        <InputField
          label="Categoria "
          name="categoria"
          register={register}
          disabled={type === "ver"}
          defaultValue={data?.categoria}
          error={errors.categoria}
        />
        <InputField
          label="Fecha de Adquisicion "
          name="fechaAdquisicion"
          register={register}
          disabled={type === "ver"}
          defaultValue={
            data?.fechaAdquisicion
              ? new Date(data?.fechaAdquisicion).toLocaleDateString("en-CA")
              : ""
          } // Convierte la fecha a formato YYYY-MM-DD
          type="date"
          error={errors.fechaAdquisicion}
        />
        <InputField
          label="Precio "
          name="precio"
          defaultValue={data?.precio}
          disabled={type === "ver"}
          register={register}
          error={errors.precio}
        />
      </div>
      <div className="upload-container relative flex items-center justify-between w-full">
        <div
          className={`drop-area w-full rounded-md border-2 border-dotted transition-all hover:border-blue-600/30
           text-center ${isDisabled && !data.img ? "hidden" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <>
            <label
              htmlFor="file-input"
              className={`block w-full h-full text-white p-4 text-sm ${
                !isDisabled ? "cursor-pointer" : ""
              } `}
            >
              {isDisabled
                ? "Vista previa"
                : "Selecciona o arrastra aquí la imagen a subir"}
            </label>
            <input
              name="file"
              type="file"
              id="file-input"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
              disabled={type === "ver"}
            />
          </>

          <div className="preview-container flex items-center justify-center flex-col">
            {/* Previsualización de la imagen */}
            {previewURL && (
              <>
                <div
                  className="preview-image w-36 h-36 bg-cover bg-center rounded-md"
                  style={{
                    backgroundImage: `url(${previewURL})`,
                  }}
                ></div>
                <span className="file-name my-4 text-sm font-medium">
                  {selectedFile?.name || "Imagen actual"}
                </span>
                <p
                  className={`close-button cursor-pointer transition-all mb-4 rounded-md px-3 py-1 border text-xs text-red-500 border-red-500 hover:bg-red-500 hover:text-white ${
                    isDisabled ? "hidden" : ""
                  }`}
                  onClick={handleRemoveFile}
                >
                  Borrar
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      {type !== "ver" && (
        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded-md border-none w-max self-center`}
        >
          {type === "crear" ? "Registrar" : "Modificar"}
        </button>
      )}
    </form>
  );
};
