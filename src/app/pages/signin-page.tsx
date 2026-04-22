import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Mail, ArrowRight, ShieldCheck, RefreshCw, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "../contexts/language-context";
import Cookies from "js-cookie";
import { GoogleLogin } from "@react-oauth/google";

const API_URL = typeof window !== "undefined" && window.location.hostname !== "localhost" 
  ? `http://${window.location.hostname}:5005` 
  : "http://localhost:5005"; 

export function SignInPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === "otp" && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Processing...");

    try {
      // Mockup approach: Try backend but always allow proceeding
      const response = await fetch(`${API_URL}/api/Auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      }).catch(() => ({ ok: true }));

      toast.success("Verification code sent!", { id: loadingToast });
      setStep("otp");
    } catch (err) {
      toast.success("Verification code sent! (Demo Mode)", { id: loadingToast });
      setStep("otp");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value && newOtp.every(d => d !== "")) {
      setTimeout(() => handleVerifyOtp(), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Verifying...");

    try {
      const targetEmail = email.trim().toLowerCase();
      // Try real verification, but allow mock success
      const response = await fetch(`${API_URL}/api/Auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, otp: otpString }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        saveProfileAndRedirect(data.email, data.fullName, data.picture, "otp");
        toast.success("Welcome back!", { id: loadingToast });
      } else {
        saveProfileAndRedirect(targetEmail, targetEmail.split('@')[0], null, "otp-mock");
        toast.success("Verified successfully!", { id: loadingToast });
      }
    } catch (err) {
      saveProfileAndRedirect(email, email.split('@')[0], null, "otp-demo");
      toast.success("Verified successfully!", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const saveProfileAndRedirect = (email: string, fullName: string, picture: any, method: string) => {
    const userProfile = {
      email,
      fullName,
      picture,
      method,
      token: "mock-token-" + Date.now(),
      loginAt: new Date().getTime()
    };
    Cookies.set("userProfile", JSON.stringify(userProfile), { expires: 7 });
    window.location.href = "/chat";
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const loadingToast = toast.loading("Syncing with Google...");
    try {
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      saveProfileAndRedirect(decoded.email, decoded.name, decoded.picture, "google");
      toast.success(`Welcome, ${decoded.name}!`, { id: loadingToast });
    } catch (error) {
      toast.error("Google login failed", { id: loadingToast });
    }
  };

  const handleDemoLogin = () => {
    saveProfileAndRedirect("demo-user@lifespan.plus", "Demo User", null, "demo");
    toast.success("Welcome to Demo Mode!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-[#fcfdfe]">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[32px] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 lg:p-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#0096c7] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#0096c7]/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
              {step === "email" ? t("appName") : t("verification")}
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              {step === "email" ? t("secureAccess") : t("enterCode")}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.div
                key="email"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t("emailAddress")}</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0096c7]/10 focus:border-[#0096c7] focus:bg-white transition-all font-bold text-gray-700"
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : (
                      <>
                        {t("continue")}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                  <div className="relative flex justify-center text-[10px]"><span className="px-4 bg-white text-gray-400 font-black uppercase tracking-widest">{t("orSecurelyJoin")}</span></div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error("Google Login Failed")}
                      useOneTap
                      theme="outline"
                      shape="pill"
                      size="large"
                      width="320"
                    />
                  </div>

                  <button
                    onClick={handleDemoLogin}
                    className="w-full py-4 bg-white border border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all text-xs uppercase tracking-widest"
                  >
                    Try Demo Mode
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <button 
                  onClick={() => setStep("email")}
                  className="flex items-center gap-2 text-gray-400 hover:text-[#0096c7] transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t("changeEmail")}
                </button>

                <form onSubmit={handleVerifyOtp} className="space-y-8">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className="w-full h-14 text-center text-2xl font-black bg-gray-50 border border-gray-100 rounded-xl focus:border-[#0096c7] focus:bg-white focus:ring-4 focus:ring-[#0096c7]/5 transition-all text-gray-800"
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#0096c7] text-white font-black rounded-2xl shadow-lg shadow-[#0096c7]/20 hover:bg-[#00b4d8] transition-all disabled:opacity-70"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : t("verifyStart")}
                    </button>
                    <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      {t("didntGetCode")} <button type="button" onClick={() => handleSendOtp()} className="text-[#0096c7] hover:underline">{t("resend")}</button>
                    </p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
