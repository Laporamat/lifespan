import { 
  Moon, Brain, Footprints, Heart, Flame, Droplet, Activity, 
  TrendingUp, Clock, Zap, CheckCircle2, AlertCircle, Watch,
  Sparkles, Calendar
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

export function DashboardPage() {
  // Mock data for charts
  const sleepData = [
    { day: "Mon", hours: 7.2 },
    { day: "Tue", hours: 6.8 },
    { day: "Wed", hours: 7.5 },
    { day: "Thu", hours: 8.1 },
    { day: "Fri", hours: 7.3 },
    { day: "Sat", hours: 8.5 },
    { day: "Sun", hours: 8.0 },
  ];

  const stressData = [
    { day: "Mon", level: 65 },
    { day: "Tue", level: 58 },
    { day: "Wed", level: 52 },
    { day: "Thu", level: 45 },
    { day: "Fri", level: 38 },
    { day: "Sat", level: 25 },
    { day: "Sun", level: 30 },
  ];

  const stepsData = [
    { day: "Mon", steps: 8432 },
    { day: "Tue", steps: 7821 },
    { day: "Wed", steps: 9543 },
    { day: "Thu", steps: 10234 },
    { day: "Fri", steps: 8765 },
    { day: "Sat", steps: 11234 },
    { day: "Sun", steps: 9876 },
  ];

  const healthProgressData = [
    { month: "Jan", score: 72 },
    { month: "Feb", score: 76 },
    { month: "Mar", score: 81 },
    { month: "Apr", score: 87 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Health Dashboard</h1>
              <p className="text-gray-600">Your complete wellness overview</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-md flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0096c7]" />
                <span className="text-sm font-medium text-gray-700">Last 7 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          {/* Sleep Score Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-white/50 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#90e0ef] to-[#48cae4] flex items-center justify-center">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Sleep Score</p>
            <p className="text-3xl font-bold text-gray-800">87</p>
            <p className="text-xs text-green-600 mt-2">+5 from last week</p>
          </div>

          {/* Stress Level Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-white/50 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#48cae4] to-[#00b4d8] flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Stress Level</p>
            <p className="text-3xl font-bold text-gray-800">Low</p>
            <p className="text-xs text-green-600 mt-2">-15% this week</p>
          </div>

          {/* Step Count Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-white/50 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00b4d8] to-[#0096c7] flex items-center justify-center">
                <Footprints className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Daily Steps</p>
            <p className="text-3xl font-bold text-gray-800">9.2K</p>
            <p className="text-xs text-green-600 mt-2">92% of goal</p>
          </div>

          {/* Heart Rate Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-white/50 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0096c7] to-[#0077b6] flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <Activity className="w-4 h-4 text-[#0096c7]" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Resting HR</p>
            <p className="text-3xl font-bold text-gray-800">62</p>
            <p className="text-xs text-gray-500 mt-2">BPM · Normal</p>
          </div>

          {/* Calories Burned Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-white/50 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#48cae4] to-[#90e0ef] flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <Zap className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Calories</p>
            <p className="text-3xl font-bold text-gray-800">2.1K</p>
            <p className="text-xs text-gray-500 mt-2">Burned today</p>
          </div>

          {/* Longevity Score Card */}
          <div className="bg-gradient-to-br from-[#0096c7] to-[#00b4d8] rounded-3xl p-6 shadow-xl shadow-[#0096c7]/30 text-white hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-white/80 mb-1">Longevity</p>
            <p className="text-3xl font-bold">92</p>
            <p className="text-xs text-white/80 mt-2">↑ 8 pts this month</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Sleep Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Weekly Sleep</h3>
                <p className="text-sm text-gray-600">Average: 7.6 hours</p>
              </div>
              <Moon className="w-8 h-8 text-[#0096c7]" />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={sleepData}>
                <defs>
                  <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00b4d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#00b4d8" 
                  strokeWidth={3}
                  fill="url(#sleepGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stress Trend Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Stress Trend</h3>
                <p className="text-sm text-gray-600">Decreasing -15%</p>
              </div>
              <Brain className="w-8 h-8 text-[#0096c7]" />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={stressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="level" 
                  stroke="#48cae4" 
                  strokeWidth={3}
                  dot={{ fill: '#48cae4', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Steps Bar Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Daily Steps</h3>
                <p className="text-sm text-gray-600">Goal: 10,000 steps</p>
              </div>
              <Footprints className="w-8 h-8 text-[#0096c7]" />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stepsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar 
                  dataKey="steps" 
                  fill="url(#stepsGradient)" 
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0096c7" />
                    <stop offset="100%" stopColor="#00b4d8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Health Improvement Progress */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Health Progress</h3>
                <p className="text-sm text-gray-600">Last 4 months</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#0096c7]" />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={healthProgressData}>
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0096c7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0096c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#0096c7" 
                  strokeWidth={3}
                  fill="url(#progressGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widgets Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Smartwatch Sync Status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-white/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0096c7] to-[#00b4d8] flex items-center justify-center">
                <Watch className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Device Status</h3>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Connected
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last sync</span>
                <span className="text-gray-800 font-medium">2 min ago</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Battery</span>
                <span className="text-gray-800 font-medium">87%</span>
              </div>
            </div>
          </div>

          {/* AI Daily Recommendations */}
          <div className="bg-gradient-to-br from-[#caf0f8] to-[#90e0ef] rounded-3xl p-6 shadow-xl shadow-[#caf0f8]/30 border border-white/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#0096c7]" />
              </div>
              <h3 className="font-bold text-[#023e8a]">AI Recommendations</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-[#023e8a]">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Go to bed 30 min earlier tonight</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#023e8a]">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Take a 5-min breathing break</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#023e8a]">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Walk 1,500 more steps today</span>
              </li>
            </ul>
          </div>

          {/* Health Alerts & Reminders */}
          <div className="space-y-4">
            {/* Hydration Reminder */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-lg shadow-gray-200/50 border border-white/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#48cae4] to-[#90e0ef] flex items-center justify-center flex-shrink-0">
                <Droplet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Hydration</p>
                <p className="text-xs text-gray-600">6/8 glasses today</p>
              </div>
            </div>

            {/* Recovery Score */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-lg shadow-gray-200/50 border border-white/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00b4d8] to-[#48cae4] flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Recovery Score</p>
                <p className="text-xs text-gray-600">Ready for workout</p>
              </div>
            </div>

            {/* Health Alert */}
            <div className="bg-orange-50 rounded-3xl p-4 shadow-lg border border-orange-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-900">Sitting Alert</p>
                <p className="text-xs text-orange-700">Stand up and move!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
