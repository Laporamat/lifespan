import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  User, Mail, Save, LogOut, ArrowLeft, ShieldCheck, 
  Sparkles, Camera, Trash2, KeyRound, Globe, Bell, Moon, Sun, Monitor,
  RefreshCw, ChevronRight, MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "../contexts/language-context";
import Cookies from "js-cookie";

const API_URL = "http://localhost:5005";

export function ProfilePage() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "User Name",
    email: "user@example.com",
    picture: "",
  });

  const [settings, setSettings] = useState({
    notifications: true,
    theme: "light" as "light" | "dark" | "system",
  });

  useEffect(() => {
    const savedProfile = Cookies.get("userProfile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        // Initialize state from cookie first to avoid empty screen
        setProfileData({
          fullName: parsed.fullName || "User Name",
          email: parsed.email || "user@example.com",
          picture: parsed.picture || "",
        });
        fetchProfile(parsed.email);
      } catch (e) {
        console.error("Error parsing user profile cookie", e);
        navigate("/signin");
      }
    } else {
      navigate("/signin");
    }
  }, []);

  const fetchProfile = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/profile?email=${email}`);
      if (response.ok) {
        const data = await response.json();
        setProfileData({
          fullName: data.fullName || "User Name",
          email: data.email || email,
          picture: data.picture || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        const savedProfile = Cookies.get("userProfile");
        const existing = savedProfile ? JSON.parse(savedProfile) : {};
        Cookies.set("userProfile", JSON.stringify({ ...existing, ...data }), { expires: 7 });
        setEditMode(false);
        toast.success(t("saveChanges") || "Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("userProfile");
    localStorage.removeItem("lifespan_chats");
    toast.info(t("logout") || "Logged out successfully");
    navigate("/signin");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "th" : "en");
    toast.success(language === "en" ? "เปลี่ยนภาษาเป็นไทยแล้ว" : "Language changed to English");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Premium Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.05, 0.03] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.03, 0.05, 0.03] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-400 rounded-full blur-[140px]" 
        />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto relative grid lg:grid-cols-3 gap-10"
      >
        {/* Left Column: Profile Summary */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
          <div className="bg-white/40 backdrop-blur-3xl rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,150,199,0.08)] border border-white/60 p-10 flex flex-col items-center">
            <div className="relative group mb-8">
              <motion.div 
                whileHover={{ rotate: 0, scale: 1.05 }}
                className="w-32 h-32 bg-gradient-to-br from-[#0096c7] to-[#00b4d8] rounded-[40px] flex items-center justify-center shadow-2xl shadow-[#0096c7]/20 rotate-3 transition-all overflow-hidden border-4 border-white"
              >
                {profileData.picture ? (
                  <img src={profileData.picture} alt={profileData.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl border border-gray-100 text-[#0096c7] hover:bg-[#0096c7] hover:text-white transition-all"
              >
                <Camera className="w-5 h-5" />
              </motion.button>
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 tracking-tight text-center leading-tight">{profileData.fullName}</h2>
            <div className="flex items-center gap-2 mt-4 px-4 py-1.5 bg-green-50 rounded-full border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-green-600 font-black uppercase tracking-widest">{t("neuralActive")}</span>
            </div>
            
            <div className="w-full mt-12 space-y-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/chat")}
                className="w-full flex items-center justify-between px-6 py-5 bg-white/60 hover:bg-white text-gray-700 rounded-[24px] text-sm font-black uppercase tracking-widest transition-all border border-gray-100 shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-[#0096c7]" />
                  {t("chat")}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-5 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-[24px] text-sm font-black uppercase tracking-widest transition-all border border-red-100/50"
              >
                <LogOut className="w-5 h-5" />
                {t("logout")}
              </motion.button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-[40px] p-8 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#0096c7]/20 rounded-full blur-3xl" />
             <h4 className="text-white font-black text-lg mb-4 tracking-tight">Pro Insights</h4>
             <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">Your longevity engine has processed 142 data points this week.</p>
             <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all">View Report</button>
          </div>
        </motion.div>

        {/* Right Column: Details & Settings */}
        <div className="lg:col-span-2 space-y-10">
          {/* Personal Info Section */}
          <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-3xl rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,150,199,0.08)] border border-white/60 p-10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0096c7]/10 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-[#0096c7]" />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">{t("personalInfo")}</h3>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                disabled={loading}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  editMode 
                  ? "bg-[#0096c7] text-white shadow-xl shadow-[#0096c7]/30" 
                  : "bg-white border border-gray-100 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : (editMode ? t("saveChanges") : t("editProfile"))}
              </motion.button>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-5">{t("fullName")}</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  disabled={!editMode}
                  className="w-full px-8 py-5 bg-white/50 border border-gray-100 rounded-[28px] focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#0096c7] focus:bg-white transition-all font-bold text-gray-700 disabled:opacity-60 shadow-sm"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-5">{t("emailAddress")}</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0096c7] transition-colors" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!editMode}
                    className="w-full pl-16 pr-8 py-5 bg-white/50 border border-gray-100 rounded-[28px] focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#0096c7] focus:bg-white transition-all font-bold text-gray-700 disabled:opacity-60 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* App Settings Section */}
          <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-3xl rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,150,199,0.08)] border border-white/60 p-10">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{t("appPreferences")}</h3>
            </div>

            <div className="grid gap-5">
              {/* Language Toggle */}
              <div className="flex items-center justify-between p-6 bg-white/50 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{t("language")}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{language === "en" ? "English" : "ไทย"}</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleLanguage}
                  className="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#0096c7] hover:bg-[#0096c7] hover:text-white transition-all shadow-sm"
                >
                  {language === "en" ? "Switch to TH" : "เปลี่ยนเป็น EN"}
                </motion.button>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center justify-between p-6 bg-white/50 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Sun className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{t("theme")}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{settings.theme}</p>
                  </div>
                </div>
                <div className="flex gap-2 p-1.5 bg-white border border-gray-200 rounded-2xl shadow-inner">
                  {[
                    { id: 'light', icon: Sun },
                    { id: 'dark', icon: Moon },
                    { id: 'system', icon: Monitor }
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSettings({...settings, theme: item.id as any})}
                      className={`p-2.5 rounded-xl transition-all ${settings.theme === item.id ? 'bg-[#0096c7] text-white shadow-lg shadow-[#0096c7]/30' : 'text-gray-300 hover:bg-gray-50'}`}
                    >
                      <item.icon className="w-5 h-5" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Notification Toggle */}
              <div className="flex items-center justify-between p-6 bg-white/50 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Bell className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{t("notifications")}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{settings.notifications ? "Enabled" : "Disabled"}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                  className={`w-14 h-7 rounded-full transition-all relative ${settings.notifications ? 'bg-[#0096c7] shadow-lg shadow-[#0096c7]/20' : 'bg-gray-200'}`}
                >
                  <motion.div 
                    animate={{ x: settings.notifications ? 28 : 4 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm" 
                  />
                </button>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-green-50/50 rounded-2xl border border-green-100">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">{t("dataEncryption")}</span>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] hover:text-red-600 flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {t("deleteAccount")}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
