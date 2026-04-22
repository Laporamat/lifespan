import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "th";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    appName: "Lifespan+",
    home: "Home",
    features: "Features",
    dashboard: "Dashboard",
    healthModes: "Health Modes",
    chat: "Chat",
    profile: "Profile",
    signIn: "Sign In",
    signUp: "Sign Up",
    language: "Language",
    logout: "Logout",
    
    // Sign In Page
    welcomeBack: "Welcome Back",
    secureAccess: "Securely access your longevity engine",
    verification: "Verification",
    enterCode: "Enter the code sent to your inbox",
    emailAddress: "Email Address",
    continue: "Continue",
    orSecurelyJoin: "Or Securely Join With",
    googleAccount: "Google Account",
    changeEmail: "Change Email",
    verifyStart: "Verify & Start",
    didntGetCode: "Didn't get a code?",
    resend: "Resend",
    securedBy: "Secured by Lifespan+ Neural Shield",
    
    // Chat Page
    newConsult: "New Consult",
    recentSessions: "Recent Sessions",
    longevityAi: "Longevity AI",
    neuralActive: "Neural engine active",
    howCanHelp: "How can I extend your life today?",
    verifyAdvice: "AI-generated advice should be verified with a medical professional",
    typeResponse: "Ask Lifespan+ about your health...",
    
    // Profile Page
    personalInfo: "Personal Information",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    security: "Security",
    dataEncryption: "Data Encryption Active",
    deleteAccount: "Delete Account",
    fullName: "Full Name",
    settings: "Settings",
    appPreferences: "App Preferences",
    theme: "Theme",
    notifications: "Notifications",
    privacy: "Privacy",
  },
  th: {
    // Navigation
    appName: "Lifespan+",
    home: "หน้าหลัก",
    features: "คุณสมบัติ",
    dashboard: "แดชบอร์ด",
    healthModes: "โหมดสุขภาพ",
    chat: "แชท",
    profile: "โปรไฟล์",
    signIn: "เข้าสู่ระบบ",
    signUp: "สมัครสมาชิก",
    language: "ภาษา",
    logout: "ออกจากระบบ",

    // Sign In Page
    welcomeBack: "ยินดีต้อนรับกลับมา",
    secureAccess: "เข้าถึงระบบยืนยันตัวตนของคุณอย่างปลอดภัย",
    verification: "การยืนยันตัวตน",
    enterCode: "กรอกรหัสที่ส่งไปยังอีเมลของคุณ",
    emailAddress: "อีเมล",
    continue: "ดำเนินการต่อ",
    orSecurelyJoin: "หรือเข้าสู่ระบบด้วย",
    googleAccount: "บัญชี Google",
    changeEmail: "เปลี่ยนอีเมล",
    verifyStart: "ยืนยันและเริ่มต้น",
    didntGetCode: "ไม่ได้รับรหัส?",
    resend: "ส่งอีกครั้ง",
    securedBy: "รักษาความปลอดภัยโดย Lifespan+ Neural Shield",

    // Chat Page
    newConsult: "เริ่มการปรึกษาใหม่",
    recentSessions: "เซสชันล่าสุด",
    longevityAi: "Longevity AI",
    neuralActive: "ระบบประมวลผลพร้อมใช้งาน",
    howCanHelp: "วันนี้ให้ฉันช่วยดูแลสุขภาพของคุณอย่างไรดีครับ?",
    verifyAdvice: "คำแนะนำจาก AI ควรได้รับการตรวจสอบโดยแพทย์ผู้เชี่ยวชาญ",
    typeResponse: "ถาม Lifespan+ เกี่ยวกับสุขภาพของคุณ...",

    // Profile Page
    personalInfo: "ข้อมูลส่วนตัว",
    editProfile: "แก้ไขโปรไฟล์",
    saveChanges: "บันทึกการเปลี่ยนแปลง",
    security: "ความปลอดภัย",
    dataEncryption: "ระบบเข้ารหัสข้อมูลทำงานอยู่",
    deleteAccount: "ลบบัญชี",
    fullName: "ชื่อ-นามสกุล",
    settings: "ตั้งค่า",
    appPreferences: "การตั้งค่าแอป",
    theme: "ธีม",
    notifications: "การแจ้งเตือน",
    privacy: "ความเป็นส่วนตัว",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("appLanguage");
    return (saved === "th" || saved === "en") ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem("appLanguage", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
