import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as z from "zod";
import { toast } from "react-toastify";

export const SendEmail = ({ accion }: { accion: string }) => {
  const resetSchema = z.object({
    email: z.string().email({ message: "Correo electrónico inválido" }),
  });

  type FormValues = z.infer<typeof resetSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (dataForm: FormValues) => {
    const apiData = {
      email: dataForm.email,
    };

    var url;

    if (accion === "create") {
      url = "https://localhost:7245/api/account/verify-email";
    } else {
      url = "https://localhost:7245/api/account/forgot-password";
    }
    var response;
    try {
      response = await fetch(url, {
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
  };

  return (
    <div className=" h-screen flex bg-[url('/gym.jpg')] bg-cover bg-center items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto ">
        <div className="bg-[#0A0A0A] rounded-lg overflow-hidden shadow-2xl opacity-95">
          <h1 className="text-4xl text-center font-thin mt-12">
            {accion === "create"
              ? "Registrar cuenta"
              : "Restablecer contraseña"}
          </h1>

          <div className="p-8">
            <p className="text-sm font-medium">
              Introduce tu dirección de correo electrónico
              {accion === "create"
                ? " para crear una nueva contraseña."
                : " para poder restablecer la contraseña. "}
            </p>
            <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-[#fff]">
                  Correo electrónico
                </label>

                <input
                  type="email"
                  className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none text-[#000]"
                  {...register("email")}
                />

                {errors.email && (
                  <p className="text-xs text-red-400">
                    {errors.email.message?.toString()}
                  </p>
                )}
              </div>

              <button className="w-full p-3 mt-4 bg-[#f35a30] text-white rounded">
                Confirmar
              </button>
              <div className="mt-4 flex justify-center">
                <Link
                  to="/login"
                  className="underline text-[#f35a30] text-sm font-medium"
                >
                  Volver
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
