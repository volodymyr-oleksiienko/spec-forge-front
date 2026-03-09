import { AlertTriangle, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import type { Warning } from '@/features/artifacts-sync';

export const DiagnosticsConsole = () => {
  const { control } = useFormContext<{ warnings: Warning[] }>();
  const warnings = useWatch({ control, name: 'warnings' }) || [];

  if (warnings.length === 0) return null;

  return <DiagnosticsConsoleContent warnings={warnings} />;
};

const DiagnosticsConsoleContent = ({ warnings }: { warnings: Warning[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`
        w-full 
        bg-base-100 border-x border-t border-base-300 shadow-2xl rounded-t-2xl 
        transition-all duration-300 ease-in-out
        ${isOpen ? 'h-64' : 'h-11'}
      `}
    >
      <div
        className="flex items-center justify-between px-5 h-11 cursor-pointer bg-base-200/30 hover:bg-base-200/60 rounded-t-2xl transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-warning/10 rounded-lg">
            <AlertTriangle size={14} className="text-warning" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50 leading-none">
              System Diagnostics
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold">Issues Found</span>
              <span className="badge badge-warning badge-sm font-bold text-[10px] h-4">
                {warnings.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] opacity-40 font-bold uppercase tracking-tighter hidden sm:inline">
            {isOpen ? 'Close Console' : 'Open Console'}
          </span>
          <div
            className={`p-1 rounded-md transition-colors ${isOpen ? 'bg-base-300' : 'hover:bg-base-300'}`}
          >
            {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </div>
        </div>
      </div>

      <div className={`overflow-y-auto bg-base-100 ${isOpen ? 'h-[200px]' : 'h-0'}`}>
        <div className="p-4 space-y-2">
          {warnings.map((w, i) => (
            <div
              key={i}
              className="flex gap-4 p-3 rounded-xl bg-base-200/40 border border-base-300/50 items-start group hover:border-error/30 transition-all"
            >
              <div className="mt-1">
                <XCircle size={14} className="text-error opacity-70" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold bg-error/10 text-error px-1.5 py-0.5 rounded border border-error/20 uppercase">
                    {w.errorCode}
                  </span>
                  <span className="text-[11px] font-bold opacity-60">Validation Issue</span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed font-medium">{w.devMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
