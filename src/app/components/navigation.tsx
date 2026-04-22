import { Link, useLocation, useNavigate } from "react-router";
import { Sparkles, Menu, Globe, User, X, LogOut, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/language-context";
import Cookies from "js-cookie";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  const savedProfile = Cookies.get("userProfile");
  const isLoggedIn = !!savedProfile;
  const userProfile = savedProfile ? JSON.parse(savedProfile) : null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLanguageMenuOpen(false);
  }, [location.pathname]);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "th", name: "ไทย", flag: "🇹🇭" },
  ];

  const handleLogout = () => {
    Cookies.remove("userProfile");
    navigate("/signin");
  };

  const navLinks = [
    { name: t("home"), path: "/" },
    { name: t("features"), path: "/#features" },
  ];

  if (isLoggedIn) {
    navLinks.push({ name: t("chat"), path: "/chat" });
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "py-3" 
          : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`
          relative transition-all duration-500 rounded-2xl px-6 py-3 flex items-center justify-between
          ${scrolled 
            ? "bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg shadow-gray-200/20" 
            : "bg-white/40 backdrop-blur-md border border-white/40 shadow-sm"}
        `}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0096c7] to-[#00b4d8] flex items-center justify-center shadow-lg shadow-[#0096c7]/20"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-black bg-gradient-to-r from-[#0077b6] to-[#00b4d8] bg-clip-text text-transparent tracking-tight">
              {t("appName")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold transition-all hover:text-[#0096c7] ${
                    location.pathname === link.path ? "text-[#0096c7]" : "text-gray-500"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-black text-gray-500 hover:text-[#0096c7] transition-all rounded-2xl hover:bg-white/50 uppercase tracking-widest"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language}</span>
                </button>
                
                <AnimatePresence>
                  {languageMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-48 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 py-2 overflow-hidden"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as "en" | "th");
                            setLanguageMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold transition-all ${
                            language === lang.code
                              ? "bg-[#0096c7]/10 text-[#0096c7]"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-1.5 pr-5 bg-white/50 border border-white/50 rounded-2xl hover:bg-white transition-all shadow-sm group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0096c7] to-[#00b4d8] flex items-center justify-center text-white shadow-lg shadow-[#0096c7]/10 overflow-hidden">
                      {userProfile?.picture ? (
                        <img src={userProfile.picture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-xs font-black text-gray-700 truncate max-w-[100px]">{userProfile?.fullName || "Profile"}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title={t("logout")}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/signin"
                    className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-[#0096c7] transition-all"
                  >
                    {t("signIn")}
                  </Link>
                  <Link
                    to="/signup"
                    className="px-8 py-3 bg-[#0096c7] text-white text-sm font-black rounded-2xl shadow-xl shadow-[#0096c7]/20 hover:bg-[#00b4d8] hover:scale-105 transition-all"
                  >
                    {t("signUp")}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="bg-white/90 backdrop-blur-3xl rounded-[32px] border border-white/50 shadow-2xl p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as "en" | "th")}
                      className={`flex items-center justify-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm ${
                        language === lang.code
                          ? "bg-[#0096c7] text-white shadow-lg shadow-[#0096c7]/20"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block p-5 bg-gray-50/50 hover:bg-white rounded-[24px] text-base font-black text-gray-700 transition-all border border-transparent hover:border-gray-100"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  {isLoggedIn ? (
                    <div className="space-y-4">
                      <Link
                        to="/profile"
                        className="flex items-center gap-4 p-5 bg-gradient-to-br from-[#0096c7] to-[#00b4d8] rounded-[24px] text-white shadow-xl shadow-[#0096c7]/20"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center overflow-hidden">
                          {userProfile?.picture ? (
                            <img src={userProfile.picture} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-sm">{userProfile?.fullName || "Profile"}</p>
                          <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">{t("profile")}</p>
                        </div>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 p-5 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-50 rounded-[24px] transition-all"
                      >
                        <LogOut className="w-5 h-5" />
                        {t("logout")}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <Link
                        to="/signin"
                        className="flex items-center justify-center p-5 bg-gray-50 text-gray-700 font-black text-sm rounded-[24px] hover:bg-gray-100 transition-all"
                      >
                        {t("signIn")}
                      </Link>
                      <Link
                        to="/signup"
                        className="flex items-center justify-center p-5 bg-[#0096c7] text-white font-black text-sm rounded-[24px] shadow-lg shadow-[#0096c7]/20 transition-all"
                      >
                        {t("signUp")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
