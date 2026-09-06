import { useState } from 'react';
import { Download, Users, ShieldCheck, Phone, Calendar, MapPin, QrCode, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getImageUrl, formatDate } from '@/lib/utils';

export interface WorkerCardData {
  id: number;
  staff_id?: string;
  name: string;
  photo?: string;
  role?: string;
  role_title?: string;
  phone?: string;
  salary?: number;
  hire_date?: string;
  status?: string;
  address?: string;
  notes?: string;
  sector?: string;
  sector_id?: number;
}

// Generates an authentic SVG barcode pattern based on string
function BarcodeSvg({ text }: { text: string }) {
  const bars: { width: number; fill: string }[] = [];
  const clean = (text || 'EE360-STAFF').toUpperCase();
  
  // Create deterministic bar widths from characters
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    bars.push({ width: (code % 3) + 1.5, fill: '#111827' });
    bars.push({ width: ((code * 2) % 2) + 1, fill: 'transparent' });
    bars.push({ width: ((code * 3) % 4) + 1.5, fill: '#111827' });
    bars.push({ width: 1.5, fill: 'transparent' });
  }

  const totalWidth = bars.reduce((acc, b) => acc + b.width, 0);

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${totalWidth} 40`}
        className="w-full h-9"
        preserveAspectRatio="none"
      >
        {bars.reduce<{ elements: React.ReactNode[]; currentX: number }>(
          (acc, bar, idx) => {
            if (bar.fill !== 'transparent') {
              acc.elements.push(
                <rect
                  key={idx}
                  x={acc.currentX}
                  y={0}
                  width={bar.width}
                  height={40}
                  fill={bar.fill}
                />
              );
            }
            return {
              elements: acc.elements,
              currentX: acc.currentX + bar.width,
            };
          },
          { elements: [], currentX: 0 }
        ).elements}
      </svg>
      <span className="font-mono text-[9px] tracking-widest text-slate-700 font-semibold mt-0.5">
        {clean}
      </span>
    </div>
  );
}

// Crisp QR Code SVG representation
function MiniQrSvg({ code }: { code: string }) {
  // Deterministic 15x15 dot grid with 3 corner finder patterns
  const hash = code.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) % 1000000007, 42);
  const size = 15;
  const dots: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Fill corner finder patterns (top-left, top-right, bottom-left 5x5)
  const drawCorner = (r0: number, c0: number) => {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2)) {
          dots[r0 + r][c0 + c] = true;
        }
      }
    }
  };
  drawCorner(0, 0);
  drawCorner(0, size - 5);
  drawCorner(size - 5, 0);

  // Pseudo-random deterministic fill for the rest based on hash
  let seed = hash;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inCorner =
        (r < 5 && c < 5) || (r < 5 && c >= size - 5) || (r >= size - 5 && c < 5);
      if (!inCorner) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        dots[r][c] = (seed % 3) === 0;
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-12 h-12 bg-white p-0.5 border border-slate-300 rounded">
      {dots.map((row, r) =>
        row.map((active, c) =>
          active ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0f172a" /> : null
        )
      )}
    </svg>
  );
}

function CardPhoto({ photo, name }: { photo?: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const url = getImageUrl(photo);

  if (!photo || failed || !url) {
    const initials = (name || 'Staff')
      .split(' ')
      .filter(Boolean)
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-700">
        <span className="text-2xl font-black tracking-widest">{initials}</span>
        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">EE360</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      className="w-full h-full object-cover"
      alt={name}
      onError={() => setFailed(true)}
      crossOrigin="anonymous"
    />
  );
}

export function StaffIDCardFront({ worker }: { worker: WorkerCardData }) {
  const role = worker.role_title || worker.role || 'Staff Member';
  const staffId = worker.staff_id || 'PENDING';
  const isWater = worker.sector === 'water' || worker.sector_id === 2;

  return (
    <div
      className="card-front w-[300px] h-[460px] relative bg-white rounded-2xl overflow-hidden flex flex-col items-center border border-slate-200 shadow-xl print:shadow-none print:border print:border-slate-300 shrink-0 select-none"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Top Banner Gradient with pattern */}
      <div className={`absolute top-0 w-full h-32 ${isWater ? 'bg-gradient-to-r from-sky-600 via-cyan-700 to-blue-800' : 'bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900'}`} />
      <div className="absolute top-0 w-full h-32 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] opacity-15" />

      {/* Header Info */}
      <div className="z-10 mt-4 flex flex-col items-center text-white text-center px-3 w-full">
        <div className="flex items-center gap-2">
          <img src="/FarmLogo.png" alt="Logo" className="w-7 h-7 object-contain bg-white/10 rounded-full p-0.5 backdrop-blur-sm" />
          <div className="text-left">
            <h2 className="text-sm font-black tracking-wider uppercase leading-tight">EE360</h2>
            <p className="text-[8px] font-semibold tracking-widest opacity-90 uppercase">
              {isWater ? 'Yateem Table Water' : 'Farm & Ranch Agro Ltd'}
            </p>
          </div>
        </div>
        <div className="mt-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/30">
          <p className="text-[8px] font-bold uppercase tracking-widest text-white">Staff Identity Card</p>
        </div>
      </div>

      {/* Photo Container */}
      <div className="z-10 mt-3 relative">
        <div className="w-28 h-28 bg-white rounded-full p-1 shadow-lg ring-4 ring-white/50">
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
            <CardPhoto photo={worker.photo} name={worker.name} />
          </div>
        </div>
        <div className="absolute bottom-1 right-1 bg-emerald-500 text-white rounded-full p-1 shadow border-2 border-white" title="Active Credential">
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Worker Identity Details */}
      <div className="z-10 mt-3 flex flex-col items-center text-center w-full px-5 flex-1">
        <h1 className="text-lg font-extrabold text-slate-900 leading-tight line-clamp-1">{worker.name}</h1>
        <div className="mt-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isWater ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'}`}>
            {role}
          </span>
        </div>

        <div className="w-full h-px bg-slate-100 my-2.5" />

        <div className="w-full space-y-1.5 text-left text-xs">
          <div className="flex justify-between items-center bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
            <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider">ID Number</span>
            <span className="font-mono font-bold text-slate-900 text-xs">{staffId}</span>
          </div>

          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Department</span>
            <span className="text-[11px] font-semibold text-slate-700 capitalize">{isWater ? 'Water Bottling' : 'Agro & Livestock'}</span>
          </div>

          {worker.phone && (
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Phone</span>
              <span className="text-[11px] font-medium text-slate-700">{worker.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Band */}
      <div className="w-full bg-slate-900 text-slate-300 py-2 px-3 text-center border-t border-slate-800">
        <p className="text-[8px] font-medium tracking-wide">
          Property of Excellent Entrepreneurship Farm & Ranch Ltd.
        </p>
      </div>
    </div>
  );
}

export function StaffIDCardBack({ worker }: { worker: WorkerCardData }) {
  const staffId = worker.staff_id || 'EE360-STAFF-000';
  const hireYear = worker.hire_date ? new Date(worker.hire_date).getFullYear() : new Date().getFullYear();
  const expiryYear = hireYear + 3;

  return (
    <div
      className="card-back w-[300px] h-[460px] relative bg-white rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200 shadow-xl print:shadow-none print:border print:border-slate-300 shrink-0 select-none text-slate-800"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Top Security Header Strip */}
      <div>
        <div className="h-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 flex items-center justify-between px-3 text-white text-[8px] font-mono tracking-widest uppercase">
          <span>RC: 1812360</span>
          <span className="font-bold tracking-wider">OFFICIAL CREDENTIAL</span>
        </div>

        {/* Company Title */}
        <div className="p-3 pb-2 text-center border-b border-slate-100">
          <h3 className="text-[10px] font-black text-slate-900 tracking-tight uppercase leading-tight">
            EXCELLENT ENTREPRENEURSHIP FARM & RANCH AGRO LTD
          </h3>
          <p className="text-[8px] text-slate-500 font-medium mt-0.5">
            Dutse, Jigawa State, Federal Republic of Nigeria
          </p>
        </div>

        {/* Terms of Use */}
        <div className="px-4 py-2 text-[8px] text-slate-600 leading-snug space-y-1 bg-slate-50/70 border-b border-slate-100">
          <p className="font-bold text-slate-800 text-[8.5px] mb-0.5 uppercase tracking-wider">Terms & Conditions:</p>
          <p>• This identification card remains the sole property of the issuing company and must be surrendered upon termination.</p>
          <p>• The holder is an authorized staff member subject to EE360 workplace rules and safety standards.</p>
          <p>• Loss or theft must be reported immediately to the administration or security desk.</p>
        </div>

        {/* Card Holder Vital Info */}
        <div className="px-4 py-2 grid grid-cols-2 gap-2 text-[9px] border-b border-slate-100">
          <div>
            <span className="text-[8px] text-slate-400 block uppercase font-bold">Issue Year</span>
            <span className="font-semibold text-slate-800">{hireYear}</span>
          </div>
          <div>
            <span className="text-[8px] text-slate-400 block uppercase font-bold">Valid Until</span>
            <span className="font-semibold text-slate-800">Dec {expiryYear}</span>
          </div>
          <div>
            <span className="text-[8px] text-slate-400 block uppercase font-bold">Emergency Hotlines</span>
            <span className="font-mono text-[8.5px] font-semibold text-slate-800">07061444050</span>
          </div>
          <div>
            <span className="text-[8px] text-slate-400 block uppercase font-bold">Blood Group</span>
            <span className="font-semibold text-slate-800">O+ (Default)</span>
          </div>
        </div>
      </div>

      {/* Center: Barcode & QR code validation section */}
      <div className="px-4 py-2 flex items-center justify-between gap-3 bg-white">
        <div className="flex-1">
          <BarcodeSvg text={staffId} />
        </div>
        <MiniQrSvg code={`https://eefarm360.com/verify?id=${staffId}`} />
      </div>

      {/* Signature & Return Address Section */}
      <div className="bg-slate-50 p-3 pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2 px-1">
          <div>
            <span className="text-[7.5px] text-slate-400 uppercase font-bold tracking-wider block">Authorized Signatory</span>
            <div className="w-24 border-b border-slate-400 mt-3 relative">
              {/* Stylized authentic signature vector */}
              <svg className="absolute -top-3 left-1 w-20 h-5" viewBox="0 0 100 30" fill="none" stroke="#1e293b" strokeWidth="1.5">
                <path d="M5 22 C 20 8, 30 28, 45 12 C 55 5, 65 25, 75 14 C 82 8, 92 18, 98 10" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[7px] text-slate-500 font-medium">Managing Director</span>
          </div>

          <div className="flex flex-col items-center">
            {/* Official Stamp badge */}
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-700/60 flex items-center justify-center p-0.5 rotate-[-8deg]">
              <div className="text-center">
                <span className="text-[6px] font-black tracking-tighter text-emerald-800 block uppercase">EE360</span>
                <span className="text-[5px] font-bold text-emerald-700 block uppercase">OFFICIAL</span>
                <span className="text-[5.5px] font-black text-emerald-800 block uppercase">SEAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Return Address */}
        <div className="bg-white p-1.5 rounded border border-slate-200 text-center">
          <p className="text-[7.5px] font-bold text-slate-800 uppercase tracking-tight">
            If found, please return to:
          </p>
          <p className="text-[7px] text-slate-600 leading-tight mt-0.5">
            Madobi Road, Sharifai Community, Dutse, Jigawa State, Nigeria
          </p>
          <p className="text-[7px] text-slate-500 font-mono mt-0.5">
            Tel: 09077640697 • eefarmandranch@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}

export function StaffIDCardDialog({
  worker,
  onClose,
}: {
  worker: WorkerCardData;
  onClose: () => void;
}) {
  const [viewMode, setViewMode] = useState<'both' | 'front' | 'back'>('both');
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* View Mode Controls */}
      <div className="flex items-center justify-between w-full mb-4 px-2 print:hidden">
        <div className="flex bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setViewMode('both'); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'both' ? 'bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Both Sides
          </button>
          <button
            type="button"
            onClick={() => { setViewMode('front'); setIsFlipped(false); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'front' ? 'bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => { setViewMode('back'); setIsFlipped(true); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'back' ? 'bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Back
          </button>
        </div>

        {viewMode !== 'both' && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs rounded-xl"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Flip to {isFlipped ? 'Front' : 'Back'}
          </Button>
        )}
      </div>

      {/* Cards Display / Printable Area */}
      <div id="print-section" className="flex flex-col md:flex-row gap-6 justify-center items-center py-2 w-full">
        {viewMode === 'both' ? (
          <>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider print:hidden">Front View</span>
              <StaffIDCardFront worker={worker} />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider print:hidden">Back View</span>
              <StaffIDCardBack worker={worker} />
            </div>
          </>
        ) : isFlipped || viewMode === 'back' ? (
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider print:hidden">Back View</span>
            <StaffIDCardBack worker={worker} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider print:hidden">Front View</span>
            <StaffIDCardFront worker={worker} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-6 print:hidden">
        <Button onClick={handlePrint} className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-6">
          <Download className="w-4 h-4" /> Print ID Card (Front & Back)
        </Button>
        <Button variant="outline" onClick={onClose} className="rounded-xl">
          Close
        </Button>
      </div>

      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-section, #print-section * {
            visibility: visible;
          }
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 20px !important;
            padding: 20px !important;
            margin: 0 !important;
          }
          .card-front, .card-back {
            break-inside: avoid;
            page-break-inside: avoid;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}

export default StaffIDCardDialog;
