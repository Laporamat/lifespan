import { Link } from "react-router";
import { 
  MessageCircle, Sparkles, ArrowRight, Brain, Moon, Activity, 
  Heart, Shield, TrendingUp, Zap, ChevronRight, Star, 
  ShieldCheck, Globe, Clock, Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useLanguage } from "../contexts/language-context";

export function HomePage() {
  const { t, language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const glassVariants = {
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "rgba(255, 255, 255, 0.8)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-indigo-400 to-blue-300 rounded-full blur-[140px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={itemVariants} className="space-y-8">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-50/50 backdrop-blur-sm rounded-full border border-blue-100/30">
                  <div className="w-1.5 h-1.5 bg-[#0096c7] rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0077b6]">
                    {language === "en" ? "Next-Gen Health Intelligence" : "นวัตกรรมปัญญาประดิษฐ์เพื่อสุขภาพ"}
                  </span>
                </div>
                
                <h1 className="text-6xl lg:text-8xl font-black text-gray-900 leading-[0.95] tracking-tight">
                  Master Your <br />
                  <span className="bg-gradient-to-r from-[#0096c7] to-[#00b4d8] bg-clip-text text-transparent">
                    Longevity.
                  </span>
                </h1>
                
                <p className="text-xl text-gray-500 leading-relaxed max-w-xl font-medium">
                  {language === "en" 
                    ? "Experience the future of personal wellness. Our AI engine analyzes your biomarkers to extend your healthy years."
                    : "สัมผัสอนาคตของการดูแลสุขภาพส่วนบุคคล ระบบ AI ของเราวิเคราะห์ข้อมูลชีวภาพเพื่อยืดอายุขัยที่มีคุณภาพของคุณ"}
                </p>

                <div className="flex flex-col sm:flex-row gap-5">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/signup"
                      className="group px-10 py-5 bg-gray-900 text-white font-black rounded-2xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-3"
                    >
                      {t("signUp")}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/chat"
                      className="px-10 py-5 bg-white border border-gray-100 text-gray-900 font-black rounded-2xl shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                    >
                      <MessageCircle className="w-5 h-5 text-[#0096c7]" />
                      {t("chat")}
                    </Link>
                  </motion.div>
                </div>

                <div className="flex items-center gap-14 pt-8">
                  <div className="flex flex-col gap-2">
                    <div className="flex -space-x-4">
                      {[1,2,3,4].map(i => (
                        <motion.div 
                          key={i} 
                          whileHover={{ y: -5, zIndex: 10 }}
                          className="w-12 h-12 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-lg cursor-pointer"
                        >
                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                        </motion.div>
                      ))}
                      <div className="w-12 h-12 rounded-full border-4 border-white bg-[#caf0f8] flex items-center justify-center text-xs font-black text-[#0096c7] shadow-lg">
                        +2k
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-2">Trusted by 2,000+ pioneers</span>
                  </div>
                  <div className="h-12 w-px bg-gray-200" />
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1 + i * 0.1 }}
                        >
                          <Star className="w-5 h-5 fill-[#0096c7] text-[#0096c7]" />
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-2">4.9/5 Health Impact Score</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="relative lg:h-[800px] flex items-center justify-center"
              >
                {/* Main Visual with Parallax-like effect */}
                <div className="relative w-full max-w-xl aspect-square">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-[#0096c7]/10 to-transparent rounded-[80px] blur-3xl" 
                  />
                  <motion.div
                    whileHover={{ rotate: 0, scale: 1.02 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className="relative w-full h-full object-cover rounded-[72px] shadow-[0_40px_80px_-15px_rgba(0,150,199,0.2)] rotate-2 overflow-hidden border border-white/40"
                  >
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
                      alt="Modern Healthcare AI"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </motion.div>
                  
                  {/* Floating Premium Cards */}
                  <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-10 -right-10 bg-white/60 backdrop-blur-3xl rounded-[32px] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                        <Activity className="w-7 h-7 text-green-500" />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Metabolic Age</p>
                        <p className="text-3xl font-black text-gray-900">-4.2 Years</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-10 -left-16 bg-white/60 backdrop-blur-3xl rounded-[32px] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-[#0096c7]/10 flex items-center justify-center">
                        <Brain className="w-7 h-7 text-[#0096c7]" />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Cognitive Flow</p>
                        <p className="text-3xl font-black text-gray-900">Optimal</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid - Enhanced Glassmorphism */}
        <section id="features" className="py-40 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              variants={itemVariants}
              className="text-center max-w-4xl mx-auto mb-24 space-y-6"
            >
              <h2 className="text-[12px] font-black text-[#0096c7] uppercase tracking-[0.4em]">Core Technologies</h2>
              <h3 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1]">
                Science-Backed <br /> Longevity Tools
              </h3>
              <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
                We combine artificial intelligence with the latest aging research to give you actionable insights.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: Brain,
                  title: language === "en" ? "Neural Health Coach" : "โค้ชสุขภาพอัจฉริยะ",
                  desc: "24/7 access to an AI trained on thousands of medical papers and longevity protocols.",
                  color: "blue",
                  bg: "bg-blue-50/50"
                },
                {
                  icon: ShieldCheck,
                  title: language === "en" ? "Biomarker Shield" : "ระบบป้องกันระดับเซลล์",
                  desc: "Upload your blood work and genetic data for deep analysis of your biological age.",
                  color: "cyan",
                  bg: "bg-cyan-50/50"
                },
                {
                  icon: Zap,
                  title: language === "en" ? "Real-time Bio-sync" : "การเชื่อมต่อข้อมูลเรียลไทม์",
                  desc: "Seamlessly connect with your wearables to track recovery, stress, and sleep cycles.",
                  color: "indigo",
                  bg: "bg-indigo-50/50"
                }
              ].map((f, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  whileHover="hover"
                  variants={glassVariants}
                  className="group relative p-12 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,150,199,0.08)] transition-all duration-500"
                >
                  <div className={`w-20 h-20 rounded-[28px] ${f.bg} flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <f.icon className={`w-10 h-10 text-${f.color}-500`} />
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">{f.title}</h4>
                  <p className="text-gray-500 font-medium leading-relaxed text-lg">{f.desc}</p>
                  <div className="mt-10 pt-10 border-t border-gray-100/50 flex items-center text-[#0096c7] font-black text-sm uppercase tracking-widest">
                    <span>Learn more</span>
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - High Contrast Glass */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="bg-gray-900 rounded-[64px] p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0096c7]/20 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-16 text-center relative z-10">
                {[
                  { val: "98%", label: "Accuracy" },
                  { val: "24/7", label: "AI Support" },
                  { val: "150+", label: "Biomarkers" },
                  { val: "10k+", label: "Users" }
                ].map((s, i) => (
                  <motion.div 
                    key={i} 
                    variants={itemVariants}
                    className="space-y-4"
                  >
                    <motion.p 
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1, type: "spring" }}
                      className="text-5xl lg:text-7xl font-black text-white"
                    >
                      {s.val}
                    </motion.p>
                    <p className="text-[12px] font-black text-white/40 uppercase tracking-[0.3em]">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Premium Dark Glass */}
        <section className="py-40 px-6">
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            className="max-w-6xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[72px] p-16 lg:p-32 text-center relative overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)]"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.3, 0.15]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0096c7]/30 rounded-full blur-[140px]" 
            />
            
            <div className="relative z-10 space-y-12">
              <h2 className="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                Ready to rewrite <br /> your biological clock?
              </h2>
              <p className="text-2xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed">
                Join the elite group of individuals using AI to optimize their healthspan. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center pt-10">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/signup" className="px-16 py-7 bg-[#0096c7] text-white font-black rounded-[32px] shadow-2xl shadow-[#0096c7]/30 hover:bg-[#00b4d8] transition-all text-lg">
                    Get Started for Free
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/chat" className="px-16 py-7 bg-white/10 backdrop-blur-2xl text-white font-black rounded-[32px] border border-white/20 hover:bg-white/20 transition-all text-lg">
                    Talk to AI
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
      </motion.main>

      {/* Footer - Minimalist Glass */}
      <footer className="py-32 px-6 border-t border-gray-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-20 mb-24">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0096c7] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0096c7]/20">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tight">Lifespan+</span>
              </div>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                The world's first AI longevity engine designed for high-performance humans.
              </p>
              <div className="flex gap-6">
                {[Globe, Smartphone, Clock].map((Icon, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5, color: "#0096c7" }}
                    className="cursor-pointer text-gray-300"
                  >
                    <Icon className="w-6 h-6 transition-colors" />
                  </motion.div>
                ))}
              </div>
            </div>
            
            {[
              { title: "Product", links: ["Features", "Pricing", "AI Coach", "Bio-sync"] },
              { title: "Company", links: ["About", "Research", "Privacy", "Terms"] },
              { title: "Support", links: ["Help Center", "Community", "Contact", "API"] }
            ].map((col, i) => (
              <div key={i} className="space-y-8">
                <h5 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em]">{col.title}</h5>
                <ul className="space-y-5 text-sm font-bold text-gray-500">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="hover:text-[#0096c7] transition-all flex items-center group">
                        <span className="w-0 h-px bg-[#0096c7] mr-0 group-hover:w-4 group-hover:mr-3 transition-all" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-12 border-t border-gray-100/50 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">
              © 2026 Lifespan+ Neural Systems.
            </p>
            <div className="flex gap-12 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
