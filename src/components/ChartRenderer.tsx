import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ChartRendererProps {
  data: any[];
  type?: 'pie' | 'bar' | 'line' | 'area';
  primaryColor?: string;
  secondaryColor?: string;
}

export function ChartRenderer({ data, type = 'area', primaryColor = '#0f172a', secondaryColor = '#94a3b8' }: ChartRendererProps) {
  if (!data || data.length === 0) return null;

  const renderTooltip = (props: any) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      let labelPrefix = 'Period';
      if (dataItem && dataItem.year !== undefined) labelPrefix = 'Year';
      else if (dataItem && dataItem.month !== undefined) labelPrefix = 'Month';

      return (
        <div className="bg-white border border-border p-3 rounded-lg shadow-lg">
          <p className="font-bold text-xs mb-2">{labelPrefix}: {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs flex justify-between space-x-4">
              <span style={{ color: entry.color }}>{entry.name}</span>
              <span className="font-bold">{entry.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartMargins = { top: 10, right: 10, left: -20, bottom: 0 };

  if (type === 'pie') {
    const COLORS = [primaryColor, secondaryColor, '#cbd5e1', '#f8fafc'];
    return (
      <div className="h-64 w-full mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '10px' }} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'area') {
    // Determine data keys assuming the first array item defines the structure
    const keys = Object.keys(data[0]).filter(k => k !== 'year' && k !== 'month' && k !== 'name' && k !== 'label');
    return (
      <div className="h-64 w-full mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={chartMargins}>
            <defs>
              <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={secondaryColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey={data[0].year !== undefined ? 'year' : 'name'} tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val} />
            <Tooltip content={renderTooltip} />
            <Legend wrapperStyle={{ fontSize: '10px' }} iconType="circle" />
            {keys.map((key, i) => (
              <Area 
                key={key} 
                type="monotone" 
                dataKey={key} 
                stackId="1"
                stroke={i === 0 ? primaryColor : (i === 1 ? secondaryColor : '#cbd5e1')} 
                fillOpacity={1} 
                fill={`url(#color${i % 2 === 0 ? '1' : '2'})`} 
                name={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'bar' || type === 'line') {
    const keys = Object.keys(data[0]).filter(k => k !== 'year' && k !== 'month' && k !== 'name' && k !== 'label');
    const ChartComponent = type === 'bar' ? BarChart : LineChart;
    const DataComponent = type === 'bar' ? Bar : Line as React.ElementType;
    
    return (
      <div className="h-64 w-full mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data} margin={chartMargins}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey={data[0].year !== undefined ? 'year' : (data[0].month !== undefined ? 'month' : 'name')} tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val} />
            <Tooltip content={renderTooltip} />
            <Legend wrapperStyle={{ fontSize: '10px' }} iconType="circle" />
            {keys.map((key, i) => (
              type === 'bar' ? (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  stackId="1"
                  fill={i === 0 ? primaryColor : (i === 1 ? secondaryColor : '#e2e8f0')} 
                  name={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                />
              ) : (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={i === 0 ? primaryColor : (i === 1 ? secondaryColor : '#e2e8f0')} 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                />
              )
            ))}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
