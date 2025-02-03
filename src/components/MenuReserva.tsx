import { NavLink } from "react-router-dom";

const menuItems = [
  {
    items: [
      {
        label: "Hacer reserva",
        href: "/socio/reserva-pistas/reservar",
      },
      {
        label: "Ver mis reservas",
        href: "/socio/reserva-pistas/ver-reservas",
      },
    ],
  },
];

const MenuReserva = () => {
  return (
    <div className="mt-6">
      <div className="flex flex-row gap-4">
        {menuItems[0].items.map((item) => (
          <NavLink
            to={item.href}
            key={item.label}
            className={({ isActive }) =>
              `px-4 py-2 text-white font-semibold rounded transition duration-300 text-sm ${
                isActive ? "bg-[#f35a30]" : "bg-[#1A1A1A] hover:bg-gray-700"
              }`
            }
          >
            {item.label} {/* Aquí mostramos el texto del enlace */}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MenuReserva;
