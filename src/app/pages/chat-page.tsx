import { useState, useEffect, useRef } from "react";
import { 
  Send, Sparkles, Plus, MessageSquare, Trash2, Edit2, 
  Menu, X, User as UserIcon, Activity, Heart, Brain, LogOut, Settings,
  Zap, Shield, Clock, Globe, Paperclip, MoreVertical, Search,
  ChevronRight, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router";
import { useLanguage } from "../contexts/language-context";
import { toast } from "sonner";
import Cookies from "js-cookie";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const API_URL = typeof window !== "undefined" && window.location.hostname !== "localhost" 
  ? `http://${window.location.hostname}:5005` 
  : "http://localhost:5005"; 

export function ChatPage() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeUrl, setActiveUrl] = useState(API_URL);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, currentChatId, isTyping]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedProfile = Cookies.get("userProfile");
    if (!savedProfile) {
      navigate("/signin");
      return;
    }

    const savedChats = localStorage.getItem("lifespan_chats");
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats.map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
      })));
      if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id);
      }
    } else {
      createNewChat();
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("lifespan_chats", JSON.stringify(chats));
    }
  }, [chats]);

  const currentChat = chats.find(chat => chat.id === currentChatId);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: t("newConsult"),
      messages: [],
      createdAt: new Date(),
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove("userProfile");
    localStorage.removeItem("lifespan_chats");
    toast.info(t("logout"));
    navigate("/signin");
  };

  const userProfile = (() => {
    const saved = Cookies.get("userProfile");
    return saved ? JSON.parse(saved) : null;
  })();

  const confirmDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const handleDeleteChat = () => {
    if (!deletingId) return;
    const newChats = chats.filter(c => c.id !== deletingId);
    setChats(newChats);
    if (currentChatId === deletingId) {
      setCurrentChatId(newChats.length > 0 ? newChats[0].id : null);
    }
    setDeletingId(null);
    toast.success("Session cleared");
  };

  const handleSend = async () => {
    if (!message.trim() || !currentChatId || isTyping) return;

    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setChats(chats.map(chat => {
      if (chat.id === currentChatId) {
        const updatedMessages = [...chat.messages, userMessage];
        const title = chat.messages.length === 0 
          ? message.slice(0, 30) + (message.length > 30 ? "..." : "")
          : chat.title;
        return { ...chat, messages: updatedMessages, title };
      }
      return chat;
    }));

    const currentMessage = message;
    setMessage("");
    setIsTyping(true);

    try {
      const response = await fetch(`${activeUrl}/api/Chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to AI engine");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setChats(prevChats => prevChats.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, assistantMessage] }
          : chat
      ));
    } catch (error) {
      toast.error("AI connection failed. Using offline backup.");
      const aiResponse = generateAIResponse(currentMessage);
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setChats(prevChats => prevChats.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, assistantMessage] }
          : chat
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    if (language === "th") {
      if (msg.includes("นอน") || msg.includes("หลับ")) {
        return "### 🌙 การวิเคราะห์การนอนหลับที่เหมาะสม\n\nจากโปรไฟล์สุขภาพของคุณ เราขอแนะนำแผนดังนี้:\n\n1. **เป้าหมาย:** 7.5 ชั่วโมงต่อคืน\n2. **สิ่งที่ควรทำ:**\n    - งดแสงสีฟ้าหลัง 20:00 น.\n    - รับประทานแมกนีเซียมก่อนนอน\n    - รักษาอุณหภูมิห้องที่ 20°C\n\n*ระบบตรวจพบว่าคุณมีการพักผ่อนไม่เพียงพอใน 2 วันที่ผ่านมา*";
      }
      return "### ✨ Lifespan+ Intelligence\n\nฉันได้วิเคราะห์คำถามของคุณเกี่ยวกับสุขภาพแล้ว เพื่อให้คำแนะนำที่แม่นยำที่สุด เราควรดูข้อมูลกิจกรรมล่าสุดของคุณด้วยไหมครับ? \n\nคุณสามารถเลือกโหมด **Biomarker Analysis** เพื่อความละเอียดที่มากขึ้นได้ครับ";
    } else {
      if (msg.includes("sleep")) {
        return "### 🌙 Optimal Sleep Analysis\n\nBased on your health profile, here is your action plan:\n\n1. **Target:** 7.5 hours/night\n2. **Action Items:**\n    - Blue light block after 8 PM\n    - Magnesium glycinate 200mg\n    - Room temp at 68°F (20°C)\n\n*Note: Our engine detected lower recovery scores in your last 2 cycles.*";
      }
      return "### ✨ Lifespan+ Intelligence\n\nI've analyzed your query regarding your longevity journey. To provide the best advice, should we look at your recent biomarkers or activity levels?\n\nWould you like to start a **Deep Sync** with your wearable devices?";
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "th" : "en");
    toast.success(language === "en" ? "เปลี่ยนภาษาเป็นไทยแล้ว" : "Language changed to English");
  };

  return (
    <div className="fixed inset-0 bg-[#fcfdfe] flex overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white/90 backdrop-blur-3xl rounded-[48px] p-10 max-w-sm w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white relative z-10"
            >
              <div className="w-20 h-20 bg-red-50 rounded-[28px] flex items-center justify-center mb-8 mx-auto">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3 text-center tracking-tight">Clear Session?</h3>
              <p className="text-gray-500 text-sm mb-10 text-center font-medium leading-relaxed">This will permanently remove this health consultation record from our neural engine.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 font-black rounded-[20px] transition-all text-xs uppercase tracking-widest"
                >
                  Keep it
                </button>
                <button 
                  onClick={handleDeleteChat}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-[20px] shadow-xl shadow-red-200 transition-all text-xs uppercase tracking-widest"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar - Ultra Glassmorphism */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 320 : 0 }}
        className="lg:relative absolute inset-y-0 left-0 bg-white/40 backdrop-blur-3xl border-r border-white/60 flex flex-col z-[60] overflow-hidden transition-all duration-500 ease-[0.22, 1, 0.36, 1]"
      >
        <div className="p-8 flex flex-col h-full w-80">
          <div className="flex items-center justify-between mb-12">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 180 }}
                className="w-12 h-12 bg-gradient-to-br from-[#0096c7] to-[#00b4d8] rounded-2xl flex items-center justify-center shadow-xl shadow-[#0096c7]/20"
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-[#0077b6] to-[#00b4d8] bg-clip-text text-transparent tracking-tight">
                {t("appName")}
              </h1>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-100">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createNewChat}
            className="group flex items-center justify-between px-6 py-5 bg-gray-900 hover:bg-black text-white font-black rounded-[28px] shadow-xl shadow-gray-200 transition-all mb-10"
          >
            <div className="flex items-center gap-4">
              <Plus className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest">{t("newConsult")}</span>
            </div>
          </motion.button>

          <div className="flex-1 overflow-y-auto -mx-4 px-4 space-y-3 custom-scrollbar">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 px-4">{t("recentSessions")}</div>
            <AnimatePresence initial={false}>
              {chats.map(chat => (
                <motion.div
                  key={chat.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group relative rounded-[24px] transition-all duration-300 ${
                    chat.id === currentChatId
                      ? "bg-white/60 shadow-lg shadow-blue-500/5 border border-white"
                      : "hover:bg-white/40 text-gray-500 hover:text-gray-900 border border-transparent"
                  }`}
                >
                  <button
                    onClick={() => {
                      setCurrentChatId(chat.id);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-6 py-5 text-left text-sm font-bold ${
                      chat.id === currentChatId ? "text-[#0096c7]" : "text-gray-500"
                    }`}
                  >
                    <MessageSquare className={`w-4 h-4 flex-shrink-0 ${chat.id === currentChatId ? 'text-[#0096c7]' : 'text-gray-300 group-hover:text-[#0096c7]'}`} />
                    <span className="truncate pr-8">{chat.title}</span>
                  </button>
                  <button 
                    onClick={(e) => confirmDeleteChat(chat.id, e)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                      chat.id === currentChatId ? 'opacity-100 text-[#0096c7] hover:bg-white shadow-sm' : 'opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 hover:bg-white shadow-sm'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-auto pt-8 border-t border-white/60 space-y-4">
            <button 
              onClick={() => navigate("/profile")}
              className="w-full flex items-center gap-4 p-4 bg-white/60 hover:bg-white rounded-[24px] transition-all group border border-white shadow-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#0096c7] to-[#00b4d8] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0096c7]/10 group-hover:scale-105 transition-transform overflow-hidden">
                {userProfile?.picture ? (
                  <img src={userProfile.picture} alt={userProfile.fullName} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-black text-gray-900 leading-tight mb-1">{userProfile?.fullName || "User Name"}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t("profile")}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex gap-3">
              <button 
                onClick={toggleLanguage}
                className="flex-1 flex items-center justify-center gap-3 p-4 bg-white/40 hover:bg-white rounded-[20px] transition-all font-black text-[10px] uppercase tracking-widest text-gray-500 hover:text-[#0096c7] border border-transparent hover:border-white shadow-sm"
              >
                <Globe className="w-4 h-4" />
                <span>{language}</span>
              </button>
              <button 
                onClick={handleLogout} 
                className="flex-1 flex items-center justify-center gap-3 p-4 bg-white/40 hover:bg-red-50 rounded-[20px] transition-all font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-500 border border-transparent hover:border-white shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>{t("logout")}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-white">
        <AnimatePresence>
          {sidebarOpen && window.innerWidth < 1024 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-gray-900/10 backdrop-blur-sm z-50" 
            />
          )}
        </AnimatePresence>

        <header className="h-24 flex items-center justify-between px-8 bg-white/40 backdrop-blur-3xl border-b border-white/60 sticky top-0 z-[40]">
          <div className="flex items-center gap-6">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400 hover:text-[#0096c7]"
            >
              {sidebarOpen ? <ArrowLeft className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
            <div className="h-8 w-px bg-gray-100" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[20px] bg-[#0096c7]/5 flex items-center justify-center border border-[#0096c7]/10">
                <Brain className="w-6 h-6 text-[#0096c7]" />
              </div>
              <div>
                <h2 className="text-base font-black text-gray-900 tracking-tight">{t("longevityAi")}</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t("neuralActive")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-[20px] border border-white shadow-sm">
              {[Activity, Heart, Shield].map((Icon, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,1)" }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#0096c7] transition-all cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </motion.div>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.1 }} className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400">
              <Search className="w-5 h-5" />
            </motion.button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-12 space-y-12 custom-scrollbar bg-[#fcfdfe]">
          <div className="max-w-4xl mx-auto space-y-12">
            {currentChat?.messages.length === 0 && (
              <div className="text-center py-20 space-y-12">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="w-28 h-28 bg-white rounded-[44px] shadow-[0_32px_64px_-16px_rgba(0,150,199,0.15)] flex items-center justify-center mx-auto border-4 border-white relative"
                >
                  <Zap className="w-12 h-12 text-[#0096c7]" />
                </motion.div>
                <div className="space-y-4">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-black text-gray-900 tracking-tighter"
                  >
                    {t("howCanHelp")}
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]"
                  >
                    Lifespan+ Neural Engine v1.5
                  </motion.p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
                  {[
                    { icon: Clock, text: language === "en" ? "Optimize my sleep" : "ปรับปรุงการนอน", color: "text-purple-500", bg: "bg-purple-50" },
                    { icon: Activity, text: language === "en" ? "Analyze fitness" : "วิเคราะห์การออกกำลังกาย", color: "text-orange-500", bg: "bg-orange-50" },
                    { icon: Brain, text: language === "en" ? "Reduce stress" : "ลดความเครียด", color: "text-blue-500", bg: "bg-blue-50" },
                    { icon: Heart, text: language === "en" ? "Heart health" : "สุขภาพหัวใจ", color: "text-red-500", bg: "bg-red-50" },
                  ].map((item, i) => (
                    <motion.button 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(0,150,199,1)", color: "white" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setMessage(item.text)} 
                      className="group p-8 bg-white border border-gray-100 rounded-[36px] text-left transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-[#0096c7]/20"
                    >
                      <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:bg-white/20 transition-colors`}>
                        <item.icon className={`w-7 h-7 ${item.color} group-hover:text-white transition-colors`} />
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest">{item.text}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {currentChat?.messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-6 max-w-[95%] sm:max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg border-2 border-white ${
                    msg.role === "user" ? "bg-[#0096c7] text-white" : "bg-white text-[#0096c7]"
                  }`}>
                    {msg.role === "user" ? <UserIcon className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  <div className={`space-y-3 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    <div className={`px-8 py-6 rounded-[36px] shadow-sm text-sm leading-relaxed font-bold ${
                      msg.role === "user" 
                        ? "bg-gradient-to-br from-[#0096c7] to-[#00b4d8] text-white rounded-tr-none" 
                        : "bg-white text-gray-700 rounded-tl-none border border-gray-100"
                    }`}>
                      <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tight prose-headings:mb-6 prose-strong:text-inherit">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 px-2">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-6">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#0096c7] flex-shrink-0 flex items-center justify-center shadow-lg border-2 border-white">
                    <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="bg-white px-8 py-5 rounded-[28px] rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-1.5">
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-[#0096c7] rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#0096c7] rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#0096c7] rounded-full" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-8 bg-white/40 backdrop-blur-3xl border-t border-white/60">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 blur-3xl -z-10" />
            <div className="relative bg-white/80 backdrop-blur-md border border-white rounded-[36px] shadow-[0_20px_50px_rgba(0,150,199,0.08)] p-2 pl-8 flex items-center gap-4 transition-all focus-within:ring-8 focus-within:ring-blue-500/5 focus-within:border-[#0096c7] group">
              <button className="p-2 hover:bg-gray-50 rounded-xl text-gray-300 hover:text-[#0096c7] transition-all">
                <Paperclip className="w-6 h-6" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("typeResponse")}
                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-300 text-sm font-bold py-5"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!message.trim() || isTyping}
                className="p-5 bg-gray-900 text-white rounded-[28px] shadow-2xl hover:bg-black transition-all disabled:opacity-30 disabled:shadow-none group"
              >
                <Send className={`w-6 h-6 ${!message.trim() ? '' : 'group-hover:translate-x-1 group-hover:-translate-y-1'} transition-transform`} />
              </motion.button>
            </div>
            <p className="text-[9px] text-center text-gray-300 mt-6 font-black uppercase tracking-[0.3em]">
              {t("verifyAdvice")}
            </p>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e2e8f0;
        }
      `}</style>
    </div>
  );
}
