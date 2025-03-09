import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const SignupForm = () => {
  const [membresia, setMembresia] = useState<Membresia[]>([]);
  const [selectedMembresia, setSelectedMembresia] = useState("");

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

  type Membresia = {
    id: string;
    nombre: string;
    //horarios: Horario[];
  };

  const schema = z.object({
    sexo: z.enum(["hombre", "mujer", "otro"], {
      message: "Selecciona el sexo",
    }),

    dni: z
      .string()
      .min(9, {
        message: "Introduce un DNI válido",
      })
      .max(9, {
        message: "Introduce un DNI válido",
      }),

    email: z.string().email({ message: "Correo electrónico inválido" }),

    membresiaId: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "Selecciona membresia")
    ),
    fechaNacimiento: z.preprocess((val) => {
      if (typeof val === "string" && val.trim() !== "") {
        const parsedDate = new Date(val);
        return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
      }
      return undefined;
    }, z.date({ message: "Introduce fecha de nacimiento válida" })),
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
      .string()
      .min(1, { message: "Introduce un código de postal válido" }) // No permite vacío
      .transform((val) => Number(val)) // Convierte a número
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Introduce un código de postal válido",
      }), // Valida que sea mayor a 0

    numero: z
      .string()
      .min(1, { message: "Introduce un número válido" }) // No permite vacío
      .transform((val) => Number(val)) // Convierte a número
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Introduce un número válido",
      }), // Valida que sea mayor a 0
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    getMembresias();
  }, []);

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
      }));
      setMembresia(mem);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  const recarga = (recarga: any) => {
    if (recarga) {
      window.location.href = "/";
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    const apiData = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      dni: formData.dni,
      sexo: formData.sexo.toLowerCase(),
      correoElectronico: formData.email,
      telefono: formData.telefono,
      calle: formData.calle,
      codigoPostal: parseInt(formData.codigoPostal, 10),
      localidad: formData.localidad,
      provincia: formData.provincia,
      numero: parseInt(formData.numero, 10),
      fechaNacimiento: formData.fechaNacimiento.toISOString(),
      rol: "Socio",
      tarifaId: parseInt(formData.membresiaId),
    };

    try {
      var url = `https://localhost:7245/api/socios/1`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer <TOKEN>",
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        Swal.fire({
          title: "¡Registro completado!",
          html: '¡Tu registro ha sido completado con éxito! <br><br> Para comenzar a disfrutar de nuestros servicios, debes activar tu cuenta registrando tu correo electrónico. <br><br> Haz clic en el siguiente enlace para completar el proceso: <br><br> <a href="http://localhost:5173/create-account" target="_blank" style="color: #f35a30; font-weight: bold;">Crear mi cuenta</a>',
          icon: "success",
          color: "#fff",
          background: "#1A1A1A",
          confirmButtonColor: "#f35a30",
          confirmButtonText: "Volver página principal",
        }).then(async (result) => {
          if (result.isConfirmed) {
            recarga(true);
          }
        });
      } else {
        const text = await response.text();
        Swal.fire({
          title: "Error",
          text: text,
          icon: "error",
          color: "#fff",
          background: "#1A1A1A",
          confirmButtonColor: "#d33",
          confirmButtonText: "Volver",
        });
      }
    } catch (error) {
      throw new Error("Error");
    }
  });
  return (
    <div className="bg-[#0A0A0A] p-4 rounded-md m-4 flex-1">
      <p className="text-center m-auto text-xl mt-10">
        ¡Estás a un paso de transformar tu vida! Completa el formulario y únete
        a nuestra comunidad para alcanzar tus objetivos
      </p>
      <form className=" w-full flex flex-col mt-10 " onSubmit={onSubmit}>
        <span className="text-md text-gray-400 font-medium text-center m-auto">
          Información personal
        </span>
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 m-auto  max-w-[400px] mt-5">
          <div>
            <label className="text-xs">Nombre</label>
            <input
              {...register("nombre")}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full `}
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
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full `}
            />
            {errors?.apellidos?.message && (
              <p className="text-xs text-red-400">
                {errors?.apellidos?.message.toString()}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs">Sexo</label>
            <select
              className={`ring-[1.5px] p-2 bg-white rounded-md text-sm text-black w-full `}
              {...register("sexo")}
              onChange={(e) => {
                // Llamar manualmente al evento onChange para actualizar React Hook Form
                register("sexo").onChange(e);
              }}
            >
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="text-xs">Dni</label>
            <input
              {...register("dni")}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full `}
            />
            {errors?.dni?.message && (
              <p className="text-xs text-red-400">
                {errors.dni.message.toString()}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs">Fecha de nacimiento</label>
            <input
              {...register("fechaNacimiento")}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full `}
              type="date"
            />
            {errors?.fechaNacimiento?.message && (
              <p className="text-xs text-red-400">
                {errors.fechaNacimiento.message.toString()}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs">Membresia</label>
            <select
              className={`ring-[1.5px] p-2 bg-white rounded-md text-sm text-black w-full `}
              {...register("membresiaId")}
              value={selectedMembresia}
              onChange={(e) => {
                setSelectedMembresia(e.target.value);
                register("membresiaId").onChange(e);
              }}
            >
              <option value="" disabled>
                Selecciona membresia
              </option>
              {membresia.map((mem) => (
                <option key={mem.id} value={mem.id}>
                  {mem.nombre}
                </option>
              ))}
            </select>
            {errors.membresiaId?.message && (
              <p className="text-xs text-red-400">
                {errors.membresiaId.message.toString()}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs">Teléfono</label>
            <input
              {...register("telefono")}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full `}
            />
            {errors?.telefono?.message && (
              <p className="text-xs text-red-400">
                {errors.telefono.message.toString()}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs">Correo electrónico</label>
            <input
              {...register("email")}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full `}
            />
            {errors?.email?.message && (
              <p className="text-xs text-red-400">
                {errors.email.message.toString()}
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
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full `}
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
              {...register("numero")}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full `}
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
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full `}
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
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full `}
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
              {...register("codigoPostal")}
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm text-black w-full $`}
            />
            {errors?.codigoPostal?.message && (
              <p className="text-xs text-red-400">
                {errors?.codigoPostal?.message.toString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-8 m-auto mt-11">
          <button
            type="submit"
            className="bg-[#f35a30] text-white p-2 mt-2 rounded-md border-none w-max"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
};
