import React, { useState } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Printer,
  Compass,
  Globe,
  Map,
  Target,
  FileText,
  DollarSign,
  Calendar,
  Layers,
  RefreshCw,
  Share2,
  Check,
  ChevronRight
} from 'lucide-react';
import { ResearchProposal } from '../types';
import { RadarChartViewer } from './RadarChartViewer';

interface ProposalDetailModalProps {
  proposal: ResearchProposal | null;
  onClose: () => void;
  onReEvaluate: (proposal: ResearchProposal) => Promise<void>;
  isReEvaluating: boolean;
}

export const ProposalDetailModal: React.FC<ProposalDetailModalProps> = ({
  proposal,
  onClose,
  onReEvaluate,
  isReEvaluating
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'radar' | 'alignment' | 'decision'>('overview');
  const [copied, setCopied] = useState(false);

  if (!proposal) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `ผลการประเมินโครงการวิจัย AI: ${proposal.title}
แผนงาน: ${proposal.programName}
คะแนนเฉลี่ย: ${proposal.averageScore.toFixed(2)} / 20 (รวม ${proposal.totalScore.toFixed(1)}/120)
มติผลการประเมิน: ${proposal.summary.decision}
เหตุผล: ${proposal.summary.decisionRationale}
จุดเด่น: ${proposal.summary.strengths.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'อนุมัติ':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">ผ่านการอนุมัติ (Approved)</span>
              <span className="text-xs text-emerald-700 block">คะแนนอยู่ในเกณฑ์ดีเลิศ พร้อมจัดสรรงบประมาณ</span>
            </div>
          </div>
        );
      case 'อนุมัติแบบมีเงื่อนไข':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 font-medium text-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">อนุมัติแบบมีเงื่อนไข (Conditionally Approved)</span>
              <span className="text-xs text-amber-700 block">ต้องแก้ไขปรับปรุงตามข้อเสนอแนะก่อนเบิกจ่าย</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-300 font-medium text-sm">
            <Clock className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold">ควรปรับปรุงแก้ไขเชิงลึก (Revise & Resubmit)</span>
              <span className="text-xs text-rose-700 block">ควรทบทวนวัตถุประสงค์และแผนปฏิบัติการใหม่</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        id="modal-proposal-detail"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
      >
        {/* Modal Header */}
        <div className="p-5 sm:px-6 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                รหัส {proposal.code}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-200/80 text-slate-700">
                {proposal.programName}
              </span>
              {proposal.isContinuousProject && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <Layers className="w-3 h-3" /> โครงการต่อเนื่อง
                </span>
              )}
              {proposal.fileName && (
                <span className="text-xs text-slate-500 font-mono">
                  เอกสาร: {proposal.fileName}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {proposal.title}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-600 mt-2 flex-wrap">
              <span><strong>หัวหน้าโครงการ:</strong> {proposal.leader} ({proposal.department})</span>
              <span><strong>งบประมาณ:</strong> {proposal.budget.toLocaleString()} บาท</span>
              <span><strong>ระยะเวลา:</strong> {proposal.durationMonths} เดือน</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              title="คัดลอกสรุปผลการประเมิน"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handlePrint}
              title="พิมพ์รายงาน"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-white flex gap-2 sm:gap-6 text-sm font-medium overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            ภาพรวมและข้อมูลโครงการ
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'radar'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            เรดาร์ชาร์ทและคะแนน 6 ด้าน
          </button>
          <button
            onClick={() => setActiveTab('alignment')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'alignment'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            ความสอดคล้อง 5 กรอบยุทธศาสตร์
          </button>
          <button
            onClick={() => setActiveTab('decision')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'decision'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            สรุปผลประกอบการตัดสินใจ
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Score Snapshot Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-blue-50/60 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {proposal.averageScore.toFixed(2)}
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">คะแนนเฉลี่ย (เต็ม 20)</span>
                    <span className="text-sm font-bold text-slate-800">
                      รวม {proposal.totalScore.toFixed(1)} / 120 คะแนน
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-center justify-end">
                  {getDecisionBadge(proposal.summary.decision)}
                </div>
              </div>

              {/* Proposal Abstract */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  บทคัดย่อ / สาระสำคัญของโครงการ
                </h3>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed border border-slate-200/80">
                  {proposal.abstract}
                </div>
              </div>

              {/* Objectives & Expected Outputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-blue-600" />
                    วัตถุประสงค์ของโครงการ
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {proposal.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 font-semibold text-[10px] mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    ผลผลิตและผลลัพธ์ที่คาดว่าจะได้รับ (Outputs/Outcomes)
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {proposal.expectedOutputs.map((out, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{out}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Target Areas & Beneficiaries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">พื้นที่เป้าหมายการดำเนินงาน:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {proposal.targetAreas.map((area, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">กลุ่มเป้าหมาย/ผู้รับประโยชน์:</span>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {proposal.targetBeneficiaries}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RADAR CHART & 6 CRITERIA */}
          {activeTab === 'radar' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Radar Chart Display */}
                <div className="lg:col-span-6 bg-slate-50/70 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
                  <div className="text-center mb-1">
                    <h3 className="text-sm font-bold text-slate-900">
                      เรดาร์ชาร์ทเปรียบเทียบคะแนน 6 ด้าน (คะแนนเต็ม 20)
                    </h3>
                    <p className="text-xs text-slate-500">
                      เปรียบเทียบคะแนนโครงการกับค่าเฉลี่ยมาตรฐานของสถาบันวิทยาลัยชุมชน
                    </p>
                  </div>
                  <RadarChartViewer scores={proposal.criteriaScores} height={320} />
                </div>

                {/* Score Summary Box */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between border-b pb-2 mb-2">
                      <span className="text-xs font-bold text-slate-600 uppercase">มิติการประเมิน 6 ด้าน</span>
                      <span className="text-xs font-bold text-slate-600">คะแนน (เต็ม 20)</span>
                    </div>

                    <div className="space-y-2.5">
                      {proposal.criteriaScores.map((c) => {
                        const diff = c.score - c.benchmarkAvg;
                        return (
                          <div key={c.id} className="text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-800">{c.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{c.score}</span>
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                  diff >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                  {diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)} เทียบเกณฑ์
                                </span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                              {c.justification}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Justification for Each Criterion */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  รายละเอียดและเหตุผลประกอบการให้คะแนนทั้ง 6 ประเด็น
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proposal.criteriaScores.map((c, index) => (
                    <div key={c.id} className="p-4 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-slate-800">{c.name}</h4>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                          {c.score} / 20 คะแนน
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {c.justification}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STRATEGIC ALIGNMENT (5 DIMENSIONS) */}
          {activeTab === 'alignment' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                การวิเคราะห์ความสอดคล้องอิงตามเอกสารอ้างอิง วชช.น่าน: ปรัชญาวิสัยทัศน์, SDG 17 มิติ, แผนพัฒนาจังหวัดน่าน 2566-2570, แผนพัฒนาความเป็นเลิศสถาบัน 5 เสาหลัก และจุดเน้นอัตลักษณ์ 5 ด้าน
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Philosophy and Vision */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-blue-600" />
                        <h4 className="text-xs font-bold text-slate-900">1. ความสอดคล้องของปรัชญาวิสัยทัศน์</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                        {proposal.alignment.philosophyVision.rating} ({proposal.alignment.philosophyVision.score}/20)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {proposal.alignment.philosophyVision.details}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
                    {proposal.alignment.philosophyVision.keywordsMatched.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. SDGs Alignment */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <h4 className="text-xs font-bold text-slate-900">2. หัวข้อของ SDG (เป้าหมายสากล)</h4>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {proposal.alignment.sdgs.length} เป้าหมาย
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      {proposal.alignment.sdgs.map((sdg) => (
                        <div key={sdg.id} className="text-xs flex items-start gap-2">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-white shrink-0 mt-0.5"
                            style={{ backgroundColor: sdg.color }}
                          >
                            {sdg.code}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-800">{sdg.nameTh}: </span>
                            <span className="text-slate-600">{sdg.relevance}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Nan Provincial Development Plan */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Map className="w-4 h-4 text-amber-600" />
                        <h4 className="text-xs font-bold text-slate-900">3. ความสอดคล้องแผนพัฒนาจังหวัดน่าน</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                        {proposal.alignment.nanProvincialPlan.rating} ({proposal.alignment.nanProvincialPlan.score}/20)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      {proposal.alignment.nanProvincialPlan.details}
                    </p>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    {proposal.alignment.nanProvincialPlan.matchedStrategies.map((strat, i) => (
                      <span key={i} className="block text-[11px] text-slate-700 font-medium bg-amber-50/60 px-2 py-0.5 rounded">
                        • {strat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Excellence Plan */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-600" />
                        <h4 className="text-xs font-bold text-slate-900">4. แผนพัฒนาความเป็นเลิศสถาบัน</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800">
                        {proposal.alignment.excellencePlan.rating} ({proposal.alignment.excellencePlan.score}/20)
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-purple-700 bg-purple-50 p-2 rounded mb-2">
                      เกณฑ์เปรียบเทียบ: {proposal.alignment.excellencePlan.benchmarkComparison}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      {proposal.alignment.excellencePlan.details}
                    </p>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    {proposal.alignment.excellencePlan.pillarsMatched.map((pillar, i) => (
                      <span key={i} className="block text-[11px] text-slate-700 font-medium">
                        ✓ {pillar}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 5. Identity Focus Areas */}
                <div className="md:col-span-2 p-4 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-bold text-slate-900">5. จุดเน้นวิทยาลัยชุมชนตามอัตลักษณ์ 5 ด้าน</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800">
                      {proposal.alignment.identityFocus.rating} ({proposal.alignment.identityFocus.score}/20)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {proposal.alignment.identityFocus.details}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {proposal.alignment.identityFocus.matchedAreas.map((area, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg text-xs bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DECISION SUMMARY */}
          {activeTab === 'decision' && (
            <div className="space-y-6">
              {/* Decision Box */}
              <div className="p-5 rounded-xl border bg-slate-50 border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  มติและผลการประเมินภาพรวมเพื่อประกอบการตัดสินใจ
                </h3>
                <div className="mb-4">
                  {getDecisionBadge(proposal.summary.decision)}
                </div>
                <div className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200 font-medium">
                  <strong>เหตุผลและข้อสรุป: </strong>
                  {proposal.summary.decisionRationale}
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  บทสรุปสำหรับผู้บริหาร (Executive Summary)
                </h3>
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {proposal.summary.executiveSummary}
                </div>
              </div>

              {/* Strengths and Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    จุดเด่นของโครงการ (Strengths)
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {proposal.summary.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2.5 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    จุดที่ควรพัฒนา / ข้อสังเกต (Improvement Points)
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {proposal.summary.improvementPoints.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Policy Recommendations */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  ข้อเสนอแนะเชิงนโยบายและการดำเนินงาน (Recommendations)
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {proposal.summary.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => onReEvaluate(proposal)}
            disabled={isReEvaluating}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isReEvaluating ? 'animate-spin' : ''}`} />
            {isReEvaluating ? 'กำลังวิเคราะห์ด้วย Gemini AI...' : 'ประเมินซ้ำด้วย AI'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              พิมพ์รายงาน
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
