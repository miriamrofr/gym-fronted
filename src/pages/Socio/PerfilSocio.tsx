import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/UseAuth";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const PerfilSocio = () => {
  const [imageProfile, setImageProfile] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useAuth() ?? {};
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modificando, setModificando] = useState(false);
  const [socio, setSocio] = useState<Socio | null>(null);

  type Socio = {
    id: number;
    nombre: string;
    apellidos: string;
    telefono: string;
    calle: string;
    codigoPostal: number;
    localidad: string;
    numero: number;
    provincia: string;
  };

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);

  const adminSchema = z.object({
    nombre: z.string().min(1, {
      message: "Introduce nombre",
    }),
    apellidos: z.string().min(1, {
      message: "Introduce apellidos",
    }),
    telefono: z.string().min(1, { message: "Introduce teléfono" }),
    calle: z.string().min(1, { message: "Introduce calle" }),
    localidad: z.string().min(1, { message: "Introduce localidad" }),
    provincia: z.string().min(1, { message: "Introduce provincia" }),
    codigoPostal: z
      .number()
      .min(1, { message: "Introduce un código de postal válido" })
      .max(99999, { message: "Máximo 5 carácteres" }),
    numero: z.number().min(1, { message: "Introduce un número válido" }),
  });

  const emailSchema = z.object({
    email: z.string().email({ message: "Introduce un correo válido" }),
  });

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const {
    register,
    setValue,
    handleSubmit,
    clearErrors,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminSchema),
  });

  const handleModificar = () => {
    setModificando(true);
  };

  const handleCancelar = () => {
    setModificando(false);
    setInfoValue();
    clearErrors();
  };

  const getImageProfile = async () => {
    try {
      // Construir la URL con la búsqueda y paginación
      let url = `https://localhost:7245/api/socios/upload-image?idSocio=${user?.id}`;

      const response = await fetch(url);
      // URL de la API
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();

      if (data.imagenUrl != null) {
        let urlImg = `https://localhost:7245${data.imagenUrl}`;
        setImageProfile(urlImg);
      }
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  const setInfoValue = () => {
    if (socio !== null) {
      setValue("nombre", socio.nombre);
      setValue("apellidos", socio.apellidos);
      setValue("telefono", socio.telefono);
      setValue("calle", socio.calle);
      setValue("numero", socio.numero);
      setValue("provincia", socio.provincia);
      setValue("localidad", socio.localidad);
      setValue("codigoPostal", socio.codigoPostal);
    }
  };

  const handleAceptar = handleSubmit(async (formData: any) => {
    const apiData = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      calle: formData.calle,
      codigoPostal: formData.codigoPostal,
      numero: formData.numero,
      telefono: formData.telefono,
      provincia: formData.provincia,
      localidad: formData.localidad,
    };

    try {
      var url;

      url = `https://localhost:7245/api/socios/update-profile?id=${user?.id}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer <TOKEN>", // Si necesitas incluir un token
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error("Error en la API");
      }

      setIsSuccess(true);
    } catch (error) {
      toast.error("Ocurrió un error al enviar los datos");
    }
  });

  const getInfoSocio = async () => {
    try {
      // Construir la URL con la búsqueda y paginación
      let url = `https://localhost:7245/api/socios/${user?.id}`;

      const response = await fetch(url);
      // URL de la API
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();

      const transformedData = {
        id: data.id,
        nombre: data.nombre,
        apellidos: data.apellidos,
        telefono: data.telefono,
        calle: data.calle,
        codigoPostal: data.codigoPostal,
        localidad: data.localidad,
        numero: data.numero,
        provincia: data.provincia,
      };

      setSocio(transformedData);
      setValue("nombre", transformedData.nombre);
      setValue("apellidos", transformedData.apellidos);
      setValue("telefono", transformedData.telefono);
      setValue("calle", transformedData.calle);
      setValue("numero", transformedData.numero);
      setValue("provincia", transformedData.provincia);
      setValue("localidad", transformedData.localidad);
      setValue("codigoPostal", transformedData.codigoPostal);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  useEffect(() => {
    getImageProfile();
    getInfoSocio();
  }, []);

  useEffect(() => {
    handleChangeImage();
  }, [selectedFile]);

  const handleDeleteImage = async () => {
    Swal.fire({
      title: "¿Quieres eliminar tu foto de perfil?",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      color: "#fff",
      background: "#1A1A1A",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let url = `https://localhost:7245/api/socios/upload-image?idSocio=${user?.id}`;
        const response = await fetch(url, {
          method: "DELETE", // O "PUT" si es para actualizar
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        setImageProfile(null);
        getImageProfile();
      }
    });
  };

  const handleEnvioCorreo = handleSubmitEmail(async (formData) => {
    const apiData = {
      email: formData.email,
    };

    var url = "https://localhost:7245/api/account/forgot-password";

    try {
      const response = await fetch(url, {
        method: "POST", // O "PUT" si es para actualizar
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer <TOKEN>", // Si necesitas incluir un token
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) toast.success("Correo enviado.");
      else {
        const text = await response.text();
        toast.error(text);
      }
    } catch (error) {
      throw new Error("Error");
    }
  });

  const handleClickChangeImage = () => {
    fileInputRef.current?.click();
  };

  const handleChangeImage = async () => {
    if (!selectedFile) return;

    const apiData = new FormData();
    apiData.append("Id", user?.id?.toString() || "");
    if (selectedFile) apiData.append("Imagen", selectedFile);

    let url = `https://localhost:7245/api/socios/upload-image?idSocio=${user?.id}`;
    const response = await fetch(url, {
      method: "POST",
      body: apiData,
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    setImageProfile(null);
    getImageProfile();
  };

  return (
    <div className="bg-[#0A0A0A] p-4 rounded-md m-4 flex-1">
      <div className="preview-container flex items-center justify-center flex-col">
        <div className="preview-image">
          <img
            className="w-40 h-40 rounded-full object-cover"
            src={imageProfile ? imageProfile : "/default-user-photo.jpg"}
            alt="user-photo"
          />
        </div>
        <div className="flex flex-row m-auto gap-4 mt-4">
          <button
            type="button"
            className={`bg-gray-600 text-white p-2 rounded-md border-none w-max self-center text-sm min-w-[80px] hover:bg-slate-400`}
            onClick={handleClickChangeImage}
          >
            Cambiar
          </button>

          <input
            className="hidden"
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
              }
            }}
          ></input>

          <button
            type="button"
            className={`bg-gray-600 text-white p-2 rounded-md border-none w-max self-center text-sm min-w-[80px] hover:bg-slate-400`}
            onClick={handleDeleteImage}
          >
            Retirar
          </button>
        </div>
      </div>
      <form className=" w-full flex flex-col mt-10 ">
        <span className="text-md text-gray-400 font-medium text-center m-auto">
          Información personal
        </span>
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 m-auto  max-w-[400px] mt-5">
          <div>
            <label className="text-xs">Nombre</label>
            <input
              {...register("nombre")}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full ${
                modificando
                  ? "bg-white text-black ring-gray-300"
                  : "bg-white text-black ring-gray-300"
              }`}
              disabled={!modificando}
            />
            {errors?.nombre?.message && (
              <p className="text-xs text-red-400">
                {errors.nombre.message.toString()}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs">Apellidos</label>
            <input
              {...register("apellidos")}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full ${
                modificando
                  ? "bg-white text-black ring-gray-300"
                  : "bg-white text-black ring-gray-300"
              }`}
              disabled={!modificando}
            />
            {errors?.apellidos?.message && (
              <p className="text-xs text-red-400">
                {errors?.apellidos?.message.toString()}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs">Teléfono</label>
            <input
              {...register("telefono")}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full ${
                modificando
                  ? "bg-white text-black ring-gray-300"
                  : "bg-white text-black ring-gray-300"
              }`}
              disabled={!modificando}
            />
            {errors?.telefono?.message && (
              <p className="text-xs text-red-400">
                {errors.telefono.message.toString()}
              </p>
            )}
          </div>
        </div>
        <span className="text-md text-gray-400 font-medium text-center m-auto mt-10">
          Domicilio
        </span>
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 m-auto  max-w-[400px] mt-5">
          <div>
            <label className="text-xs">Calle</label>
            <input
              {...register("calle")}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full ${
                modificando
                  ? "bg-white text-black ring-gray-300"
                  : "bg-white text-black ring-gray-300"
              }`}
              disabled={!modificando}
            />
            {errors?.calle?.message && (
              <p className="text-xs text-red-400">
                {errors.calle.message.toString()}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs">Número</label>
            <input
              {...register("numero", { valueAsNumber: true })}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full ${
                modificando
                  ? "bg-white text-black ring-gray-300"
                  : "bg-white text-black ring-gray-300"
              }`}
              disabled={!modificando}
            />
            {errors?.numero?.message && (
              <p className="text-xs text-red-400">
                {errors?.numero?.message.toString()}
              </p>
            )}
          </div>

          <div>
            {" "}
            <label className="text-xs">Localidad</label>
            <input
              {...register("localidad")}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full ${
                modificando
                  ? "bg-white text-black ring-gray-300"
                  : "bg-white text-black ring-gray-300"
              }`}
              disabled={!modificando}
            />
            {errors?.localidad?.message && (
              <p className="text-xs text-red-400">
                {errors?.localidad?.message.toString()}
              </p>
            )}
          </div>

          <div>
            {" "}
            <label className="text-xs">Provincia</label>
            <input
              {...register("provincia")}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full ${
                modificando
                  ? "bg-white text-black ring-gray-300"
                  : "bg-white text-black ring-gray-300"
              }`}
              disabled={!modificando}
            />
            {errors?.provincia?.message && (
              <p className="text-xs text-red-400">
                {errors?.provincia?.message.toString()}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs">Código Postal</label>
            <input
              {...register("codigoPostal", { valueAsNumber: true })}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full ${
                modificando
                  ? "bg-white text-black ring-gray-300"
                  : "bg-white text-black ring-gray-300"
              }`}
              disabled={!modificando}
            />
            {errors?.codigoPostal?.message && (
              <p className="text-xs text-red-400">
                {errors?.codigoPostal?.message.toString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-8 m-auto mt-4">
          {!modificando ? (
            <button
              type="button"
              className="bg-[#f35a30] text-white p-2 mt-2 rounded-md border-none w-max"
              onClick={handleModificar}
            >
              Modificar
            </button>
          ) : (
            <>
              <button
                type="button"
                className="bg-[#f35a30] text-white p-2 mt-2 rounded-md border-none w-max"
                onClick={handleAceptar}
              >
                Aceptar
              </button>
              <button
                type="button"
                className="bg-[#f35a30] text-white p-2 mt-2 rounded-md border-none w-max"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </form>

      <div></div>
      <div className="w-full flex flex-col mt-10">
        <span className="text-md text-gray-400 font-medium text-center m-auto">
          Cambiar contraseña
        </span>
        <p className="text-xs text-white font-medium text-center m-auto mt-3">
          Introduce tu correo electrónico para poder tramitar el cambio de
          contraseña.
        </p>
        {emailErrors?.email?.message && (
          <p className="text-xs text-red-400 m-auto mt-5">
            {emailErrors.email.message.toString()}
          </p>
        )}
        <div className="w-full flex flex-col md:flex-row gap-4 m-auto  max-w-[400px] mt-5 md:space-y-0">
          <input
            type="email"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full max-h-10 "
            {...registerEmail("email")}
          />

          <button
            type="button"
            className="bg-[#f35a30] text-white p-2 mt-2 rounded-md border-none w-max m-auto "
            onClick={handleEnvioCorreo}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
