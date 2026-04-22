import { useState, useEffect, useRef } from "react";
import { 
  Send, Sparkles, User, Brain, ArrowLeft, Mail, Lock, 
  UserPlus, RefreshCw, AlertCircle, ArrowRight, 
  ShieldCheck, ChevronLeft, MessageSquare 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useLanguage } from "../contexts/language-context";
import { GoogleLogin } from "@react-oauth/google";

const API_URL = typeof window !== "undefined" && window.location.hostname !== "localhost" 
  ? `http://${window.location.hostname}:5005` 
  : "http://localhost:5005";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export function SignUpPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [activeUrl, setActiveUrl] = useState(API_URL);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const checkApi = async () => {
      const ports = [5005, 5000];
      const hostname = window.location.hostname;
      for (const port of ports) {
        const testUrl = `http://${hostname}:${port}`;
        try {
          const res = await fetch(`${testUrl}/api/Auth/health`, { signal: AbortSignal.timeout(1000) });
      if (res.ok) {
        setActiveUrl(testUrl);
        return;
      }
    } catch (e) {}
  }
};
checkApi();
}, []);

const handleSendOtp = async () => {
if (!formData.email || !formData.email.includes("@")) {
  toast.error("Please enter a valid email address");
  return;
}
const loadingToast = toast.loading("Checking email...");
setLoading(true);

// Add a timeout to fetch
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

try {
  console.log("Checking email availability for:", formData.email);
  // Check email availability (Normalized to lowercase in backend)
  const checkResponse = await fetch(`${activeUrl}/api/Auth/check-email?email=${encodeURIComponent(formData.email.trim().toLowerCase())}`, {
    signal: controller.signal
  });
  
  if (checkResponse.status === 404) {
    toast.error("API Endpoint not found (404). Check backend version.", { id: loadingToast });
    setLoading(false);
    return;
  }

  if (checkResponse.status === 409) {
    console.log("Email already exists (409)");
    toast.error("This email is already registered. Please sign in instead.", { 
      id: loadingToast,
      action: {
        label: "Sign In",
        onClick: () => navigate("/signin")
      }
    });
    setLoading(false);
    return;
  }

  if (!checkResponse.ok) {
    console.error("Check email failed with status:", checkResponse.status);
    toast.error("Unable to verify email availability. Please try again.", { id: loadingToast });
    setLoading(false);
    return;
  }

  console.log("Email is available, sending OTP...");
  toast.loading("Sending verification code...", { id: loadingToast });
  
  // Send OTP
  const response = await fetch(`${activeUrl}/api/Auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: formData.email.trim().toLowerCase() }),
    signal: controller.signal
  });

  clearTimeout(timeoutId);

  if (response.ok) {
    console.log("OTP sent successfully");
    setOtpSent(true);
    toast.success("Verification code sent!", { id: loadingToast });
    // Focus first OTP field after small delay
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  } else {
    const errorText = await response.text();
    console.error("Send OTP failed:", errorText);
    toast.error(errorText || "Failed to send verification code", { id: loadingToast });
  }
} catch (err: any) {
  console.error("Sign-up OTP error:", err);
  if (err.name === 'AbortError') {
    toast.error("Request timed out.", { id: loadingToast });
  } else {
    toast.error("Connection error. Is the backend running?", { id: loadingToast });
  }
} finally {
  setLoading(false);
}
};

const handleFormSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (!otpSent) {
  handleSendOtp();
  return;
}
handleVerifyOtp(e);
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

// Auto-verify when last digit is entered
if (index === 5 && value && newOtp.every(d => d !== "")) {
  // Small delay to allow state update to finish
  setTimeout(() => {
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    handleVerifyOtp(fakeEvent);
  }, 100);
}
};

const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
if (e.key === "Backspace" && !otp[index] && index > 0) {
  otpRefs.current[index - 1]?.focus();
}
};

const handleVerifyOtp = async (e: React.FormEvent) => {
e.preventDefault();
const otpString = otp.join("");
if (otpString.length < 6) {
  toast.error("Please enter the complete 6-digit code");
  return;
}

const loadingToast = toast.loading("Verifying account...");
setLoading(true);
try {
  const normalizedEmail = formData.email.trim().toLowerCase();
  const response = await fetch(`${activeUrl}/api/Auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: normalizedEmail, otp: otpString }),
  });

  if (response.ok) {
    const data = await response.json();
    
    // Update user profile with real data
    try {
      await fetch(`${activeUrl}/api/Auth/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: normalizedEmail, 
          fullName: formData.fullName 
        }),
      });
    } catch (updateErr) {
      console.error("Profile update error:", updateErr);
    }

        Cookies.set("userProfile", JSON.stringify({ 
          email: normalizedEmail, 
          fullName: formData.fullName || data.fullName, 
          token: data.token, 
          method: "email",
          loginAt: new Date().getTime()
        }), { expires: 7 });
        
        toast.success("Account created and verified!", { id: loadingToast });
        window.location.href = "/chat";
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Invalid OTP", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Connection error", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const loadingToast = toast.loading("Creating account with Google...");
    setLoading(true);
    try {
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      
      const response = await fetch(`${activeUrl}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: decoded.email,
          fullName: decoded.name,
          picture: decoded.picture,
          token: credentialResponse.credential
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set("userProfile", JSON.stringify({
          email: data.email,
          fullName: data.fullName,
          picture: data.picture,
          method: "google",
          token: data.token,
          loginAt: new Date().getTime()
        }), { expires: 7 });
        
        toast.success("Signed up with Google successfully!", { id: loadingToast });
        window.location.href = "/chat";
      } else {
        toast.error("Server sync failed", { id: loadingToast });
      }
    } catch (error: any) {
      toast.error("Google Signup failed", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoJoin = () => {
    Cookies.set("userProfile", JSON.stringify({
      email: "demo-signup@lifespan.plus",
      fullName: "Demo Explorer",
      method: "demo",
      token: "demo-token-" + Date.now(),
      loginAt: new Date().getTime()
    }), { expires: 1 });
    toast.success("Welcome to Lifespan+!");
    window.location.href = "/chat";
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-[32px] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 lg:p-10"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#0096c7] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#0096c7]/20">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Create Account</h1>
            <p className="text-gray-500 font-medium text-sm">Join Lifespan+ for health insights</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0096c7]/10 focus:border-[#0096c7] focus:bg-white transition-all font-bold text-gray-700"
                placeholder="Full Name"
                required
              />
            </div>
            
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({...formData, email: e.target.value});
                  setOtpSent(false); // Reset if email changes
                }}
                className="w-full pl-14 pr-32 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0096c7]/10 focus:border-[#0096c7] focus:bg-white transition-all font-bold text-gray-700"
                placeholder="Email Address"
                required
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || !formData.email || otpSent}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#0096c7] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#00b4d8] transition-all disabled:opacity-50 disabled:bg-gray-400"
              >
                {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : otpSent ? "Sent" : "Send OTP"}
              </button>
            </div>

            <AnimatePresence>
              {otpSent && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-2"
                >
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Verification Code</div>
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
                        className="w-full h-12 text-center text-xl font-black bg-gray-50 border border-gray-100 rounded-xl focus:border-[#0096c7] focus:bg-white focus:ring-4 focus:ring-[#0096c7]/5 transition-all text-gray-800"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0096c7]/10 focus:border-[#0096c7] focus:bg-white transition-all font-bold text-gray-700"
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !otpSent}
              className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-30 mt-4"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Sign Up Now"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[10px]"><span className="px-4 bg-white text-gray-400 font-black uppercase tracking-widest">Or Join With</span></div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Signup Failed")}
                useOneTap
                theme="outline"
                shape="pill"
                size="large"
                width="320"
              />
            </div>
            <button
              onClick={handleDemoJoin}
              className="w-full py-4 bg-white border border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all text-xs uppercase tracking-widest"
            >
              Skip to Demo Access
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Already have an account? <Link to="/signin" className="text-[#0096c7] font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
