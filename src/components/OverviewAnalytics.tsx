import React from 'react';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  FolderOpen,
  ExternalLink,
  Target,
  Sparkles
} from 'lucide-react';
import { ResearchProposal } from '../types';

interface OverviewAnalyticsProps {
  proposals: ResearchProposal[];
  onOpenNewModal: () => void;
  onOpenRefModal: () => void;
}

export const OverviewAnalytics: React.FC<OverviewAnalyticsProps> = ({
  proposals,
  onOpenNewModal,
  onOpenRefModal
}) => {
  const total = proposals.length;
  const approved = proposals.filter((p) => p.summary.decision === 'อนุมัติ').length;
  const conditional = proposals.filter((p) => p.summary.decision === 'อนุมัติแบบมีเงื่อนไข').length;
  const revision = proposals.filter((p) => p.summary.decision === 'ควรปรับปรุงแก้ไขเชิงลึก').length;

  const totalAvg =
    proposals.length > 0
      ? proposals.reduce((acc, p) => acc + p.averageScore, 0) / proposals.length
      : 0;

  // Criteria averages
  const c1 = proposals.reduce((a, p) => a + (p.criteriaScores[0]?.score || 0), 0) / (total || 1);
  const c2 = proposals.reduce((a, p) => a + (p.criteriaScores[1]?.score || 0), 0) / (total || 1);
  const c3 = proposals.reduce((a, p) => a + (p.criteriaScores[2]?.score || 0), 0) / (total || 1);
  const c4 = proposals.reduce((a, p) => a + (p.criteriaScores[3]?.score || 0), 0) / (total || 1);
  const c5 = proposals.reduce((a, p) => a + (p.criteriaScores[4]?.score || 0), 0) / (total || 1);
  const c6 = proposals.reduce((a, p) => a + (p.criteriaScores[5]?.score || 0), 0) / (total || 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-8">
      {/* Top Banner / Heading */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              AI Proposal Assessment Engine
            </span>
            <span className="text-xs text-slate-500">
              วิทยาลัยชุมชนน่าน สถาบันวิทยาลัยชุมชน
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            ระบบ AI ตรวจสอบและประเมินข้อเสนอโครงการวิจัยเชิงพื้นที่
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            วิเคราะห์ความสอดคล้องและความเป็นไปได้ตามแผนงาน ปรัชญาวิสัยทัศน์ วชช.น่าน, SDG 17 มิติ, แผนพัฒนาจังหวัดน่าน 2566-2570, แผนพัฒนาความเป็นเลิศ 5 ปี และจุดเน้นอัตลักษณ์ พร้อมกราฟเปรียบเทียบในรูปแบบเรดาร์ชาร์ท (คะแนนเต็ม 20)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={onOpenRefModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors border border-slate-200/80"
          >
            <Award className="w-3.5 h-3.5 text-blue-600" />
            เอกสารอ้างอิงและเกณฑ์ประเมิน
          </button>

          <a
            href="https://drive.google.com/drive/folders/11xDEYXCN6u1mqMywYhZ0QQ7wyNJo-Kk9?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200/80"
            title="เปิดโฟลเดอร์โครงการวิจัยใน Google Drive"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
            ไดร์ฟข้อเสนอโครงการ
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <button
            id="btn-open-new-proposal"
            onClick={onOpenNewModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            ประเมินโครงการใหม่ด้วย AI
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
        {/* Total Proposals */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shrink-0">
            {total}
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">โครงการทั้งหมดในระบบ</span>
            <span className="text-base font-bold text-slate-800">
              8 แผนงานยุทธศาสตร์
            </span>
          </div>
        </div>

        {/* Average Score */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
            {totalAvg.toFixed(2)}
          </div>
          <div>
            <span className="text-xs text-blue-700 font-medium block">คะแนนเฉลี่ยรวมภาพรวม</span>
            <span className="text-base font-bold text-blue-900">
              เต็ม 20.00 คะแนน
            </span>
          </div>
        </div>

        {/* Approval Status Count */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
            {approved}
          </div>
          <div>
            <span className="text-xs text-emerald-700 font-medium block">ผ่านเกณฑ์การอนุมัติ</span>
            <span className="text-xs text-emerald-800 font-semibold">
              อนุมัติแบบมีเงื่อนไข: {conditional} โครงการ
            </span>
          </div>
        </div>

        {/* Need Revision / Continuous */}
        <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
            {proposals.filter(p => p.isContinuousProject).length}
          </div>
          <div>
            <span className="text-xs text-purple-700 font-medium block">โครงการต่อเนื่อง</span>
            <span className="text-xs text-purple-800 font-semibold">
              มีพัฒนาการต่อยอดเชิงพื้นที่
            </span>
          </div>
        </div>
      </div>

      {/* 6 Dimension Institution Average Bar */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            คะแนนเฉลี่ยระดับสถาบันตามเกณฑ์การประเมิน 6 มิติ (คะแนนเต็ม 20)
          </span>
          <span className="text-xs text-slate-500">
            เกณฑ์ผ่านการอนุมัติ: เฉลี่ย &ge; 17.00
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
          {[
            { name: '1. จุดเน้น อัตลักษณ์', score: c1, bench: 16.5 },
            { name: '2. ที่มาและวัตถุประสงค์', score: c2, bench: 15.8 },
            { name: '3. ความต่อเนื่อง', score: c3, bench: 14.9 },
            { name: '4. ผลสัมฤทธิ์ประจักษ์', score: c4, bench: 15.2 },
            { name: '5. ความเป็นไปได้', score: c5, bench: 16.2 },
            { name: '6. ร่วมมือเครือข่าย', score: c6, bench: 16.0 }
          ].map((item, idx) => {
            const pct = (item.score / 20) * 100;
            return (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                <div className="text-[11px] font-semibold text-slate-700 truncate mb-1" title={item.name}>
                  {item.name}
                </div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-bold text-blue-700">
                    {item.score.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400">/ 20</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
