import { NavLink } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className=" bottom-0 left-0 z-20 w-full p-4 bg-black border-t border-[#f35a30] shadow-sm md:flex md:items-center md:justify-between md:p-6">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © 2025{" "}
        <a href="/" className="hover:underline">
          AceFit
        </a>
        . All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
          <NavLink to="/" className="hover:underline me-4 md:me-6">
            Políticas de cookies
          </NavLink>
        </li>
        <li>
          <NavLink to="/" className="hover:underline me-4 md:me-6">
            Terminos y condiciones
          </NavLink>
        </li>
      </ul>
    </footer>
  );
};
