import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ArrowLeftOnRectangleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const { user, logout } = useAuth();
  const name = user?.user?.name || "User";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
      {/* desktop welcome */}
      <div className="hidden md:block">
        <p className="text-xs font-medium text-gray-400">Welcome back</p>
        <p className="text-lg font-extrabold leading-tight tracking-tight text-gray-900">
          <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
            {name}
          </span>{" "}
          👋
        </p>
      </div>

      {/* mobile logo */}
      <Link to="/dashboard" className="flex items-center gap-2 md:hidden">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/30">
          <SparklesIcon className="h-4 w-4" />
        </span>
        <span className="text-lg font-extrabold tracking-tight text-indigo-600">
          ColdMail.AI
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {/* user chip */}
        <div className="hidden items-center gap-2.5 rounded-full border border-gray-100 bg-white py-1 pl-1 pr-4 shadow-sm sm:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white">
            {initial}
          </span>
          <span className="max-w-[10rem] truncate text-sm font-semibold text-gray-700">
            {name}
          </span>
        </div>

        <button
          onClick={logout}
          className="group flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;