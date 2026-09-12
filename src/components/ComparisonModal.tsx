import React from 'react';
import {
  X,
  Layers,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Printer
} from 'lucide-react';
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
import { ResearchProposal } from '../types';

interface ComparisonModalProps {
  proposals: ResearchProposal[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  proposals,
  onClose,
  onRemove
}) => {
  if (proposals.length === 0) return null;

  // Build combined Radar data for all selected proposals
  const firstProp = proposals[0];
  const radarData = firstProp.criteriaScores.map((criterion, idx) => {
    const entry: any = {
      criterion: criterion.name.replace(/^\d+\.\s*/, '').slice(0, 18),
      fullMark: 20
    };

    proposals.forEach((p, pIdx) => {
      entry[`p_${pIdx}`] = p.criteriaScores[idx]?.score || 0;
    });

    return entry;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        id="modal-comparison"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
      >
        {/* Header */}
        <div className="p-5 sm:px-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                เปรียบเทียบข้อเสนอโครงการวิจัย ({proposals.length} โครงการ)
              </h2>
              <p className="text-xs text-slate-500">
                เปรียบเทียบเรดาร์ชาร์ท 6 มิติ คะแนนเฉลี่ย และความคุ้มค่างบประมาณเพื่อการตัดสินใจ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
              title="พิมพ์ตารางเปรียบเทียบ"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Radar Chart Overlay */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 flex flex-col items-center">
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              เรดาร์ชาร์ทเปรียบเทียบคะแนน 6 ด้าน (Multi-Project Radar)
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              แสดงการกระจายตัวของคะแนนแต่ละโครงการซ้อนทับกัน
            </p>

            <div style={{ width: '100%', height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="criterion"
                    tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 20]}
                    stroke="#cbd5e1"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <Tooltip />
                  <Legend
                    wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                    formatter={(val, entry: any) => {
                      const idx = parseInt(entry.dataKey.replace('p_', ''));
                      const prop = proposals[idx];
                      return (
                        <span className="font-semibold text-slate-700 text-xs">
                          {prop ? `${prop.code}: ${prop.title.slice(0, 28)}...` : val}
                        </span>
                      );
                    }}
                  />
                  {proposals.map((p, pIdx) => (
                    <Radar
                      key={p.id}
                      name={`p_${pIdx}`}
                      dataKey={`p_${pIdx}`}
                      stroke={COLORS[pIdx % COLORS.length]}
                      fill={COLORS[pIdx % COLORS.length]}
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                  <th className="p-3 font-bold w-1/4">เกณฑ์การประเมิน / ตัวชี้วัด</th>
                  {proposals.map((p, idx) => (
                    <th key={p.id} className="p-3 font-bold">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          <span className="truncate">{p.code}</span>
                        </div>
                        <button
                          onClick={() => onRemove(p.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                          title="นำออกจากการเปรียบเทียบ"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] font-normal text-slate-500 line-clamp-1 mt-0.5">
                        {p.title}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Score Rows */}
                <tr className="bg-blue-50/40 font-semibold">
                  <td className="p-3 text-blue-900">คะแนนเฉลี่ยรวม (เต็ม 20)</td>
                  {proposals.map((p) => (
                    <td key={p.id} className="p-3 font-bold text-sm text-blue-700">
                      {p.averageScore.toFixed(2)} / 20 ({p.totalScore.toFixed(1)}/120)
                    </td>
                  ))}
                </tr>

                <tr className="bg-white">
                  <td className="p-3 font-medium text-slate-600">มติผลการประเมิน</td>
                  {proposals.map((p) => (
                    <td key={p.id} className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                        p.summary.decision === 'อนุมัติ'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.summary.decision === 'อนุมัติแบบมีเงื่อนไข'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {p.summary.decision}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 6 Criteria Rows */}
                {firstProp.criteriaScores.map((c, cIdx) => (
                  <tr key={c.id} className={cIdx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                    <td className="p-3 font-medium text-slate-700">{c.name}</td>
                    {proposals.map((p) => {
                      const score = p.criteriaScores[cIdx]?.score || 0;
                      return (
                        <td key={p.id} className="p-3 font-bold text-slate-800">
                          {score} / 20
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Budget & Leader */}
                <tr className="bg-white">
                  <td className="p-3 font-medium text-slate-600">งบประมาณเสนอขอ</td>
                  {proposals.map((p) => (
                    <td key={p.id} className="p-3 font-medium text-slate-800">
                      {p.budget.toLocaleString()} บาท
                    </td>
                  ))}
                </tr>

                <tr className="bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-600">หัวหน้าโครงการ</td>
                  {proposals.map((p) => (
                    <td key={p.id} className="p-3 text-slate-700">
                      {p.leader}
                    </td>
                  ))}
                </tr>

                <tr className="bg-white">
                  <td className="p-3 font-medium text-slate-600">พื้นที่เป้าหมาย</td>
                  {proposals.map((p) => (
                    <td key={p.id} className="p-3 text-slate-700">
                      {p.targetAreas.join(', ')}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
