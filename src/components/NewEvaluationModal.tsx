import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { ProgramId, ResearchProposal } from '../types';
import { PROGRAMS } from '../data/strategicFrameworks';

interface NewEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proposalData: Partial<ResearchProposal>, rawContent?: string) => Promise<void>;
  isLoading: boolean;
}

export const NewEvaluationModal: React.FC<NewEvaluationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'form'>('upload');
  
  // Form State
  const [title, setTitle] = useState('');
  const [programId, setProgramId] = useState<ProgramId>('prog-7');
  const [leader, setLeader] = useState('');
  const [department, setDepartment] = useState('');
  const [budget, setBudget] = useState<number>(300000);
  const [durationMonths, setDurationMonths] = useState<number>(10);
  const [isContinuousProject, setIsContinuousProject] = useState(false);
  const [abstract, setAbstract] = useState('');
  const [objectives, setObjectives] = useState('');
  const [targetAreas, setTargetAreas] = useState('อ.เมืองน่าน, อ.ภูเพียง');
  const [targetBeneficiaries, setTargetBeneficiaries] = useState('กลุ่มเกษตรกรและประชาชนในพื้นที่');
  const [expectedOutputs, setExpectedOutputs] = useState('');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileExtracting, setFileExtracting] = useState(false);
  const [extractedSnippet, setExtractedSnippet] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setErrorMsg('');
      setFileExtracting(true);

      const formData = new FormData();
      formData.append('proposalFile', file);

      try {
        const res = await fetch('/api/analyze-file', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          throw new Error('ไม่สามารถอ่านเนื้อหาไฟล์ได้');
        }

        const data = await res.json();
        if (data.suggestedTitle && !title) {
          setTitle(data.suggestedTitle);
        }
        setExtractedSnippet(data.extractedContent || '');
      } catch (err: any) {
        setErrorMsg('ไม่สามารถถอดข้อความจากไฟล์ได้ กรุณาลองกรอกแบบฟอร์มหรือระบุบทคัดย่อ');
      } finally {
        setFileExtracting(false);
      }
    }
  };

  const handleStartEvaluation = async () => {
    if (!title && !extractedSnippet) {
      setErrorMsg('กรุณาระบุชื่อโครงการ หรืออัปโหลดไฟล์ข้อเสนอโครงการ');
      return;
    }

    const selectedProg = PROGRAMS.find(p => p.id === programId);
    const objectivesArray = objectives
      .split('\n')
      .map(o => o.trim())
      .filter(Boolean);

    const outputsArray = expectedOutputs
      .split('\n')
      .map(o => o.trim())
      .filter(Boolean);

    const areasArray = targetAreas
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    const proposalData: Partial<ResearchProposal> = {
      title: title || selectedFile?.name.replace(/\.[^/.]+$/, '') || 'โครงการวิจัยใหม่',
      programId: programId,
      programName: selectedProg ? `${selectedProg.code} ${selectedProg.name}` : 'แผนงานที่ 7',
      leader: leader || 'อาจารย์นักวิจัย วชช.น่าน',
      department: department || 'วิทยาลัยชุมชนน่าน',
      budget: Number(budget) || 300000,
      durationMonths: Number(durationMonths) || 10,
      isContinuousProject: isContinuousProject,
      abstract: abstract || (extractedSnippet ? extractedSnippet.slice(0, 500) + '...' : 'โครงการวิจัยเพื่อชุมชนน่าน'),
      objectives: objectivesArray.length > 0 ? objectivesArray : ['เพื่อพัฒนาศักยภาพชุมชนในพื้นที่จังหวัดน่าน'],
      targetAreas: areasArray.length > 0 ? areasArray : ['อ.เมืองน่าน'],
      targetBeneficiaries: targetBeneficiaries || 'ประชาชนและชุมชนในจังหวัดน่าน',
      expectedOutputs: outputsArray.length > 0 ? outputsArray : ['ผลสัมฤทธิ์และผลิตภัณฑ์ชุมชน 1 รายการ'],
      fileName: selectedFile?.name
    };

    await onSubmit(proposalData, extractedSnippet);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        id="modal-new-evaluation"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden text-slate-800"
      >
        {/* Header */}
        <div className="p-5 sm:px-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                ส่งข้อเสนอโครงการวิจัยเพื่อประเมินด้วย AI
              </h2>
              <p className="text-xs text-slate-500">
                วิเคราะห์ความสอดคล้องตามปรัชญาวิสัยทัศน์, SDG, แผนพัฒนาน่าน, แผนความเป็นเลิศ และจุดเน้น 5 ด้าน
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 border-b border-slate-200 bg-white flex gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            อัปโหลดไฟล์ข้อเสนอโครงการ (PDF/DOCX/TXT)
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'form'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            กรอกข้อมูลรายละเอียดโครงการ
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">
                    {selectedFile ? selectedFile.name : 'ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm">
                    รองรับไฟล์ PDF, Word (.docx), หรือไฟล์ข้อความ (.txt) จาก Google Drive หรือเครื่องของคุณ
                  </p>
                  {selectedFile && (
                    <span className="mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      เลือกไฟล์แล้ว ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  )}
                </div>
              </div>

              {fileExtracting && (
                <div className="p-3 rounded-xl bg-blue-50 text-blue-700 text-xs flex items-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                  กำลังดึงข้อความจากเอกสารข้อเสนอโครงการ...
                </div>
              )}

              {extractedSnippet && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700">ข้อความที่ดึงได้จากเอกสาร (ตัวอย่าง):</span>
                    <span className="text-[11px] text-slate-500">{extractedSnippet.length} ตัวอักษร</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed font-mono bg-white p-2.5 rounded border border-slate-200">
                    {extractedSnippet}
                  </p>
                </div>
              )}

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อโครงการวิจัย
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น โครงการส่งเสริมและยกระดับ..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    สังกัดแผนงาน
                  </label>
                  <select
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value as ProgramId)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    {PROGRAMS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} - {p.shortName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FULL FORM */}
          {activeTab === 'form' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อโครงการวิจัย *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น โครงการพัฒนาศูนย์เรียนรู้ชุมชนต้นแบบ..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    สังกัดแผนงาน *
                  </label>
                  <select
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value as ProgramId)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {PROGRAMS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    หัวหน้าโครงการ
                  </label>
                  <input
                    type="text"
                    value={leader}
                    onChange={(e) => setLeader(e.target.value)}
                    placeholder="เช่น อ.ดร.สมชาย ใจดี"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    งบประมาณเสนอขอ (บาท)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isContinuousProject}
                      onChange={(e) => setIsContinuousProject(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-slate-300"
                    />
                    เป็นโครงการต่อเนื่อง (มีพัฒนาการจากระยะเดิม)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  บทคัดย่อ / สาระสำคัญของโครงการ
                </label>
                <textarea
                  rows={3}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="ระบุที่มา ความสำคัญ สภาพปัญหา และแนวทางการแก้ปัญหาในพื้นที่จังหวัดน่าน..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  วัตถุประสงค์ของโครงการ (บรรทัดละ 1 ข้อ)
                </label>
                <textarea
                  rows={3}
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="1. เพื่อพัฒนา...&#10;2. เพื่อยกระดับ...&#10;3. เพื่อประเมิน..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    พื้นที่เป้าหมาย (คั่นด้วยเครื่องหมายจุลภาค)
                  </label>
                  <input
                    type="text"
                    value={targetAreas}
                    onChange={(e) => setTargetAreas(e.target.value)}
                    placeholder="อ.เมืองน่าน, อ.เวียงสา, อ.ปัว"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    กลุ่มเป้าหมาย / ผู้รับประโยชน์
                  </label>
                  <input
                    type="text"
                    value={targetBeneficiaries}
                    onChange={(e) => setTargetBeneficiaries(e.target.value)}
                    placeholder="กลุ่มเกษตรกร 50 ราย และประชาชนในพื้นที่"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ผลผลิตและผลลัพธ์ที่คาดว่าจะได้รับ (Outputs/Outcomes)
                </label>
                <textarea
                  rows={2}
                  value={expectedOutputs}
                  onChange={(e) => setExpectedOutputs(e.target.value)}
                  placeholder="- หลักสูตรชุมชน 1 หลักสูตร&#10;- กลุ่มเป้าหมายมีรายได้เพิ่มขึ้น 20%"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-600" />
            ระบบจะอ้างอิงเอกสารแผนยุทธศาสตร์ วชช.น่าน และ SDGs ในการประเมิน
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              ยกเลิก
            </button>

            <button
              onClick={handleStartEvaluation}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  กำลังประเมินด้วย Gemini AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  เริ่มการวิเคราะห์ด้วย AI
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
