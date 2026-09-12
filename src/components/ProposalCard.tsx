import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ExternalLink,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ThumbsUp,
  HelpCircle
} from 'lucide-react';
import { ResearchProposal } from '../types';

interface ProposalCardProps {
  proposal: ResearchProposal;
  onSelect: (proposal: ResearchProposal) => void;
  isSelectedForCompare: boolean;
  onToggleCompare: (id: string) => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  onSelect,
  isSelectedForCompare,
  onToggleCompare
}) => {
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);

  // Clear Pass / Conditional / Not Pass Status Indicator
  const getApprovalStatusBadge = (decision: string) => {
    switch (decision) {
      case 'อนุมัติ':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>ผ่านเกณฑ์การอนุมัติ</span>
          </div>
        );
      case 'อนุมัติแบบมีเงื่อนไข':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>ผ่านเกณฑ์แบบมีเงื่อนไข</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
            <Clock className="w-4 h-4 text-rose-600 shrink-0" />
            <span>ไม่ผ่านเกณฑ์ (ควรปรับปรุงแก้ไข)</span>
          </div>
        );
    }
  };

  const isPassed = proposal.summary.decision === 'อนุมัติ';
  const isConditional = proposal.summary.decision === 'อนุมัติแบบมีเงื่อนไข';

  return (
    <div
      id={`proposal-card-${proposal.id}`}
      className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
        isPassed
          ? 'border-slate-200/90 hover:border-emerald-300'
          : isConditional
          ? 'border-amber-200 hover:border-amber-400 bg-amber-50/10'
          : 'border-rose-200 hover:border-rose-400 bg-rose-50/10'
      }`}
    >
      {/* Header Info */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              รหัส {proposal.code}
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              {proposal.programName.split(' ')[0]} {proposal.programName.split(' ')[1]}
            </span>
            {proposal.isContinuousProject && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                <Layers className="w-3 h-3" /> โครงการต่อเนื่อง
              </span>
            )}
          </div>

          <div>{getApprovalStatusBadge(proposal.summary.decision)}</div>
        </div>

        <h3 
          onClick={() => onSelect(proposal)}
          className="text-base font-semibold text-slate-800 line-clamp-2 hover:text-blue-600 cursor-pointer group-hover:text-blue-600 transition-colors leading-snug"
        >
          {proposal.title}
        </h3>

        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
          {proposal.abstract}
        </p>
      </div>

      {/* Metadata Row */}
      <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 text-xs text-slate-600 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-slate-400">หัวหน้า:</span>
          <span className="font-medium text-slate-700 truncate">{proposal.leader}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-medium text-slate-700">{proposal.budget.toLocaleString()} บาท</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">{proposal.targetAreas.join(', ')}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{proposal.durationMonths} เดือน</span>
        </div>
      </div>

      {/* Score and Alignment Summary */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Radar Dimension Snapshot & Score */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              ผลคะแนนประเมิน (เต็ม 20)
            </span>
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-bold ${
                isPassed ? 'text-emerald-700' : isConditional ? 'text-amber-700' : 'text-rose-700'
              }`}>
                {proposal.averageScore.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">/ 20</span>
              <span className="text-xs text-slate-500 ml-1 font-medium">
                (รวม {proposal.totalScore.toFixed(1)}/120)
              </span>
            </div>
          </div>

          {/* Mini 6 criteria progress bars */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] mb-4">
            {proposal.criteriaScores.map((c) => {
              const shortLabel = c.name.replace(/^\d+\.\s*/, '').slice(0, 14);
              const percentage = (c.score / 20) * 100;
              return (
                <div key={c.id} className="flex flex-col">
                  <div className="flex justify-between text-slate-600 mb-0.5">
                    <span className="truncate">{shortLabel}</span>
                    <span className="font-semibold text-slate-800">{c.score}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        c.score >= 17
                          ? 'bg-emerald-500'
                          : c.score >= 14
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decision Rationale */}
          <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 mb-3 leading-relaxed">
            <strong className="text-slate-700 block mb-0.5">ผลการพิจารณา:</strong>
            <span className="text-slate-600">{proposal.summary.decisionRationale}</span>
          </div>

          {/* DIRECTLY VISIBLE RECOMMENDATIONS BOX */}
          <div className={`p-3 rounded-xl border mb-3 text-xs ${
            isPassed 
              ? 'bg-emerald-50/50 border-emerald-200' 
              : isConditional
              ? 'bg-amber-50/60 border-amber-200'
              : 'bg-rose-50/60 border-rose-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`font-bold flex items-center gap-1.5 ${
                isPassed ? 'text-emerald-900' : isConditional ? 'text-amber-900' : 'text-rose-900'
              }`}>
                <MessageSquare className="w-3.5 h-3.5" />
                ข้อเสนอแนะในการดำเนินโครงการ:
              </span>
              {proposal.summary.recommendations.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowAllRecommendations(!showAllRecommendations)}
                  className="text-[11px] text-blue-700 hover:underline flex items-center gap-0.5"
                >
                  {showAllRecommendations ? (
                    <>ย่อข้อเสนอแนะ <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>ดูเพิ่ม ({proposal.summary.recommendations.length}) <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>

            <ul className="space-y-1.5 text-slate-700">
              {(showAllRecommendations 
                ? proposal.summary.recommendations 
                : proposal.summary.recommendations.slice(0, 1)
              ).map((rec, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span className="font-medium">{rec}</span>
                </li>
              ))}
            </ul>

            {/* Improvement point if available */}
            {proposal.summary.improvementPoints && proposal.summary.improvementPoints.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
                <span className="font-semibold text-slate-700">ข้อควรปรับปรุง: </span>
                <span>{proposal.summary.improvementPoints[0]}</span>
              </div>
            )}
          </div>

          {/* Alignment Tags: SDGs & Identity */}
          <div className="flex flex-wrap gap-1.5 items-center pt-1 border-t border-slate-100">
            {proposal.alignment.sdgs.slice(0, 3).map((sdg) => (
              <span
                key={sdg.id}
                className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs"
                style={{ backgroundColor: sdg.color }}
                title={`${sdg.code}: ${sdg.nameTh}`}
              >
                {sdg.code}
              </span>
            ))}
            {proposal.alignment.identityFocus.matchedAreas.slice(0, 2).map((area, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200"
              >
                {area.replace(/^\d+\.\s*/, '').slice(0, 18)}
              </span>
            ))}
          </div>
        </div>

        {/* Card Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none hover:text-blue-600">
            <input
              type="checkbox"
              checked={isSelectedForCompare}
              onChange={() => onToggleCompare(proposal.id)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 border-slate-300"
            />
            เปรียบเทียบ
          </label>

          <button
            id={`btn-view-detail-${proposal.id}`}
            onClick={() => onSelect(proposal)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            ดูเรดาร์ชาร์ท & ผลวิเคราะห์เต็ม
            <ExternalLink className="w-3 h-3 opacity-60" />
          </button>
        </div>
      </div>
    </div>
  );
};
