import React from "react";
import MenuSocio from "../../components/MenuSocio";
import { Outlet } from "react-router-dom";

function SocioDashboardPage() {
  return (
    <div className="h-full flex">
      <div className="flex flex-col w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-[#0A0A0A] p-3 ">
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
        <MenuSocio />
      </div>
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#1A1A1A]">
        <Outlet />
      </div>
    </div>
  );
}

export default SocioDashboardPage;
