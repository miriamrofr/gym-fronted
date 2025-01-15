import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";

type UserContextType = {
  token: string | null;
  loginUser: (username: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  user: { id: number; rol: string } | null; // Nuevo estado para el usuario
};

type Props = { children: React.ReactNode };

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<{ id: number; rol: string } | null>(null); // Nuevo estado

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setToken(token);
      setUser(JSON.parse(user));
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setIsReady(true);
  }, []);

  const loginUser = async (email: string, password: string) => {
    const loginData = {
      email: email,
      password: password,
    };

    const response = await fetch("https://localhost:7245/api/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    if (!response.ok) {
      toast.error("Correo electrónico y/o contraseña incorrecta");
      throw new Error("Invalid credentials or server error");
    }
    const data = await response.json();
    const { token, id, rol } = data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ id, rol }));
    setToken(token);
    setUser({ id, rol });

    if (rol === "Socio") navigate("/socio");
    else if (rol === "Admin") {
      navigate("/admin");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setToken("");
    setUser(null); // Limpia el estado del usuario
    navigate("/login");
  };

  const isLoggedIn = () => {
    return !!token;
  };

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
