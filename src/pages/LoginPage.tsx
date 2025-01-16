import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "../context/UseAuth";

export const LoginPage = () => {
  const authContext = useAuth(); // Accede al contexto
  const { loginUser } = authContext ?? {};
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Introduce un correo electrónico." })
      .email("Correo electrónico no válido."),

    password: z.string().min(1, { message: "Introduce la contraseña." }),
  });

  type FormValues = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (dataForm: FormValues) => {
    if (loginUser) {
      loginUser(dataForm.email, dataForm.password);
    }
  };
  return (
    <div className=" h-screen flex bg-[url('/gym.jpg')] bg-cover bg-center items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto ">
        <div className="bg-[#0A0A0A] rounded-lg overflow-hidden shadow-2xl opacity-95">
          <h1 className="text-4xl text-center font-thin mt-12">
            Inicio de sesión
          </h1>
          <div className="p-8">
            <form className="" onSubmit={handleSubmit(onSubmit)}>
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

              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-[#fff]">
                  Contraseña
                </label>

                <input
                  type="password"
                  className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none text-[#000]"
                  {...register("password")}
                />
                {errors.password?.message && (
                  <p className="text-xs text-red-400">
                    {errors.password.message.toString()}
                  </p>
                )}
                <a href="/forgot-password" className="text-[#fff] text-xs">
                  ¿Olvidaste la contraseña?
                </a>
              </div>

              <button className="w-full p-3 mt-4 bg-[#f35a30] text-white rounded">
                Iniciar sesión
              </button>
            </form>
            <div className="flex  p-8 text-sm justify-center space-x-2">
              <a className="text-xs">¿No tienes cuenta?</a>
              <a
                href="create-account"
                className="text-xs font-medium text-[#f35a30]"
              >
                Crear cuenta
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
