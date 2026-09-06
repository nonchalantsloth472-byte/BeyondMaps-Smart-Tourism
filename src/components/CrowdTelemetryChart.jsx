import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BarChart3, Clock, Info } from 'lucide-react';

export default function CrowdTelemetryChart() {
  const chartData = [
    { time: '06:00 AM', standard: 12, beyond: 18, label: 'Dawn Solitude' },
    { time: '08:00 AM', standard: 38, beyond: 25, label: 'Stepwell Opening' },
    { time: '10:00 AM', standard: 78, beyond: 30, label: 'Tour Bus Influx' },
    { time: '12:00 PM', standard: 96, beyond: 24, label: 'Peak Midday Heat' },
    { time: '02:00 PM', standard: 88, beyond: 28, label: 'Afternoon Rush' },
    { time: '04:00 PM', standard: 82, beyond: 32, label: 'Palace Queue' },
    { time: '06:00 PM', standard: 48, beyond: 22, label: 'Sunset Vista' },
    { time: '08:00 PM', standard: 20, beyond: 14, label: 'Bazaar Lanterns' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#FFFFFF] border border-[#D8D1C5] p-3.5 shadow-md font-sans text-xs">
          <p className="font-bold text-[#24231F] mb-1.5 pb-1 border-b border-[#D8D1C5]">
            {label}
          </p>
          <div className="space-y-1">
            <p className="text-[#C66A4A] flex justify-between gap-4">
              <span>Standard Tour Bus Route:</span>
              <strong className="font-mono">{payload[0].value}% Capacity</strong>
            </p>
            <p className="text-[#234236] flex justify-between gap-4">
              <span>BeyondMaps Flow:</span>
              <strong className="font-mono font-bold">{payload[1].value}% Density</strong>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="insights" className="py-24 bg-[#F5F1E8] border-b border-[#D8D1C5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-[#C66A4A] text-xs uppercase font-bold tracking-[0.2em] block mb-2">
            Data Journalism & Spatial Analytics
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#24231F] font-normal">
            Temporal Influx & Crowd Dynamics
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#6F6A61] leading-relaxed">
            Standard tour packages force thousands of travelers into the same narrow entry gates simultaneously.
            BeyondMaps uses predictive temporal modeling to redistribute your route into natural quiet valleys.
          </p>
        </div>

        {/* Main Chart Container */}
        <div className="bg-[#FFFFFF] border border-[#D8D1C5] p-6 sm:p-10 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#D8D1C5] gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#234236] block">
                Jaipur Heritage Corridor · Average Hourly Congestion Rate (%)
              </span>
              <span className="text-xs text-[#6F6A61]">
                Aggregated from 18,000+ localized footfall checkpoints and historic monument ticket queues
              </span>
            </div>
            <div className="flex items-center gap-5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#C66A4A] inline-block"></span>
                <span className="text-[#6F6A61] font-medium">Standard Bus Itinerary</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#234236] inline-block"></span>
                <span className="text-[#234236] font-bold">BeyondMaps Flow</span>
              </div>
            </div>
          </div>

          {/* Recharts Render */}
          <div className="h-72 sm:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorStandard" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C66A4A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C66A4A" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBeyond" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#234236" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#234236" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="#6F6A61"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#D8D1C5' }}
                />
                <YAxis
                  stroke="#6F6A61"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#D8D1C5' }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="standard"
                  stroke="#C66A4A"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorStandard)"
                  name="Standard Route"
                />
                <Area
                  type="monotone"
                  dataKey="beyond"
                  stroke="#234236"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorBeyond)"
                  name="BeyondMaps"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Editorial Annotations Below */}
          <div className="mt-8 pt-6 border-t border-[#D8D1C5] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-[#F5F1E8] border border-[#D8D1C5]">
              <span className="font-bold text-[#234236] block mb-1">
                06:45 AM — Dawn Window
              </span>
              <p className="text-[#6F6A61] leading-relaxed">
                Stepwells and open courtyards visited during soft morning light before tour operators depart hotels.
              </p>
            </div>

            <div className="p-4 bg-[#F5F1E8] border border-[#D8D1C5]">
              <span className="font-bold text-[#C66A4A] block mb-1">
                12:00 PM — Midday Divergence
              </span>
              <p className="text-[#6F6A61] leading-relaxed">
                When fort gates hit 96% congestion, travelers are routed to shaded artisan studios in Sanganer and Bagru.
              </p>
            </div>

            <div className="p-4 bg-[#F5F1E8] border border-[#D8D1C5]">
              <span className="font-bold text-[#234236] block mb-1">
                05:30 PM — Golden Hour Ridge
              </span>
              <p className="text-[#6F6A61] leading-relaxed">
                Quiet cenotaphs and ridge walks along Nahargarh with zero commercial bus access.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
