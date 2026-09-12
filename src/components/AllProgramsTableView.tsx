import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Search, 
  Filter, 
  Printer, 
  FileSpreadsheet, 
  ExternalLink,
  Award,
  Sparkles,
  Layers,
  FolderOpen,
  ChevronRight
} from 'lucide-react';
import { ResearchProposal, ProgramInfo } from '../types';

interface AllProgramsTableViewProps {
  proposals: ResearchProposal[];
  programs: ProgramInfo[];
  onSelectProposal: (proposal: ResearchProposal) => void;
}

export const AllProgramsTableView: React.FC<AllProgramsTableViewProps> = ({
  proposals,
  programs,
  onSelectProposal
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'conditional' | 'revise'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered proposals
  const filteredProposals = proposals.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.programName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'approved' ? p.summary.decision === 'อนุมัติ' :
      statusFilter === 'conditional' ? p.summary.decision === 'อนุมัติแบบมีเงื่อนไข' :
      p.summary.decision !== 'อนุมัติ' && p.summary.decision !== 'อนุมัติแบบมีเงื่อนไข';

    return matchesSearch && matchesStatus;
  });

  // Group by program
  const groupedByProgram = programs.map((prog) => {
    const items = filteredProposals.filter((p) => p.programId === prog.id);
    return {
      program: prog,
      proposals: items
    };
  }).filter((group) => group.proposals.length > 0 || statusFilter === 'all');

  const getStatusBadge = (decision: string) => {
    switch (decision) {
      case 'อนุมัติ':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ผ่านเกณฑ์การอนุมัติ
          </span>
        );
      case 'อนุมัติแบบมีเงื่อนไข':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            ผ่านเกณฑ์แบบมีเงื่อนไข
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <Clock className="w-3.5 h-3.5 text-rose-600" />
            ไม่ผ่านเกณฑ์ (ควรปรับปรุง)
          </span>
        );
    }
  };

  const exportToCSV = () => {
    const headers = [
      'แผนงาน',
      'รหัสโครงการ',
      'ชื่อโครงการ',
      'หัวหน้าโครงการ',
      'สังกัด',
      'งบประมาณ (บาท)',
      'ระยะเวลา (เดือน)',
      'สถานะการอนุมัติ',
      'คะแนนรวม (/120)',
      'คะแนนเฉลี่ย (/20)',
      'มติและเหตุผล',
      'ข้อเสนอแนะทุกโครงการ',
      'ข้อควรปรับปรุง'
    ];

    const rows = filteredProposals.map((p) => [
      `"${p.programName.replace(/"/g, '""')}"`,
      `"${p.code}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.leader}"`,
      `"${p.department}"`,
      p.budget,
      p.durationMonths,
      `"${p.summary.decision}"`,
      p.totalScore.toFixed(1),
      p.averageScore.toFixed(2),
      `"${p.summary.decisionRationale.replace(/"/g, '""')}"`,
      `"${p.summary.recommendations.join('; ').replace(/"/g, '""')}"`,
      `"${(p.summary.improvementPoints || []).join('; ').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `รายงานผลการประเมินโครงการวิจัยทุกแผนงาน_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาตามชื่อโครงการ, รหัส, แผนงาน หรือหัวหน้าโครงการ..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status filter pill buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> เกณฑ์อนุมัติ:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทุกสถานะ ({proposals.length})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'approved'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            ผ่านเกณฑ์ ({proposals.filter(p => p.summary.decision === 'อนุมัติ').length})
          </button>
          <button
            onClick={() => setStatusFilter('conditional')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'conditional'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            ผ่านแบบมีเงื่อนไข ({proposals.filter(p => p.summary.decision === 'อนุมัติแบบมีเงื่อนไข').length})
          </button>
          <button
            onClick={() => setStatusFilter('revise')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'revise'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            ไม่ผ่านเกณฑ์ ({proposals.filter(p => p.summary.decision !== 'อนุมัติ' && p.summary.decision !== 'อนุมัติแบบมีเงื่อนไข').length})
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            title="ดาวน์โหลดข้อมูลเป็นไฟล์ Excel/CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            ส่งออก CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors"
            title="พิมพ์รายงานสรุปผู้บริหาร"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            พิมพ์รายงาน
          </button>
        </div>
      </div>

      {/* Grouped Table by Programs */}
      <div className="space-y-8">
        {groupedByProgram.map(({ program, proposals: progProposals }) => (
          <div 
            key={program.id}
            id={`program-section-${program.id}`}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Program Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  {program.code}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">
                      {program.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                      {progProposals.length} โครงการ
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {program.description}
                  </p>
                </div>
              </div>

              {/* Program Folder Link */}
              <div className="flex items-center gap-2">
                <a
                  href="https://drive.google.com/drive/folders/11xDEYXCN6u1mqMywYhZ0QQ7wyNJo-Kk9?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  โฟลเดอร์ Google Drive
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* Proposals List for this Program */}
            {progProposals.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                ไม่มีโครงการในแผนงานนี้ที่ตรงกับเงื่อนไขการค้นหา/ตัวกรอง
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {progProposals.map((proposal) => {
                  const isPassed = proposal.summary.decision === 'อนุมัติ';
                  const isConditional = proposal.summary.decision === 'อนุมัติแบบมีเงื่อนไข';

                  return (
                    <div 
                      key={proposal.id}
                      className="p-5 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        {/* Column 1: Info & Title (5 cols) */}
                        <div className="lg:col-span-4 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              รหัส {proposal.code}
                            </span>
                            {proposal.isContinuousProject && (
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                                <Layers className="w-3 h-3" /> ต่อเนื่อง
                              </span>
                            )}
                            <div>{getStatusBadge(proposal.summary.decision)}</div>
                          </div>

                          <h4 
                            onClick={() => onSelectProposal(proposal)}
                            className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug"
                          >
                            {proposal.title}
                          </h4>

                          <div className="text-xs text-slate-600 space-y-1">
                            <div><strong>หัวหน้า:</strong> {proposal.leader} ({proposal.department})</div>
                            <div className="flex items-center gap-3">
                              <span><strong>งบประมาณ:</strong> {proposal.budget.toLocaleString()} บาท</span>
                              <span><strong>ระยะเวลา:</strong> {proposal.durationMonths} เดือน</span>
                            </div>
                            <div><strong>พื้นที่เป้าหมาย:</strong> {proposal.targetAreas.join(', ')}</div>
                          </div>

                          <div className="pt-1">
                            <button
                              onClick={() => onSelectProposal(proposal)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                              ดูเรดาร์ชาร์ท 6 ด้าน & ผลวิเคราะห์เต็ม
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Column 2: Scores breakdown (3 cols) */}
                        <div className="lg:col-span-3 bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 space-y-2.5">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                              <Award className="w-4 h-4 text-blue-600" /> คะแนนเฉลี่ย
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className={`text-base font-extrabold ${
                                isPassed ? 'text-emerald-700' : isConditional ? 'text-amber-700' : 'text-rose-700'
                              }`}>
                                {proposal.averageScore.toFixed(2)}
                              </span>
                              <span className="text-xs text-slate-400">/ 20</span>
                              <span className="text-[11px] text-slate-500 font-medium ml-1">
                                (รวม {proposal.totalScore.toFixed(1)}/120)
                              </span>
                            </div>
                          </div>

                          {/* 6 criteria scores */}
                          <div className="space-y-1.5 text-[11px]">
                            {proposal.criteriaScores.map((c) => (
                              <div key={c.id} className="flex justify-between items-center text-slate-600">
                                <span className="truncate pr-2">{c.name.replace(/^\d+\.\s*/, '')}</span>
                                <span className="font-bold text-slate-800 shrink-0">{c.score}/20</span>
                              </div>
                            ))}
                          </div>

                          {/* SDGs */}
                          <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-200">
                            {proposal.alignment.sdgs.map(sdg => (
                              <span 
                                key={sdg.id}
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white shadow-2xs"
                                style={{ backgroundColor: sdg.color }}
                                title={`${sdg.code}: ${sdg.nameTh}`}
                              >
                                {sdg.code}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Column 3: Recommendations & Decision (5 cols) */}
                        <div className="lg:col-span-5 space-y-3">
                          {/* Decision Rationale */}
                          <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                            isPassed 
                              ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' 
                              : isConditional 
                              ? 'bg-amber-50/60 border-amber-200 text-amber-950' 
                              : 'bg-rose-50/60 border-rose-200 text-rose-950'
                          }`}>
                            <div className="font-bold mb-1 flex items-center gap-1.5">
                              {isPassed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : isConditional ? (
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                              ) : (
                                <Clock className="w-4 h-4 text-rose-600" />
                              )}
                              มติและเหตุผลการอนุมัติ:
                            </div>
                            <p className="text-slate-700 font-medium">
                              {proposal.summary.decisionRationale}
                            </p>
                          </div>

                          {/* ALL RECOMMENDATIONS LISTED PROMINENTLY */}
                          <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs space-y-2">
                            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-blue-600" />
                              ข้อเสนอแนะในการดำเนินโครงการ:
                            </div>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                              {proposal.summary.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Improvements */}
                            {proposal.summary.improvementPoints && proposal.summary.improvementPoints.length > 0 && (
                              <div className="pt-2 border-t border-slate-100 text-xs">
                                <span className="font-bold text-slate-700">ข้อควรพัฒนา/เงื่อนไข: </span>
                                <span className="text-slate-600">{proposal.summary.improvementPoints.join(' • ')}</span>
                              </div>
                            )}

                            {/* Strengths */}
                            {proposal.summary.strengths && proposal.summary.strengths.length > 0 && (
                              <div className="pt-1.5 text-xs">
                                <span className="font-bold text-emerald-700">จุดเด่น: </span>
                                <span className="text-slate-600">{proposal.summary.strengths.join(' • ')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
