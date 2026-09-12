import React, { useState } from 'react';
import {
  X,
  BookOpen,
  FileText,
  ExternalLink,
  Target,
  Award,
  Globe,
  Map,
  Compass,
  CheckCircle2,
  FolderKanban
} from 'lucide-react';
import {
  REFERENCE_DOCUMENTS,
  EVALUATION_CRITERIA_DEFINITIONS,
  SDG_LIST,
  NAN_PLAN_STRATEGIES,
  EXCELLENCE_PILLARS,
  IDENTITY_FOCUS_AREAS
} from '../data/strategicFrameworks';

interface ReferenceDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceDocumentsModal: React.FC<ReferenceDocumentsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedSection, setSelectedSection] = useState<
    'vision' | 'focus' | 'excellence' | 'nan' | 'sdg' | 'criteria'
  >('vision');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        id="modal-reference-documents"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
      >
        {/* Header */}
        <div className="p-5 sm:px-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                เอกสารอ้างอิงและเกณฑ์การประเมินข้อเสนอโครงการวิจัย
              </h2>
              <p className="text-xs text-slate-500">
                เอกสารและกรอบยุทธศาสตร์อ้างอิงจาก Google Drive วชช.น่าน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://drive.google.com/drive/folders/1dOLal-zD-dwHlzeuOCK8Ah8TuDucbmct?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              เปิดโฟลเดอร์ไดร์ฟอ้างอิง
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Sidebar & Content Layout */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar Nav */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/70 p-3 space-y-1 shrink-0 overflow-y-auto">
            <button
              onClick={() => setSelectedSection('vision')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                selectedSection === 'vision'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              1. ปรัชญาและวิสัยทัศน์ วชช.น่าน
            </button>

            <button
              onClick={() => setSelectedSection('focus')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                selectedSection === 'focus'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Target className="w-4 h-4 shrink-0" />
              2. จุดเน้นวิทยาลัยชุมชนตามอัตลักษณ์
            </button>

            <button
              onClick={() => setSelectedSection('excellence')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                selectedSection === 'excellence'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              3. แผนพัฒนาความเป็นเลิศสถาบัน (5 ปี)
            </button>

            <button
              onClick={() => setSelectedSection('nan')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                selectedSection === 'nan'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Map className="w-4 h-4 shrink-0" />
              4. แผนพัฒนาจังหวัดน่าน 2566-2570
            </button>

            <button
              onClick={() => setSelectedSection('sdg')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                selectedSection === 'sdg'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Globe className="w-4 h-4 shrink-0" />
              5. เป้าหมายการพัฒนาที่ยั่งยืน (SDGs)
            </button>

            <button
              onClick={() => setSelectedSection('criteria')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                selectedSection === 'criteria'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              6. เกณฑ์การประเมิน 6 ด้าน (เต็ม 20)
            </button>
          </div>

          {/* Main Display Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-white">
            {/* SECTION 1: VISION */}
            {selectedSection === 'vision' && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-blue-600" />
                    ปรัชญา วิสัยทัศน์ พันธกิจ อัตลักษณ์ และเอกลักษณ์ วิทยาลัยชุมชนน่าน
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    อ้างอิงเอกสาร: 3.ปรัชญาวิสัยทัศน์(1).docx
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
                      ปรัชญา (Philosophy)
                    </span>
                    <p className="text-sm font-semibold text-slate-900 leading-snug">
                      "ส่งเสริมการเรียนรู้ตลอดชีวิต เพื่อความเข้มแข็งของท้องถิ่นและชุมชน"
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                      วิสัยทัศน์ (Vision)
                    </span>
                    <p className="text-sm font-semibold text-slate-900 leading-snug">
                      "ปลุกการเรียนรู้และพลังพหุปัญญา เพื่อความเข้มแข็งของชุมชน"
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block mb-1">
                      อัตลักษณ์ (Identity)
                    </span>
                    <p className="text-sm font-semibold text-slate-900 leading-snug">
                      "ร่วมจัดการเรียนรู้พื้นถิ่นน่าน ก้าวทันการเปลี่ยนแปลง"
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                      เอกลักษณ์ (Uniqueness)
                    </span>
                    <p className="text-sm font-semibold text-slate-900 leading-snug">
                      "สถาบันการเรียนรู้พื้นถิ่นน่าน"
                    </p>
                  </div>
                </div>

                {/* Core Values */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">
                    ค่านิยมหลักขององค์กร (Core Values)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="font-bold text-blue-700 block">L - Life</span>
                      <span className="text-slate-600">ยึดมั่นในวิถีชีวิต ชุมชน และภูมิปัญญาท้องถิ่น</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="font-bold text-blue-700 block">L - Long</span>
                      <span className="text-slate-600">ความต่อเนื่อง ยั่งยืน และพัฒนาก้าวหน้า</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="font-bold text-blue-700 block">L - Learning</span>
                      <span className="text-slate-600">การเรียนรู้ตลอดชีวิตและการแบ่งปันองค์ความรู้</span>
                    </div>
                  </div>
                </div>

                {/* 5 Missions */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2">
                    พันธกิจ 5 ประการ (Missions)
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {[
                      '1. จัดการศึกษาเพื่อพัฒนาชุมชนและตอบสนองความต้องการของท้องถิ่น',
                      '2. สร้างสรรค์งานวิจัยและนวัตกรรมเพื่อการพัฒนาเชิงพื้นที่และยกระดับเศรษฐกิจฐานราก',
                      '3. ให้บริการวิชาการและประสานความร่วมมือกับภาคีเครือข่ายทุกภาคส่วน',
                      '4. ทำนุบำรุง สืบสาน ศาสนา ศิลปวัฒนธรรม และภูมิปัญญาท้องถิ่นสู่เศรษฐกิจสร้างสรรค์',
                      '5. บริหารจัดการองค์กรมุ่งสู่ความเป็นเลิศด้วยหลักธรรมาภิบาลและการเปลี่ยนแปลง'
                    ].map((m, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: IDENTITY FOCUS AREAS */}
            {selectedSection === 'focus' && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    จุดเน้นวิทยาลัยชุมชนตามอัตลักษณ์ 5 ด้าน
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    อ้างอิงเอกสาร: focus.png (ลำดับความสำคัญจุดเน้น วชช.น่าน)
                  </p>
                </div>

                <div className="space-y-3">
                  {IDENTITY_FOCUS_AREAS.map((item, index) => (
                    <div key={index} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{item}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {index === 0 && 'ส่งเสริมทุนทางวัฒนธรรม ประวัติศาสตร์ล้านนาตะวันออก ชาติพันธุ์ และภูมิปัญญาพื้นถิ่นน่านสู่งานหัตถกรรมและการท่องเที่ยวสร้างสรรค์'}
                          {index === 1 && 'เปิดโอกาสทางการศึกษา พัฒนาระบบสัมฤทธิบัตร คลังหน่วยกิต (Credit Bank) และการพัฒนาทักษะอาชีพแก่ประชาชนทุกช่วงวัย'}
                          {index === 2 && 'ลดความเหลื่อมล้ำ สนับสนุนเด็กปฐมวัย ผู้สูงอายุ ผู้พิการ กลุ่มชาติพันธุ์ และผู้มีรายได้น้อยในพื้นที่ห่างไกล'}
                          {index === 3 && 'ขับเคลื่อนเศรษฐกิจชีวภาพ-หมุนเวียน-สีเขียว เกษตรปลอดภัย ฟื้นฟูป่าต้นน้ำน่าน และการเป็นวิทยาลัยชุมชนสีเขียว (Green Campus)'}
                          {index === 4 && 'พัฒนาบุคลากร ผู้นำชุมชน และเยาวชนให้เป็นผู้นำแห่งการเปลี่ยนแปลง (Change Agent) ขับเคลื่อนชุมชนด้วยหลักธรรมาภิบาล'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 3: EXCELLENCE PLAN */}
            {selectedSection === 'excellence' && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    แผนพัฒนาความเป็นเลิศสถาบันวิทยาลัยชุมชน (5 เสาหลัก)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    อ้างอิงเอกสาร: excellence.png (กรอบแผน 5 ปี สถาบันวิทยาลัยชุมชน)
                  </p>
                </div>

                <div className="space-y-3">
                  {EXCELLENCE_PILLARS.map((pillar, i) => (
                    <div key={i} className="p-4 rounded-xl bg-purple-50/40 border border-purple-200">
                      <h4 className="text-xs font-bold text-purple-900">{pillar}</h4>
                      <div className="text-[11px] text-purple-700 mt-1">
                        เกณฑ์ค่าเฉลี่ยมาตรฐานสถาบันในการประเมิน: 16.0 คะแนน (เต็ม 20)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: NAN PROVINCIAL PLAN */}
            {selectedSection === 'nan' && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Map className="w-5 h-5 text-amber-600" />
                    แผนพัฒนาจังหวัดน่าน 2566-2570 (ฉบับทบทวน 2570)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    อ้างอิงเอกสาร: แผนพัฒนาจังหวัดน่าน เล่มที่ 1 และเล่มที่ 2
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                  วิสัยทัศน์จังหวัดน่าน: "น่าน เมืองแห่งความสุข เศรษฐกิจสร้างสรรค์ บนฐานธรรมชาติและวัฒนธรรมที่ยั่งยืน"
                </div>

                <div className="space-y-2.5">
                  {NAN_PLAN_STRATEGIES.map((strat, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200 text-xs">
                      <span className="font-bold text-slate-800 block mb-0.5">{strat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 5: SDGs */}
            {selectedSection === 'sdg' && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-600" />
                    เป้าหมายการพัฒนาที่ยั่งยืนแห่งสหประชาชาติ (SDGs 1-17)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SDG_LIST.map((sdg) => (
                    <div
                      key={sdg.id}
                      className="p-2.5 rounded-lg border border-slate-200 flex items-center gap-3 bg-white"
                    >
                      <div
                        className="w-10 h-10 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: sdg.color }}
                      >
                        {sdg.id}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{sdg.code}</span>
                        <span className="text-[11px] text-slate-600 leading-tight">{sdg.nameTh}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 6: 6 CRITERIA */}
            {selectedSection === 'criteria' && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    เกณฑ์การประเมิน 6 ประเด็น (คะแนนเต็มด้านละ 20 รวม 120)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    เกณฑ์ที่ใช้ในการสร้างกราฟเปรียบเทียบในรูปแบบเรดาร์ชาร์ท (Radar Chart)
                  </p>
                </div>

                <div className="space-y-3">
                  {EVALUATION_CRITERIA_DEFINITIONS.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-bold text-slate-800">{c.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            คะแนนเต็ม {c.maxScore}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            (เกณฑ์เฉลี่ยสถาบัน {c.benchmarkAvg})
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
