import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation } from "react-router-dom";
import ErrorFallback from "./ErrorFallback";
import { Suspense } from "react";
// Returns the Tailwind classes for a nav link, depending on whether it's the current page
function navClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
    : "rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900";
}

function AppLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
const location = useLocation();
  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="text-lg font-semibold text-slate-900">Buy or Wait</span>
            <nav className="flex gap-1">
              <NavLink to="/finances" className={navClass}>
                Finances
              </NavLink>
              <NavLink to="/buy-or-wait" className={navClass}>
                Buy or wait?
              </NavLink>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Log out
          </button>
        </div>
      </header>

     <main className="mx-auto max-w-5xl px-4 py-8">
  <ErrorBoundary
  FallbackComponent={ErrorFallback}
  resetKeys={[location.pathname]}
  onError={(error) => console.error("Page crashed:", error)}
>
  <Suspense fallback={<p className="text-sm text-slate-500">Loading page...</p>}>
    <Outlet />
  </Suspense>
</ErrorBoundary>

      </main>
    </div>
  );
}

export default AppLayout;