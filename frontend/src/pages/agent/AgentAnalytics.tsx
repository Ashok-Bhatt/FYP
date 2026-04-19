import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaSpinner, FaChartLine, FaIndianRupeeSign } from 'react-icons/fa6';
import { FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
interface AnalyticsData {
  funnel: Record<string, number>;
  stats: {
    totalRevenue: number;
    totalProfit: number;
    avgQuoteValue: number;
    count: number;
  };
  topDestinations: Array<{ _id: string; revenue: number; profit: number }>;
  revenueOverTime: Array<{ _id: string; revenue: number; profit: number }>;
  avgResponseTime: number;
  viewsCount: number;
}

const AgentAnalytics = () => {
  const { user } = useAuth();
  const token = user?.token;

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState(30);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/analytics/agent`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAnalytics(res.data);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to load analytics';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <FaSpinner className="animate-spin text-4xl text-emerald-400 mx-auto mb-4" />
        <div className="text-white text-xl font-medium">Analyzing your performance...</div>
        <div className="text-gray-400 text-sm mt-2">Calculating travel insights</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-red-400 font-bold">
      {error}
    </div>
  );

  if (!analytics) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-gray-500 font-medium">
      No data yet — start creating quotes to unlock insights
    </div>
  );

  const {
    funnel = {},
    stats = { totalRevenue: 0, totalProfit: 0, avgQuoteValue: 0, count: 0 },
    topDestinations = [],
    revenueOverTime = [],
    avgResponseTime = 0,
    viewsCount = 0,
  } = analytics;

  // 📊 Derived Metrics
  const totalQuotes = Object.values(funnel).reduce((a, b) => a + b, 0);
  const conversionRate = totalQuotes ? ((funnel.ACCEPTED / totalQuotes) * 100).toFixed(1) : 0;
  const marginPercentage = stats.totalRevenue ? ((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1) : 0;

  const funnelData = Object.entries(funnel).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  // 📈 Filter & Chart Logic
  const filteredData = revenueOverTime.filter((item) => {
    const today = new Date();
    const date = new Date(item._id);
    const diff = (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= range;
  });

  const periodProfit = filteredData.reduce((sum, d) => sum + (d.profit || 0), 0);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500 selection:text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-2">
              Business Intelligence
            </h1>
            <p className="text-gray-400">Comprehensive overview of your sales funnel and margins</p>
          </div>
          <div className="bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2 flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Net Margin</p>
              <p className="text-xl font-bold text-emerald-400">{marginPercentage}%</p>
            </div>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
                { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, color: 'text-white', info: 'Gross value of all accepted quotes' },
                { label: 'Total Profit', value: `₹${stats.totalProfit.toLocaleString()}`, color: 'text-emerald-400', info: 'Earnings after net costs (Final - Net)' },
                { label: 'Avg Value', value: `₹${Math.round(stats.avgQuoteValue).toLocaleString()}`, color: 'text-white', info: 'Average revenue per accepted quote' },
                { label: 'Views', value: viewsCount, color: 'text-blue-400', info: 'Total unique quote views by customers' },
                { label: 'Conversion', value: `${conversionRate}%`, color: 'text-amber-400', info: 'Accepted vs Total Created' },
            ].map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative bg-zinc-900/40 border border-white/10 rounded-2xl p-5 group hover:bg-zinc-900/60 transition-all"
                >
                    <div
                        className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <FaInfoCircle size={14} />
                        {hoveredIndex === i && (
                            <div className="absolute right-0 top-6 w-48 text-[10px] text-white bg-zinc-800 border border-white/10 rounded-lg p-3 shadow-2xl z-50 leading-relaxed font-medium">
                                {item.info}
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{item.label}</p>
                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                </motion.div>
            ))}
        </div>

        {/* Main Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Conversion Funnel */}
          <div className="lg:col-span-2 bg-zinc-900/40 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <FaChartLine className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold">Conversion Funnel</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={funnelData}
                      dataKey="value"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                      stroke="none"
                    >
                      {funnelData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total</span>
                    <span className="text-3xl font-bold">{totalQuotes}</span>
                </div>
              </div>

              <div className="space-y-3">
                {funnelData.map((item, i) => (
                  <div key={i} className="group flex justify-between items-center bg-white/5 hover:bg-white/10 transition-colors px-5 py-3 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">{item.name}</span>
                    </div>
                    <span className="font-bold text-emerald-400 tabular-nums">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Response Time Card */}
          <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 animate-pulse" />
              </div>
              <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Avg Interaction Time</h3>
              <p className="text-4xl font-bold text-white">
                {avgResponseTime
                  ? avgResponseTime < 3600000
                    ? Math.round(avgResponseTime / 60000) + 'm'
                    : (avgResponseTime / 3600000).toFixed(1) + 'h'
                  : 'N/A'}
              </p>
              <p className="text-gray-600 text-[10px] mt-4 max-w-[150px]">Time from quote creation to user's first view</p>
          </div>
        </div>

        {/* Revenue vs Profit Chart */}
        <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <h3 className="text-xl font-bold mb-1">Growth & Profitability</h3>
                <p className="text-xs text-gray-500">Visualizing margin health over time</p>
            </div>

            <div className="flex bg-black p-1 rounded-xl border border-white/5">
              {[7, 15, 30].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                    range === r ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {r}D
                </button>
              ))}
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                    dataKey="_id" 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis 
                    stroke="#52525b" 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(value) => {
                        if (value >= 100000) {
                            return `${(value / 100000).toFixed(1)}L`;
                        } else if (value >= 1000) {
                            return `${(value / 1000).toFixed(0)}K`;
                        }
                        return Math.round(value).toString();
                    }}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                    labelStyle={{ color: '#71717a', fontSize: '10px', marginBottom: '4px' }}
                    formatter={(value: any, name: any) => {
                        const formattedValue = `₹${Math.round(value).toLocaleString()}`;
                        return [formattedValue, name];
                    }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                <Line 
                    name="Gross Revenue"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                />
                <Line 
                    name="Net Profit"
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <FaIndianRupeeSign className="text-emerald-500" size={12}/>
                <span className="text-sm font-bold">₹{periodProfit.toLocaleString()}</span>
                <span className="text-[10px] text-gray-500 uppercase font-black">Estimated Period Profit</span>
            </div>
          </div>
        </div>

        {/* Top Destinations Table */}
        <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Market Performance</h3>
            <span className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-400 font-black tracking-widest uppercase">Destinations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topDestinations.map((d, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-all group">
                <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-3">{d._id}</p>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] text-gray-600 uppercase font-bold">Revenue</p>
                        <p className="text-sm font-bold text-gray-300">₹{d.revenue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-emerald-500 uppercase font-black">Profit</p>
                        <p className="text-xl font-bold text-emerald-400">₹{d.profit.toLocaleString()}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AgentAnalytics;