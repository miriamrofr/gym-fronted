import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUser,
  faUserTie,
  faRightFromBracket,
  faDumbbell,
  faCalendar,
  faInfoCircle,
  faTableTennisPaddleBall,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Gestión",
    items: [
      {
        icon: <FontAwesomeIcon icon={faInfoCircle} />, // Aquí usas el componente FontAwesomeIcon
        label: "Info gimnasio",
        href: "/info-gimnasio",
      },
      {
        icon: <FontAwesomeIcon icon={faUsers} />, // Aquí usas el componente FontAwesomeIcon
        label: "Socios",
        href: "/socios",
      },
      {
        icon: <FontAwesomeIcon icon={faUserTie} />, // Aquí usas el componente FontAwesomeIcon
        label: "Empleados",
        href: "/empleados",
      },
      {
        icon: <FontAwesomeIcon icon={faCartShopping} />, // Aquí usas el componente FontAwesomeIcon
        label: "Material gimnasio",
        href: "/materiales",
      },
      {
        icon: <FontAwesomeIcon icon={faCalendar} />, // Aquí usas el componente FontAwesomeIcon
        label: "Clases guiadas",
        href: "/clases-guiadas",
      },
      {
        icon: <FontAwesomeIcon icon={faTableTennisPaddleBall} />, // Aquí usas el componente FontAwesomeIcon
        label: "Reserva pistas",
        href: "/reserva-pistas",
      },
      {
        icon: <FontAwesomeIcon icon={faDumbbell} />, // Aquí usas el componente FontAwesomeIcon
        label: "Entrenamientos",
        href: "/entrenamientos",
      },
    ],
  },
  {
    title: "Cuenta",
    items: [
      {
        icon: <FontAwesomeIcon icon={faUser} />, // Aquí usas el componente FontAwesomeIcon
        label: "Perfil",
        href: "/perfil",
      },
      {
        icon: <FontAwesomeIcon icon={faRightFromBracket} />, // Aquí usas el componente FontAwesomeIcon
        label: "Cerrar sesión",
        href: "/logout",
      },
    ],
  },
];

const MenuAdmin = () => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className=" flex-grow mt-6">
        {menuItems
          .filter((section) => section.title !== "Cuenta")
          .map((i) => (
            <div className="flex flex-col gap-2 " key={i.title}>
              <span className="hidden lg:block">{i.title}</span>
              {i.items.map((items) => (
                <NavLink
                  to={items.href}
                  key={items.label}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 md:justify-start justify-center rounded transition ease-in-out ${
                      isActive ? "bg-[#1A1A1A]" : "hover:bg-[#1A1A1A]"
                    }`
                  }
                >
                  <span>{items.icon}</span>
                  <span className="hidden lg:block">{items.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
      </div>
      <div className="mb-0">
        {menuItems
          .filter((section) => section.title == "Cuenta")
          .map((i) => (
            <div className="flex flex-col gap-2" key={i.title}>
              <span className="hidden lg:block">{i.title}</span>
              {i.items.map((items) => (
                <NavLink
                  to={items.href}
                  key={items.label}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 md:justify-start justify-center rounded transition ease-in-out ${
                      isActive ? " bg-[#1A1A1A] " : "hover:bg-[#1A1A1A]"
                    }`
                  }
                >
                  {/* Renderizamos el icono FontAwesome */}
                  <span>{items.icon}</span>
                  <span className="hidden lg:block">{items.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};
export default MenuAdmin;
