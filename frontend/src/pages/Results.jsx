import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  Share2, 
  BarChart3, 
  TrendingUp, 
  Battery, 
  Clock, 
  MapPin, 
  DollarSign,
  Zap,
  Navigation,
  Target,
  Award
} from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';

const Results = () => {
  const { routes, selectedRoute, aiProvider } = useSimulationStore();

  // Mock data for charts
  const routeComparisonData = [
    { name: 'Dijkstra', distance: 12.5, duration: 25, energy: 8.2, cost: 15.3 },
    { name: 'A*', distance: 14.2, duration: 22, energy: 9.1, cost: 16.8 },
    { name: 'AI-Powered', distance: 13.1, duration: 20, energy: 7.8, cost: 14.5 },
  ];

  const energyConsumptionData = [
    { segment: 'Start', energy: 0 },
    { segment: 'Segment 1', energy: 2.1 },
    { segment: 'Charging', energy: 2.1 },
    { segment: 'Segment 2', energy: 4.3 },
    { segment: 'Segment 3', energy: 6.2 },
    { segment: 'Destination', energy: 8.2 },
  ];

  const costBreakdownData = [
    { name: 'Charging', value: 12.5, color: '#BA68ED' },
    { name: 'Toll', value: 2.8, color: '#10B981' },
    { name: 'Time', value: 5.2, color: '#F59E0B' },
  ];

  const metrics = [
    {
      title: 'Total Distance',
      value: '12.5 km',
      icon: MapPin,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Travel Time',
      value: '25 min',
      icon: Clock,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Energy Used',
      value: '8.2 kWh',
      icon: Battery,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Total Cost',
      value: '€15.30',
      icon: DollarSign,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  const routeDetails = [
    { label: 'Algorithm Used', value: selectedRoute?.algorithm || 'Dijkstra', icon: Navigation },
    { label: 'User Profile', value: 'Balanced', icon: Target },
    { label: 'Battery Efficiency', value: '92%', icon: Zap },
    { label: 'Route Score', value: '8.7/10', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Simulation Results
              </h1>
              <p className="text-muted-foreground">
                Detailed analysis of your EV routing simulation
              </p>
            </div>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent/80 text-foreground rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Results</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${metric.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Route Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Algorithm Comparison</h3>
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={routeComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="distance" fill="#BA68ED" name="Distance (km)" />
                <Bar dataKey="duration" fill="#10B981" name="Duration (min)" />
                <Bar dataKey="energy" fill="#F59E0B" name="Energy (kWh)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Energy Consumption Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Energy Consumption</h3>
              <Battery className="w-5 h-5 text-primary" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={energyConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="segment" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#BA68ED" 
                  strokeWidth={3}
                  dot={{ fill: '#BA68ED', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Cost Breakdown and Route Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Cost Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1 bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Cost Breakdown</h3>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {costBreakdownData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">€{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Route Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-2 bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Route Details</h3>
              <Navigation className="w-5 h-5 text-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {routeDetails.map((detail, index) => {
                const Icon = detail.icon;
                return (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-accent/50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{detail.label}</p>
                      <p className="font-semibold text-foreground">{detail.value}</p>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* AI Provider Information */}
              {aiProvider && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex items-center space-x-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">AI Provider</p>
                    <p className="font-semibold text-green-600">{aiProvider.toUpperCase()}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Optimization Recommendations</h3>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="font-semibold text-green-500 mb-2">Energy Efficiency</h4>
              <p className="text-sm text-muted-foreground">
                Consider using regenerative braking to improve energy efficiency by 15%.
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="font-semibold text-blue-500 mb-2">Route Optimization</h4>
              <p className="text-sm text-muted-foreground">
                The AI-powered algorithm could save 2.3 minutes and 0.4 kWh.
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <h4 className="font-semibold text-purple-500 mb-2">Charging Strategy</h4>
              <p className="text-sm text-muted-foreground">
                Plan charging stops during off-peak hours to reduce costs by 20%.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results; 