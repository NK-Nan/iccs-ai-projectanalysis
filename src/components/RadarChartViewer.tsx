import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { CriterionScore, RadarDataPoint } from '../types';

interface RadarChartViewerProps {
  scores: CriterionScore[];
  title?: string;
  compareScores?: CriterionScore[];
  compareTitle?: string;
  height?: number;
}

export const RadarChartViewer: React.FC<RadarChartViewerProps> = ({
  scores,
  title = 'คะแนนโครงการ',
  compareScores,
  compareTitle = 'ค่าเฉลี่ยสถาบัน',
  height = 340
}) => {
  const data: RadarDataPoint[] = scores.map((item) => {
    // Shorten criterion name for radial labels
    let label = item.name.replace(/^\d+\.\s*/, '');
    if (label.length > 22) {
      label = label.slice(0, 20) + '...';
    }

    const matchedCompare = compareScores?.find((c) => c.id === item.id);

    return {
      criterion: label,
      fullMark: item.maxScore || 20,
      score: item.score,
      benchmark: matchedCompare ? matchedCompare.score : item.benchmarkAvg || 16.0
    };
  });

  return (
    <div className="w-full flex flex-col items-center">
      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="criterion"
              tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 20]}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              stroke="#cbd5e1"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 text-xs z-50">
                      <p className="font-semibold text-slate-800 mb-1 border-b pb-1">
                        {dataPoint.criterion}
                      </p>
                      <div className="flex items-center justify-between gap-4 py-0.5 text-blue-700 font-medium">
                        <span>{title}:</span>
                        <span className="text-sm font-bold">{dataPoint.score} / 20</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-0.5 text-slate-500">
                        <span>{compareTitle}:</span>
                        <span>{dataPoint.benchmark} / 20</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
              formatter={(value) => (
                <span className="text-slate-700 font-medium text-xs">{value}</span>
              )}
            />
            <Radar
              name={title}
              dataKey="score"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.4}
              strokeWidth={2}
            />
            <Radar
              name={compareTitle}
              dataKey="benchmark"
              stroke="#94a3b8"
              fill="#cbd5e1"
              fillOpacity={0.2}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
          คะแนนที่ได้ (เต็ม 20)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
          ค่าเฉลี่ยสถาบัน (Benchmark)
        </span>
      </div>
    </div>
  );
};
