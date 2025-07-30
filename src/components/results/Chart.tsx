import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Route 1', distance: 4000, time: 2400 },
  { name: 'Route 2', distance: 3000, time: 1398 },
  { name: 'Route 3', distance: 2000, time: 9800 },
  { name: 'Route 4', distance: 2780, time: 3908 },
  { name: 'Route 5', distance: 1890, time: 4800 },
  { name: 'Route 6', distance: 2390, time: 3800 },
  { name: 'Route 7', distance: 3490, time: 4300 },
];

const Chart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="time" fill="#8884d8" />
        <Bar dataKey="distance" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
