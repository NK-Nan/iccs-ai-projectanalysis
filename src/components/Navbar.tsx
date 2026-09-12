import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Layers,
  ExternalLink,
  BookOpen,
  Plus
} from 'lucide-react';

interface NavbarProps {
  compareCount: number;
  onOpenCompare: () => void;
  onOpenNewModal: () => void;
  onOpenRefModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  compareCount,
  onOpenCompare,
  onOpenNewModal,
  onOpenRefModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  ระบบ AI ตรวจสอบข้อเสนอโครงการวิจัย
                </span>
                <span className="hidden md:inline px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  วชช.น่าน
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                วิทยาลัยชุมชนน่าน สถาบันวิทยาลัยชุมชน
              </p>
            </div>
          </div>

          {/* Quick Nav & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenRefModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">เกณฑ์และเอกสารอ้างอิง</span>
            </button>

            {/* Compare Button */}
            {compareCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors animate-pulse"
              >
                <Layers className="w-4 h-4 text-purple-600" />
                <span>เปรียบเทียบ ({compareCount})</span>
              </button>
            )}

            {/* New Proposal Evaluation Button */}
            <button
              onClick={onOpenNewModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">ประเมินโครงการด้วย AI</span>
              <span className="sm:hidden">ส่งประเมิน</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
