import { Link } from "react-router";
import { 
  Moon, Brain, Footprints, Heart, Apple, 
  Clock, TrendingUp, Activity, Sparkles, Wind,
  Timer, Target, Flame, Droplet
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function HealthModesPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-[#caf0f8]/50 backdrop-blur-sm rounded-full border border-[#90e0ef]/30 mb-4">
            <span className="text-sm font-semibold text-[#023e8a]">Health Tracking</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Health Modes</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Specialized tracking and AI insights for every aspect of your wellness journey
          </p>
        </div>

        {/* Sleep Mode */}
        <div className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center bg-white/80 backdrop-blur-sm rounded-[48px] p-12 shadow-2xl shadow-gray-200/50 border border-white/50">
            <div>
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#90e0ef] to-[#48cae4] flex items-center justify-center mb-6 shadow-xl shadow-[#90e0ef]/30">
                <Moon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Sleep Mode</h2>
              <p className="text-lg text-gray-600 mb-8">
                Optimize your sleep quality and duration for better recovery and longevity
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-3xl p-6">
                  <Clock className="w-6 h-6 text-[#023e8a] mb-2" />
                  <p className="text-sm text-[#023e8a] mb-1">Sleep Hours</p>
                  <p className="text-3xl font-bold text-[#023e8a]">7.6h</p>
                </div>
                <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-3xl p-6">
                  <TrendingUp className="w-6 h-6 text-[#023e8a] mb-2" />
                  <p className="text-sm text-[#023e8a] mb-1">Sleep Quality</p>
                  <p className="text-3xl font-bold text-[#023e8a]">87%</p>
                </div>
                <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-3xl p-6">
                  <Activity className="w-6 h-6 text-[#023e8a] mb-2" />
                  <p className="text-sm text-[#023e8a] mb-1">Deep Sleep</p>
                  <p className="text-3xl font-bold text-[#023e8a]">32%</p>
                </div>
                <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-3xl p-6">
                  <Sparkles className="w-6 h-6 text-[#023e8a] mb-2" />
                  <p className="text-sm text-[#023e8a] mb-1">Sleep Score</p>
                  <p className="text-3xl font-bold text-[#023e8a]">92</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 mb-3">Sleep Recommendations:</h3>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#caf0f8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#0096c7]">1</span>
                  </div>
                  <p className="text-gray-600">Go to bed 30 minutes earlier for optimal cellular repair</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#caf0f8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#0096c7]">2</span>
                  </div>
                  <p className="text-gray-600">Reduce screen time 1 hour before bed</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#caf0f8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#0096c7]">3</span>
                  </div>
                  <p className="text-gray-600">Keep bedroom temperature between 65-68°F</p>
                </div>
              </div>
            </div>

            <div className="relative h-full min-h-[500px]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1722605329575-08c950b01bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwd2VsbG5lc3MlMjB6ZW58ZW58MXx8fHwxNzc1MDI5OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Sleep and wellness"
                className="rounded-[32px] shadow-xl w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stress Mode */}
        <div className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center bg-white/80 backdrop-blur-sm rounded-[48px] p-12 shadow-2xl shadow-gray-200/50 border border-white/50">
            <div className="relative h-full min-h-[500px] order-2 lg:order-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1722605329575-08c950b01bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwd2VsbG5lc3MlMjB6ZW58ZW58MXx8fHwxNzc1MDI5OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Meditation and stress relief"
                className="rounded-[32px] shadow-xl w-full h-full object-cover"
              />
            </div>

            <div className="order-1 lg:order-2">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#48cae4] to-[#00b4d8] flex items-center justify-center mb-6 shadow-xl shadow-[#48cae4]/30">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Stress Mode</h2>
              <p className="text-lg text-gray-600 mb-8">
                Manage stress levels and improve mental wellness with AI-guided techniques
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-3xl p-6">
                  <Brain className="w-6 h-6 text-[#023e8a] mb-2" />
                  <p className="text-sm text-[#023e8a] mb-1">Stress Score</p>
                  <p className="text-3xl font-bold text-[#023e8a]">Low</p>
                </div>
                <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-3xl p-6">
                  <Wind className="w-6 h-6 text-[#023e8a] mb-2" />
                  <p className="text-sm text-[#023e8a] mb-1">Breathing</p>
                  <p className="text-3xl font-bold text-[#023e8a]">12/m</p>
                </div>
                <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-3xl p-6">
                  <Timer className="w-6 h-6 text-[#023e8a] mb-2" />
                  <p className="text-sm text-[#023e8a] mb-1">Meditation</p>
                  <p className="text-3xl font-bold text-[#023e8a]">15min</p>
                </div>
                <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-3xl p-6">
                  <Heart className="w-6 h-6 text-[#023e8a] mb-2" />
                  <p className="text-sm text-[#023e8a] mb-1">Recovery</p>
                  <p className="text-3xl font-bold text-[#023e8a]">85%</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 mb-3">Stress Reduction Tips:</h3>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#caf0f8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#0096c7]">1</span>
                  </div>
                  <p className="text-gray-600">Practice 5-10 minutes of deep breathing exercises</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#caf0f8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#0096c7]">2</span>
                  </div>
                  <p className="text-gray-600">Try guided meditation during lunch break</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#caf0f8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#0096c7]">3</span>
                  </div>
                  <p className="text-gray-600">Take short walks to reduce cortisol levels</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Mode */}
        <div className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center bg-white/80 backdrop-blur-sm rounded-[48px] p-12 shadow-2xl shadow-gray-200/50 border border-white/50">
            <div>
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#00b4d8] to-[#0096c7] flex items-center justify-center mb-6 shadow-xl shadow-[#00b4d8]/30">
                <Footprints className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Step Mode</h2>
              <p className="text-lg text-gray-600 mb-8">
                Track activity and maintain consistent movement habits for cardiovascular health
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-3xl p-6">
                  <Footprints className="w-6 h-6 text-[#023e8a] mb-2" />
                  <p className="text-sm text-[#023e8a] mb-1">Daily Steps</p>
                  <p className="text-3xl font-bold text-[#023e8a]">9.2K</p>
                </div>
                <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-3xl p-6">
                  <Target className="w-6 h-6 text-[#023e8a] mb-2" />
                  <p className="text-sm text-[#023e8a] mb-1">Step Goal</p>
                  <p className="text-3xl font-bold text-[#023e8a]">10K</p>
                </div>
                <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-3xl p-6">
                  <Flame className="w-6 h-6 text-[#023e8a] mb-2" />
                  <p className="text-sm text-[#023e8a] mb-1">Calories</p>
                  <p className="text-3xl font-bold text-[#023e8a]">2.1K</p>
                </div>
                <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-3xl p-6">
                  <Sparkles className="w-6 h-6 text-[#023e8a] mb-2" />
                  <p className="text-sm text-[#023e8a] mb-1">Week Streak</p>
                  <p className="text-3xl font-bold text-[#023e8a]">12</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 mb-3">Activity Recommendations:</h3>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#caf0f8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#0096c7]">1</span>
                  </div>
                  <p className="text-gray-600">Walk 800 more steps to reach your daily goal</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#caf0f8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#0096c7]">2</span>
                  </div>
                  <p className="text-gray-600">Take the stairs instead of elevator</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#caf0f8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#0096c7]">3</span>
                  </div>
                  <p className="text-gray-600">Evening walk recommended for better sleep</p>
                </div>
              </div>
            </div>

            <div className="relative h-full min-h-[500px]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758520705390-ccfc66f2b18a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwZXhlcmNpc2UlMjBhY3Rpdml0eXxlbnwxfHx8fDE3NzUwMjk5Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Running and exercise"
                className="rounded-[32px] shadow-xl w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Heart Mode & Nutrition Mode Row */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Heart Mode */}
          <div className="bg-white/80 backdrop-blur-sm rounded-[48px] p-10 shadow-2xl shadow-gray-200/50 border border-white/50">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#0096c7] to-[#0077b6] flex items-center justify-center mb-6 shadow-lg shadow-[#0096c7]/30">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Heart Mode</h2>
            <p className="text-gray-600 mb-6">
              Monitor cardiovascular health with advanced heart rate analysis
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-2xl p-4">
                <p className="text-xs text-[#023e8a] mb-1">Resting HR</p>
                <p className="text-2xl font-bold text-[#023e8a]">62 BPM</p>
              </div>
              <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-2xl p-4">
                <p className="text-xs text-[#023e8a] mb-1">HRV</p>
                <p className="text-2xl font-bold text-[#023e8a]">65ms</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-[#0096c7]"></div>
                <span>Heart rate variability tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-[#0096c7]"></div>
                <span>Cardiovascular risk alerts</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-[#0096c7]"></div>
                <span>Recovery recommendations</span>
              </div>
            </div>
          </div>

          {/* Nutrition Mode */}
          <div className="bg-white/80 backdrop-blur-sm rounded-[48px] p-10 shadow-2xl shadow-gray-200/50 border border-white/50">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#48cae4] to-[#90e0ef] flex items-center justify-center mb-6 shadow-lg shadow-[#48cae4]/30">
              <Apple className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Nutrition Mode</h2>
            <p className="text-gray-600 mb-6">
              Optimize your diet for longevity with AI-powered nutrition insights
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-2xl p-4">
                <Droplet className="w-5 h-5 text-[#023e8a] mb-1" />
                <p className="text-xs text-[#023e8a] mb-1">Water</p>
                <p className="text-2xl font-bold text-[#023e8a]">6/8</p>
              </div>
              <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-2xl p-4">
                <Apple className="w-5 h-5 text-[#023e8a] mb-1" />
                <p className="text-xs text-[#023e8a] mb-1">Meals</p>
                <p className="text-2xl font-bold text-[#023e8a]">3/3</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-[#0096c7]"></div>
                <span>Hydration tracking & reminders</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-[#0096c7]"></div>
                <span>Meal timing optimization</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-[#0096c7]"></div>
                <span>Longevity food recommendations</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#0096c7] to-[#00b4d8] rounded-[48px] p-12 text-center shadow-2xl shadow-[#0096c7]/40">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Optimize Your Health?</h2>
          <p className="text-xl text-white/90 mb-8">Start tracking with AI-powered insights today</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#0096c7] font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Get Started Free
            <Sparkles className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
