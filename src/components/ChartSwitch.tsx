"use client";
import React from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, AreaChart, Area, Legend, PieChart, Pie, Cell,
} from "recharts";
import { QB, fmtNum } from "@/lib/data";

// Siempre devuelve un hijo válido a ResponsiveContainer (evita crash)
export default function ChartSwitch({ type, data }:{ type: string; data: any[] }) {
  let child: React.ReactElement = (
    <BarChart data={[{x:"",y:0}]}>
      <CartesianGrid stroke={QB.grid}/>
      <XAxis dataKey="x" stroke={QB.muted}/>
      <YAxis stroke={QB.muted}/>
      <Bar dataKey="y" fill={QB.blue}/>
    </BarChart>
  );

  if (type === "inventory") {
    child = (
      <BarChart data={data}>
        <CartesianGrid stroke={QB.grid}/>
        <XAxis dataKey="bucket" stroke={QB.muted}/>
        <YAxis tickFormatter={(v)=>`Bs ${fmtNum(Number(v))}`} stroke={QB.muted}/>
        <Tooltip formatter={(v:any)=>`Bs ${fmtNum(Number(v))}`}/>
        <Bar dataKey="valor" fill={QB.blue} radius={[4,4,0,0]}/>
      </BarChart>
    );
  } else if (type === "curvaS") {
    child = (
      <LineChart data={data}>
        <CartesianGrid stroke={QB.grid}/>
        <XAxis dataKey="name" stroke={QB.muted}/>
        <YAxis stroke={QB.muted} tickFormatter={(v)=>`${v}%`}/>
        <Tooltip formatter={(v:any)=>`${v}%`}/>
        <Line type="monotone" dataKey="plan" stroke={QB.blue} strokeWidth={2}/>
        <Line type="monotone" dataKey="exec" stroke={QB.primary} strokeWidth={3}/>
      </LineChart>
    );
  } else if (type === "utilizacion") {
    child = (
      <BarChart data={data}>
        <CartesianGrid stroke={QB.grid}/>
        <XAxis dataKey="semana" stroke={QB.muted}/>
        <YAxis stroke={QB.muted}/>
        <Tooltip />
        <Legend />
        <Bar dataKey="fact" name="Facturable" fill={QB.primary}/>
        <Bar dataKey="nofact" name="No facturable" fill={QB.blue}/>
      </BarChart>
    );
  } else if (type === "mrr") {
    child = (
      <LineChart data={data}>
        <CartesianGrid stroke={QB.grid}/>
        <XAxis dataKey="name" stroke={QB.muted}/>
        <YAxis tickFormatter={(v)=>`Bs ${fmtNum(Number(v))}`} stroke={QB.muted}/>
        <Tooltip formatter={(v:any)=>`Bs ${fmtNum(Number(v))}`}/>
        <Line type="monotone" dataKey="mrr" stroke={QB.primary} strokeWidth={3} dot={false}/>
      </LineChart>
    );
  } else if (type === "acpc") {
    child = (
      <BarChart data={data}>
        <CartesianGrid stroke={QB.grid}/>
        <XAxis dataKey="k" stroke={QB.muted}/>
        <YAxis tickFormatter={(v)=>`Bs ${fmtNum(Number(v))}`} stroke={QB.muted}/>
        <Tooltip formatter={(v:any)=>`Bs ${fmtNum(Number(v))}`}/>
        <Bar dataKey="v" radius={[4,4,0,0]}>
          <Cell fill={QB.primary}/><Cell fill={QB.blue}/>
        </Bar>
      </BarChart>
    );
  } else if (type === "otif") {
    child = (
      <BarChart data={data}>
        <CartesianGrid stroke={QB.grid}/>
        <XAxis dataKey="name" stroke={QB.muted}/>
        <YAxis domain={[80,100]} tickFormatter={(v)=>`${v}%`} stroke={QB.muted}/>
        <Tooltip formatter={(v:any)=>`${v}%`}/>
        <Bar dataKey="otif" fill={QB.primary} radius={[4,4,0,0]}/>
      </BarChart>
    );
  }

  return <ResponsiveContainer width="100%" height="100%">{child}</ResponsiveContainer>;
}
