import React from "react";
import { Link, Outlet } from "react-router-dom";

export const NavBar = () => {
  return (
    <>
      <header>
        <h1>
          <Link to="/">Logo</Link>
        </h1>
        <nav>
          <Link to="/login">Iniciar sesión</Link>
        </nav>
      </header>
      <Outlet></Outlet>
    </>
  );
};
