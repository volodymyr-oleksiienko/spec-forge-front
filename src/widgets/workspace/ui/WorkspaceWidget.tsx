import { AlertTriangle, Lock, Unlock } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import type { GenerationConfig } from '@/entities/config';
import type { GenerationSource } from '@/features/artifacts-sync';
import { JsonEditor } from '@/features/edit-json';
import { CodePreview } from '@/features/preview-code';
import { BlinkingDot, Modal } from '@/shared/ui';
import { SpecTableWidget } from '@/widgets/spec-table';

const tabs: { title: string; generationSource: GenerationSource }[] = [
  {
    title: 'Table Editor',
    generationSource: 'specTable',
  },
  {
    title: 'JSON Sample Editor',
    generationSource: 'jsonSample',
  },
  {
    title: 'JSON Schema Editor',
    generationSource: 'jsonSchema',
  },
];

const tabContents: {
  content: (readOnly: boolean) => ReactNode;
  generationSource: GenerationSource;
}[] = [
  {
    content: (readOnly) => <SpecTableWidget readOnly={readOnly} />,
    generationSource: 'specTable',
  },
  {
    content: (readOnly) => <JsonEditor fieldName="jsonSample" readOnly={readOnly} />,
    generationSource: 'jsonSample',
  },
  {
    content: (readOnly) => <JsonEditor fieldName="jsonSchema" readOnly={readOnly} />,
    generationSource: 'jsonSchema',
  },
];

export const WorkspaceWidget = ({ isGenerating }: { isGenerating: boolean }) => {
  const [activeTab, setActiveTab] = useState<GenerationSource | 'code'>('specTable');
  const [nextGenerationSource, setNextGenerationSource] = useState<GenerationSource | null>(null);

  const { setValue, control } = useFormContext<{
    config: GenerationConfig;
    generationSource: GenerationSource;
    isSourceValid: boolean;
  }>();
  const isSourceValid = useWatch({ control, name: 'isSourceValid' });
  const config = useWatch({ control, name: 'config' });
  const generationSource = useWatch({ control, name: 'generationSource' });

  const handleTabChange = (tabName: GenerationSource | 'code') => {
    if (isGenerating) {
      return;
    }
    setActiveTab(tabName);
  };

  const confirmSourceChange = () => {
    if (nextGenerationSource) {
      setValue('generationSource', nextGenerationSource);
      setNextGenerationSource(null);
    }
  };

  const tooltipText = isGenerating ? 'Generation in progress...' : '';

  return (
    <section className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden min-h-[600px] flex flex-col">
      <div className="tabs tabs-boxed rounded-none bg-base-300/50 p-2 shrink-0">
        {tabs.map((tab) => (
          <button
            title={tooltipText}
            className={`tab flex-1 font-medium transition-all flex items-center justify-center gap-2 
            ${activeTab === tab.generationSource ? 'tab-active' : ''} 
            ${isGenerating && activeTab !== tab.generationSource ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleTabChange(tab.generationSource)}
          >
            <span>{tab.title}</span>
            {isGenerating && generationSource === tab.generationSource && (
              <BlinkingDot colorClassName="bg-green-500" />
            )}
            {!isSourceValid && generationSource === tab.generationSource && (
              <BlinkingDot colorClassName="bg-red-500" />
            )}
          </button>
        ))}

        {config && (
          <button
            title={tooltipText}
            className={`tab flex-1 font-medium transition-all flex items-center justify-center gap-2 
              ${activeTab === 'code' ? 'tab-active' : ''} 
              ${isGenerating && activeTab !== 'code' ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleTabChange('code')}
          >
            <span>Code Preview</span>
          </button>
        )}
      </div>

      <div className="flex-1 p-6 overflow-hidden">
        {tabContents
          .filter((t) => t.generationSource === activeTab)
          .map((t) => (
            <div className="animate-in fade-in duration-300 h-full relative">
              <UnlockBanner
                currentSource={generationSource}
                targetSource={t.generationSource}
                onUnlock={setNextGenerationSource}
              />
              {t.content(t.generationSource !== generationSource)}
            </div>
          ))}

        {activeTab === 'code' && config && (
          <div className="animate-in fade-in duration-300 h-full relative">
            <CodePreview />
          </div>
        )}
      </div>

      <Modal
        isOpen={!!nextGenerationSource}
        onClose={() => setNextGenerationSource(null)}
        title="Change Source of Truth?"
        actions={
          <button className="btn btn-warning" onClick={confirmSourceChange}>
            Confirm & Edit
          </button>
        }
      >
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center gap-2 text-warning font-bold">
            <AlertTriangle size={20} />
            <span>Warning: Data Overwrite</span>
          </div>
          <p className="text-sm text-base-content/80 leading-relaxed">
            You are about to start editing{' '}
            <strong>{nextGenerationSource ? formatTabName(nextGenerationSource) : ''}</strong>.
            <br />
            <br />
            This will make it the new source of truth for generation. The current data in{' '}
            <strong>{formatTabName(generationSource)}</strong> will be overwritten on the next sync
            based on your new edits.
          </p>
        </div>
      </Modal>
    </section>
  );
};

const UnlockBanner = ({
  currentSource,
  targetSource,
  onUnlock,
}: {
  currentSource: GenerationSource;
  targetSource: GenerationSource | null;
  onUnlock: (_: GenerationSource | null) => void;
}) => {
  if (currentSource === targetSource) {
    return null;
  }

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="shadow-lg bg-base-100/95 backdrop-blur border border-warning/40 rounded-full px-4 py-2 flex items-center gap-3">
        <Lock size={14} className="text-warning" />
        <span className="text-xs font-medium opacity-80 whitespace-nowrap">
          View mode. Generated from <strong>{formatTabName(currentSource)}</strong>.
        </span>
        <button
          type="button"
          className="btn btn-xs btn-warning btn-outline rounded-full px-3 h-7 min-h-7 border-warning/50 hover:border-warning hover:bg-warning hover:text-warning-content"
          onClick={() => onUnlock(targetSource)}
        >
          <Unlock size={12} className="mr-1" /> Enable Editing
        </button>
      </div>
    </div>
  );
};

const formatTabName = (tab: GenerationSource) => {
  switch (tab) {
    case 'specTable':
      return 'Spec Table';
    case 'jsonSample':
      return 'JSON Sample';
    case 'jsonSchema':
      return 'JSON Schema';
    default: {
      const _exhaustiveCheck: never = tab;
      return _exhaustiveCheck;
    }
  }
};
