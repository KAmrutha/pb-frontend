
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function App(props) {
    console.log(props.data,'asdfjkasdjkfhjhk')
  return (
    <LineChart
      width={500}
      height={350}
      data={props.data[0]}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Legend />
      {/* <Line
        type="monotone"
        dataKey="pv"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      /> */}
      <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
    </LineChart>
  );
}
