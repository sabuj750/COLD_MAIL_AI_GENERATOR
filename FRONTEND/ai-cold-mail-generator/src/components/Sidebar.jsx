import { NavLink, Link } from "react-router-dom";
import { HomeIcon, SparklesIcon } from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: HomeIcon },
  // add more links here, e.g. { to: "/history", label: "History", icon: ClockIcon }
];

const Sidebar = () => {
  return (
    <aside className="relative hidden w-64 shrink-0 flex-col overflow-hidden border-r border-gray-100 bg-white md:flex">
      {/* soft glow */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-blue-200/50 to-fuchsia-200/50 blur-3xl" />

      {/* logo */}
      <div className="relative flex h-16 items-center border-b border-gray-100 px-6">
        <div className="flex items-center gap-2.5">
          <Link to="/dashboard">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              <SparklesIcon className="h-5 w-5" />
            </span>
          </Link>
          <Link to="/" className="text-xl font-extrabold tracking-tight text-indigo-600">
            ColdMail.AI
          </Link>
        </div>
      </div>

      {/* nav */}
      <nav className="relative flex-1 space-y-1.5 px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Menu
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-50 to-fuchsia-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/30"
                      : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-indigo-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* footer card */}
      <div className="relative p-4">
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-blue-50 via-white to-fuchsia-50 p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-fuchsia-500 shadow-sm ring-1 ring-fuchsia-100">
            <SparklesIcon className="h-4 w-4" />
          </div>
          <p className="text-sm font-bold text-gray-900">AI-powered outreach</p>
          <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
            Email, follow-up and LinkedIn DM, all in one go.
          </p>
        </div>
        <p className="mt-3 text-center text-[11px] text-gray-400">
          Built by sabuj
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;