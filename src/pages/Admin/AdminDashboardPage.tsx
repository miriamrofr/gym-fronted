import MenuAdmin from "../../components/MenuAdmin";
import { Outlet } from "react-router-dom";

export const AdminDashboardPage = () => {
  return (
    <div className="h-screen flex">
      <div className="flex flex-col h-full w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-[#0A0A0A] p-3 ">
        <div className="flex items-center justify-center space-x-2">
          <img
            src="/logo2.png"
            alt="AceFit Logo"
            className="w-[50px] md:w-[40px] lg:w-[35px] xl:w-[35px] h-auto"
          />
          <span className="hidden lg:block font-bold text-2xl">
            <span className="text-[#f35a30]">Ace</span>
            <span className="text-white">Fit</span>
          </span>
        </div>
        <MenuAdmin />
      </div>

      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#1A1A1A]">
        <Outlet />
      </div>
    </div>
  );
};