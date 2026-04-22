import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Navigation } from "../components/navigation";
import { LanguageProvider } from "../contexts/language-context";
import Cookies from "js-cookie";
import { toast, Toaster } from "sonner";

export function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = () => {
      const savedProfile = Cookies.get("userProfile");
      
      // Public routes that don't need auth
      const publicRoutes = ["/", "/signin", "/signup"];
      const isPublicRoute = publicRoutes.includes(location.pathname);

      if (!savedProfile && !isPublicRoute) {
        navigate("/signin");
        return;
      }

      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          const now = new Date().getTime();
          const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in ms

          if (profile.loginAt && now - profile.loginAt > sessionDuration) {
            // Session expired
            Cookies.remove("userProfile");
            toast.error("Session expired. Please sign in again.");
            navigate("/signin");
          }
        } catch (e) {
          Cookies.remove("userProfile");
        }
      }
    };

    checkSession();
  }, [location.pathname, navigate]);

  // Hide global navigation for chat and dashboard as they have their own sidebar/nav
  const hideNavigation = ["/chat", "/dashboard"].includes(location.pathname);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#fcfdfe] selection:bg-blue-100 selection:text-blue-900">
        <Toaster position="top-center" richColors />
        {!hideNavigation && <Navigation />}
        <main className="relative">
          <Outlet />
        </main>
      </div>
    </LanguageProvider>
  );
}