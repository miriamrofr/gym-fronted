import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import * as z from "zod";
import { toast } from "react-toastify";

export const ResetCreatePassword = () => {
  const [searchParams] = useSearchParams();
  const [uid, setUid] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const uidParam = searchParams.get("uid");
    const tokenParam = searchParams.get("token");

    setUid(uidParam);
    setToken(tokenParam);
  }, [searchParams]);

  const resetSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
        .regex(/[A-Z]/, {
          message: "Debe incluir al menos una letra mayúscula.",
        })
        .regex(/[0-9]/, { message: "Debe incluir al menos un número." })
        .regex(/[^A-Za-z0-9]/, {
          message: "Debe incluir al menos un carácter especial.",
        }),
      passwordConfirm: z
        .string()
        .min(1, { message: "Introduce la contraseña" }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Las contraseñas no coinciden.",
      path: ["passwordConfirm"],
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
    console.log(useId);
    console.log(token);

    const apiData = {
      ConfirmPassword: dataForm.passwordConfirm,
      password: dataForm.password,
      userId: uid,
      Token: token,
    };
    const url = "https://localhost:7245/api/account/reset-password";

    const response = await fetch(url, {
      method: "POST", // O "PUT" si es para actualizar
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer <TOKEN>", // Si necesitas incluir un token
      },
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      toast.error("Error al cambiar la contraseña, intentelo de nuevo.");
      throw new Error("Error");
    } else {
      toast.success("Contraseña creada correctamente");
    }
  };

  return (
    <div className=" h-screen flex bg-[url('/gym.jpg')] bg-cover bg-center items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto ">
        <div className="bg-[#0A0A0A] rounded-lg overflow-hidden shadow-2xl opacity-95">
          <h1 className="text-4xl text-center font-thin mt-12">
            Restablecer contraseña
          </h1>
          <div className="p-8">
            <form className="" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-[#fff]">
                  Contraseña
                </label>

                <input
                  type="password"
                  className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none text-[#000]"
                  {...register("password")}
                />

                {errors.password && (
                  <p className="text-xs text-red-400">
                    {errors.password.message?.toString()}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-[#fff]">
                  Confirmar contraseña
                </label>

                <input
                  type="password"
                  className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none text-[#000]"
                  {...register("passwordConfirm")}
                />
                {errors.passwordConfirm?.message && (
                  <p className="text-xs text-red-400">
                    {errors.passwordConfirm.message.toString()}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <span className="text-xs">La contraseña debe tener</span>
                <ul className="text-xs mt-2 list-disc ml-6">
                  <li>
                    <span>Al menos 8 carácteres</span>
                  </li>
                  <li>
                    <span>Al menos un número</span>
                  </li>
                  <li>
                    <span>Al menos una letra mayúscula</span>
                  </li>
                  <li>
                    <span>Al menos un carácter especial</span>
                  </li>
                </ul>
              </div>

              <button className="w-full p-3 mt-4 bg-[#f35a30] text-white rounded">
                Confirmar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
