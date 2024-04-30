import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF00FF']; // Add more colors as needed

const WeeklyBarChart = ({ data }) => {
  return (
    <BarChart width={600} height={350} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="week" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="amount" fill={colors[0]} />
    </BarChart>
  );
};

export default WeeklyBarChart;
