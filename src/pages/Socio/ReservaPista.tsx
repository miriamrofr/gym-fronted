import { Outlet } from "react-router-dom";
import MenuReserva from "../../components/MenuReserva";

export const ReservaPista = () => {
  return (
    <div className="bg-[#0A0A0A] p-4 rounded-md m-4 flex flex-col">
      <MenuReserva />

      <div className="mt-5 flex-1S">
        <Outlet />
      </div>
    </div>
  );
};
