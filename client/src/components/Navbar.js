import { Link, NavLink, useNavigate } from "react-router-dom";

import Button from "./Button";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 to-sky-400 font-display text-lg font-bold text-slate-950">
            OL
          </div>
          <div>
            <p className="font-display text-lg font-bold text-white">Online Learning Platform</p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Production demo
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {[
            { to: "/", label: "Home" },
            { to: "/dashboard", label: "Dashboard" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 sm:block">
                {user?.name}
              </div>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="secondary">
                Login
              </Button>
              <Button as={Link} to="/register">
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
