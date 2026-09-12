import React, { useState, useMemo } from 'react';
import { ResearchProposal, ProgramId } from './types';
import { INITIAL_PROPOSALS } from './data/proposalsData';
import { PROGRAMS } from './data/strategicFrameworks';
import { Navbar } from './components/Navbar';
import { OverviewAnalytics } from './components/OverviewAnalytics';
import { ProgramFilter } from './components/ProgramFilter';
import { ProposalCard } from './components/ProposalCard';
import { AllProgramsTableView } from './components/AllProgramsTableView';
import { ProposalDetailModal } from './components/ProposalDetailModal';
import { NewEvaluationModal } from './components/NewEvaluationModal';
import { ComparisonModal } from './components/ComparisonModal';
import { ReferenceDocumentsModal } from './components/ReferenceDocumentsModal';
import { Sparkles, Layers, FolderOpen, AlertCircle, LayoutGrid, Table, ListTree } from 'lucide-react';

export default function App() {
  const [proposals, setProposals] = useState<ResearchProposal[]>(INITIAL_PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState<ResearchProposal | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grouped' | 'table' | 'cards'>('grouped');

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isRefModalOpen, setIsRefModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isLoadingEvaluation, setIsLoadingEvaluation] = useState(false);
  const [isReEvaluating, setIsReEvaluating] = useState(false);

  // Filters & Sorting
  const [selectedProgramId, setSelectedProgramId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'code' | 'budget'>('score');

  // Filtered & Sorted proposals
  const filteredProposals = useMemo(() => {
    return proposals
      .filter((p) => {
        // Program filter
        if (selectedProgramId !== 'all' && p.programId !== selectedProgramId) {
          return false;
        }
        // Decision filter
        if (decisionFilter !== 'all' && p.summary.decision !== decisionFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchLeader = p.leader.toLowerCase().includes(q);
          const matchCode = p.code.toLowerCase().includes(q);
          const matchAreas = p.targetAreas.some((a) => a.toLowerCase().includes(q));
          const matchProg = p.programName.toLowerCase().includes(q);
          if (!matchTitle && !matchLeader && !matchCode && !matchAreas && !matchProg) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          return b.averageScore - a.averageScore;
        }
        if (sortBy === 'budget') {
          return b.budget - a.budget;
        }
        return a.code.localeCompare(b.code, undefined, { numeric: true });
      });
  }, [proposals, selectedProgramId, decisionFilter, searchQuery, sortBy]);

  // Comparison Handlers
  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        alert('สามารถเปรียบเทียบได้สูงสุดครั้งละ 4 โครงการ');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleRemoveCompare = (id: string) => {
    setCompareIds((prev) => prev.filter((item) => item !== id));
  };

  const comparedProposals = useMemo(() => {
    return proposals.filter((p) => compareIds.includes(p.id));
  }, [proposals, compareIds]);

  // API Submission for New Proposal Evaluation
  const handleEvaluateNewProposal = async (
    proposalData: Partial<ResearchProposal>,
    rawContent?: string
  ) => {
    setIsLoadingEvaluation(true);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...proposalData,
          rawContent
        })
      });

      if (!response.ok) {
        throw new Error(`การวิเคราะห์ล้มเหลว (${response.status})`);
      }

      const evalResult = await response.json();

      const newProposal: ResearchProposal = {
        id: `prop-custom-${Date.now()}`,
        programId: (proposalData.programId as ProgramId) || 'prog-7',
        programName: proposalData.programName || 'แผนงานที่ 7 ยุทธศาสตร์พัฒนาคุณภาพการศึกษา',
        code: `${proposalData.programId ? proposalData.programId.replace('prog-', '') : '7'}.N${proposals.length + 1}`,
        title: proposalData.title || 'ข้อเสนอโครงการวิจัยใหม่',
        leader: proposalData.leader || 'อาจารย์นักวิจัย วชช.น่าน',
        department: proposalData.department || 'วิทยาลัยชุมชนน่าน',
        budget: proposalData.budget || 300000,
        durationMonths: proposalData.durationMonths || 10,
        isContinuousProject: !!proposalData.isContinuousProject,
        abstract: proposalData.abstract || '',
        objectives: proposalData.objectives || [],
        targetAreas: proposalData.targetAreas || ['อ.เมืองน่าน'],
        targetBeneficiaries: proposalData.targetBeneficiaries || 'ประชาชนในจังหวัดน่าน',
        expectedOutputs: proposalData.expectedOutputs || [],
        fileName: proposalData.fileName,
        isEvaluated: true,
        totalScore: evalResult.totalScore || 105,
        averageScore: evalResult.averageScore || 17.5,
        criteriaScores: evalResult.criteriaScores || [],
        alignment: evalResult.alignment,
        summary: evalResult.summary
      };

      setProposals((prev) => [newProposal, ...prev]);
      setIsNewModalOpen(false);
      setSelectedProposal(newProposal);
    } catch (error: any) {
      console.error('Evaluation error:', error);
      alert('เกิดข้อผิดพลาดในการประเมินด้วย AI: ' + error.message);
    } finally {
      setIsLoadingEvaluation(false);
    }
  };

  // Re-evaluation Handler
  const handleReEvaluate = async (proposal: ResearchProposal) => {
    setIsReEvaluating(true);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: proposal.title,
          programId: proposal.programId,
          programName: proposal.programName,
          leader: proposal.leader,
          department: proposal.department,
          budget: proposal.budget,
          durationMonths: proposal.durationMonths,
          isContinuousProject: proposal.isContinuousProject,
          abstract: proposal.abstract,
          objectives: proposal.objectives,
          targetAreas: proposal.targetAreas,
          targetBeneficiaries: proposal.targetBeneficiaries,
          expectedOutputs: proposal.expectedOutputs
        })
      });

      if (!response.ok) {
        throw new Error('ไม่สามารถประเมินซ้ำได้');
      }

      const evalResult = await response.json();

      const updated: ResearchProposal = {
        ...proposal,
        totalScore: evalResult.totalScore,
        averageScore: evalResult.averageScore,
        criteriaScores: evalResult.criteriaScores,
        alignment: evalResult.alignment,
        summary: evalResult.summary
      };

      setProposals((prev) => prev.map((p) => (p.id === proposal.id ? updated : p)));
      setSelectedProposal(updated);
    } catch (err: any) {
      alert('ไม่สามารถประเมินซ้ำได้: ' + err.message);
    } finally {
      setIsReEvaluating(false);
    }
  };

  // Grouped proposals for grouped view mode
  const groupedPrograms = useMemo(() => {
    return PROGRAMS.map((prog) => ({
      program: prog,
      items: filteredProposals.filter((p) => p.programId === prog.id)
    })).filter((g) => g.items.length > 0 || selectedProgramId === g.program.id);
  }, [filteredProposals, selectedProgramId]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Navigation */}
      <Navbar
        compareCount={compareIds.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        onOpenRefModal={() => setIsRefModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Institutional Analytics & Overview Banner */}
        <OverviewAnalytics
          proposals={proposals}
          onOpenNewModal={() => setIsNewModalOpen(true)}
          onOpenRefModal={() => setIsRefModalOpen(true)}
        />

        {/* View Mode & Presentation Mode Selector */}
        <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 ml-1">รูปแบบการแสดงผล:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('grouped')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'grouped'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ListTree className="w-3.5 h-3.5 text-blue-600" />
                แสดงแยกตามแผนงาน ({PROGRAMS.length} แผนงาน)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5 text-blue-600" />
                ตารางสรุปผล & ข้อเสนอแนะทุกโครงการ
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
                การ์ดทั้งหมด
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            รวมโครงการทั้งหมด: <strong className="text-blue-700">{proposals.length}</strong> โครงการ | ผ่านเกณฑ์: <strong className="text-emerald-600">{proposals.filter(p => p.summary.decision === 'อนุมัติ').length}</strong> | เงื่อนไข: <strong className="text-amber-600">{proposals.filter(p => p.summary.decision === 'อนุมัติแบบมีเงื่อนไข').length}</strong> | ควรปรับปรุง: <strong className="text-rose-600">{proposals.filter(p => p.summary.decision !== 'อนุมัติ' && p.summary.decision !== 'อนุมัติแบบมีเงื่อนไข').length}</strong>
          </div>
        </div>

        {/* Filters and Controls */}
        {viewMode !== 'table' && (
          <ProgramFilter
            selectedProgramId={selectedProgramId}
            onSelectProgram={setSelectedProgramId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            decisionFilter={decisionFilter}
            onDecisionFilterChange={setDecisionFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            totalCount={filteredProposals.length}
          />
        )}

        {/* VIEW 1: Table View */}
        {viewMode === 'table' ? (
          <AllProgramsTableView
            proposals={proposals}
            programs={PROGRAMS}
            onSelectProposal={(p) => setSelectedProposal(p)}
          />
        ) : viewMode === 'grouped' ? (
          /* VIEW 2: Grouped by Program View */
          <div className="space-y-10">
            {groupedPrograms.length > 0 ? (
              groupedPrograms.map(({ program, items }) => (
                <section
                  key={program.id}
                  id={`program-group-${program.id}`}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
                >
                  {/* Program Header */}
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50/40 border-b border-slate-200 px-6 py-4.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {program.code.replace('แผนงานที่ ', '')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h2 className="text-base font-bold text-slate-900">
                            {program.name}
                          </h2>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                            {items.length} โครงการ
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                          {program.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="https://drive.google.com/drive/folders/11xDEYXCN6u1mqMywYhZ0QQ7wyNJo-Kk9?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors shadow-2xs"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        เปิดโฟลเดอร์โครงการ (Drive)
                      </a>
                    </div>
                  </div>

                  {/* Program Content */}
                  <div className="p-6">
                    {items.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((proposal) => (
                          <ProposalCard
                            key={proposal.id}
                            proposal={proposal}
                            onSelect={(p) => setSelectedProposal(p)}
                            isSelectedForCompare={compareIds.includes(proposal.id)}
                            onToggleCompare={handleToggleCompare}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-xs text-slate-400">
                        ไม่มีโครงการในแผนงานนี้ที่ตรงกับตัวกรองที่เลือก
                      </div>
                    )}
                  </div>
                </section>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  ไม่พบข้อเสนอโครงการที่ตรงกับเงื่อนไขการค้นหา
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรองผลการประเมินเป็น "ทั้งหมด"
                </p>
                <button
                  onClick={() => {
                    setSelectedProgramId('all');
                    setDecisionFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            )}
          </div>
        ) : (
          /* VIEW 3: Standard Cards Grid */
          filteredProposals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onSelect={(p) => setSelectedProposal(p)}
                  isSelectedForCompare={compareIds.includes(proposal.id)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                ไม่พบข้อเสนอโครงการที่ตรงกับเงื่อนไขการค้นหา
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรองผลการประเมินเป็น "ทั้งหมด"
              </p>
              <button
                onClick={() => {
                  setSelectedProgramId('all');
                  setDecisionFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              วิทยาลัยชุมชนน่าน สถาบันวิทยาลัยชุมชน
            </span>
            <span>•</span>
            <span>ระบบ AI ตรวจสอบข้อเสนอโครงการวิจัยและบริการวิชาการ</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://drive.google.com/drive/folders/11xDEYXCN6u1mqMywYhZ0QQ7wyNJo-Kk9?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              ไดร์ฟโครงการ
            </a>
            <a
              href="https://drive.google.com/drive/folders/1dOLal-zD-dwHlzeuOCK8Ah8TuDucbmct?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              ไดร์ฟเอกสารอ้างอิง
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedProposal && (
        <ProposalDetailModal
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          onReEvaluate={handleReEvaluate}
          isReEvaluating={isReEvaluating}
        />
      )}

      {isNewModalOpen && (
        <NewEvaluationModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          onSubmit={handleEvaluateNewProposal}
          isLoading={isLoadingEvaluation}
        />
      )}

      {isCompareModalOpen && (
        <ComparisonModal
          proposals={comparedProposals}
          onClose={() => setIsCompareModalOpen(false)}
          onRemove={handleRemoveCompare}
        />
      )}

      {isRefModalOpen && (
        <ReferenceDocumentsModal
          isOpen={isRefModalOpen}
          onClose={() => setIsRefModalOpen(false)}
        />
      )}
    </div>
  );
}
