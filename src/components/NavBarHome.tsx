import { useState } from "react";
import { NavLink } from "react-router-dom";

export const NavBarHome = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-black w-full z-20 top-0 start-0 fixed">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="logo2.png" className="h-8" alt="Flowbite Logo" />
          <p className="self-center text-2xl font-semibold whitespace-nowrap text-[#f35a30]">
            Ace<span className="text-white">Fit</span>
          </p>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-3 rtl:space-x-reverse">
          <NavLink
            to="/login"
            className="text-white bg-[#f35a30] hover:bg-[#e96d4a] font-medium rounded-lg text-sm px-4 py-2 text-center"
          >
            Inicar Sesión
          </NavLink>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-sticky"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Abrir menú</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`w-full md:flex md:w-auto md:order-1 ${
            menuOpen ? "block" : "hidden"
          }`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <button
                onClick={() => {
                  const preciosSection = document.getElementById("/");
                  if (preciosSection) {
                    preciosSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="block py-2 px-3 rounded-sm md:p-0 text-white hover:text-[#f35a30]"
              >
                Inicio
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  const preciosSection = document.getElementById("precios");
                  if (preciosSection) {
                    preciosSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="block py-2 px-3 rounded-sm md:p-0 text-white hover:text-[#f35a30]"
              >
                Precios
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
