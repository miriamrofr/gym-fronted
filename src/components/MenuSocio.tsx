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
import { useAuth } from "../context/UseAuth";

const menuItems = [
  {
    title: "Gestión",
    items: [
      {
        icon: <FontAwesomeIcon icon={faUser} />, // Aquí usas el componente FontAwesomeIcon
        label: "Perfil",
        href: "/socio/perfil",
      },
      {
        icon: <FontAwesomeIcon icon={faCartShopping} />, // Aquí usas el componente FontAwesomeIcon
        label: "Inscripción",
        href: "/socio/inscripcion",
      },
      {
        icon: <FontAwesomeIcon icon={faCalendar} />, // Aquí usas el componente FontAwesomeIcon
        label: "Reserva clases",
        href: "/socio/reserva-clases",
      },
      {
        icon: <FontAwesomeIcon icon={faTableTennisPaddleBall} />, // Aquí usas el componente FontAwesomeIcon
        label: "Reserva pistas",
        href: "/socio/reserva-pistas",
      },
      {
        icon: <FontAwesomeIcon icon={faRightFromBracket} />, // Aquí usas el componente FontAwesomeIcon
        label: "Cerrar sesión",
        href: "/",
        onClick: true,
      },
    ],
  },
];

const MenuSocio = () => {
  const authContext = useAuth(); // Accede al contexto
  const { logout } = authContext ?? {};

  return (
    <div className="h-screen flex flex-col justify-between">
      <div className=" flex-grow mt-6">
        {menuItems
          .filter((section) => section.title !== "Cuenta")
          .map((i) => (
            <div className="flex flex-col gap-2 " key={i.title}>
              <span className="hidden lg:block">{i.title}</span>
              {i.items.map((items) => (
                <NavLink
                  to={items.href}
                  onClick={(e) => {
                    if (items.onClick && logout) {
                      e.preventDefault(); // Evita navegación
                      logout(); // Llama a la función logout
                    }
                  }}
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
    </div>
  );
};
export default MenuSocio;
