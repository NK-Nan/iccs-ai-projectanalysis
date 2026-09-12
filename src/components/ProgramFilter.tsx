import React from 'react';
import {
  Search,
  SlidersHorizontal,
  FolderOpen,
  ExternalLink,
  GraduationCap,
  Sprout,
  Landmark,
  Compass,
  BookOpen,
  HeartHandshake,
  Users,
  ShieldCheck
} from 'lucide-react';
import { PROGRAMS } from '../data/strategicFrameworks';

interface ProgramFilterProps {
  selectedProgramId: string;
  onSelectProgram: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  decisionFilter: string;
  onDecisionFilterChange: (decision: string) => void;
  sortBy: 'score' | 'code' | 'budget';
  onSortByChange: (sort: 'score' | 'code' | 'budget') => void;
  totalCount: number;
}

const PROGRAM_ICONS: Record<string, React.ReactNode> = {
  'prog-1': <GraduationCap className="w-4 h-4" />,
  'prog-3': <Sprout className="w-4 h-4" />,
  'prog-4': <Landmark className="w-4 h-4" />,
  'prog-6': <Compass className="w-4 h-4" />,
  'prog-7': <BookOpen className="w-4 h-4" />,
  'prog-8': <HeartHandshake className="w-4 h-4" />,
  'prog-9': <Users className="w-4 h-4" />,
  'prog-11': <ShieldCheck className="w-4 h-4" />
};

export const ProgramFilter: React.FC<ProgramFilterProps> = ({
  selectedProgramId,
  onSelectProgram,
  searchQuery,
  onSearchChange,
  decisionFilter,
  onDecisionFilterChange,
  sortBy,
  onSortByChange,
  totalCount
}) => {
  const selectedProgramObj = PROGRAMS.find((p) => p.id === selectedProgramId);

  return (
    <div className="space-y-4 mb-6">
      {/* Program Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onSelectProgram('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
            selectedProgramId === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          ทุกแผนงาน
        </button>

        {PROGRAMS.map((program) => {
          const isSelected = selectedProgramId === program.id;
          return (
            <button
              key={program.id}
              onClick={() => onSelectProgram(program.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {PROGRAM_ICONS[program.id]}
              <span>{program.code}</span>
              <span className="hidden sm:inline font-normal opacity-90">({program.shortName})</span>
            </button>
          );
        })}
      </div>

      {/* Program Context Card (if a single program is selected) */}
      {selectedProgramObj && (
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-blue-900 text-sm">
              {selectedProgramObj.code}: {selectedProgramObj.name}
            </span>
            <p className="text-slate-600 mt-0.5">{selectedProgramObj.description}</p>
          </div>
          <a
            href={`https://drive.google.com/drive/folders/${selectedProgramObj.driveFolderId}?usp=sharing`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 font-medium shrink-0 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            เปิดโฟลเดอร์ {selectedProgramObj.code} ในไดร์ฟ
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      )}

      {/* Search and Filters Toolbar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาชื่อโครงการ, รหัส, หัวหน้าโครงการ, หรือพื้นที่..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-slate-50/50 focus:bg-white"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap justify-end">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">ผลการประเมิน:</span>
            <select
              value={decisionFilter}
              onChange={(e) => onDecisionFilterChange(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">ทั้งหมด</option>
              <option value="อนุมัติ">ผ่านการอนุมัติ</option>
              <option value="อนุมัติแบบมีเงื่อนไข">อนุมัติแบบมีเงื่อนไข</option>
              <option value="ควรปรับปรุงแก้ไขเชิงลึก">ควรปรับปรุงแก้ไข</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="score">เรียงตามคะแนนเฉลี่ย (สูงสุด)</option>
              <option value="code">เรียงตามรหัสโครงการ</option>
              <option value="budget">เรียงตามงบประมาณ (สูงสุด)</option>
            </select>
          </div>

          <div className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-semibold text-xs shrink-0">
            แสดง {totalCount} โครงการ
          </div>
        </div>
      </div>
    </div>
  );
};
