import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import type { GenerationConfig } from '@/entities/config';
import { mapToSpecModel, mapToSpecTable, type SpecTable } from '@/entities/spec';
import { type GenerationSource, useGeneratorSync, type Warning } from '@/features/artifacts-sync';
import { notifyError } from '@/shared/lib/notify';
import { storage } from '@/shared/lib/storage';
import { isEmbedded } from '@/shared/lib/storage';
import { ConfigSidebarWidget } from '@/widgets/config-sidebar';
import { DiagnosticsConsole } from '@/widgets/diagnostics-console';
import { WorkspaceWidget } from '@/widgets/workspace';

export const Main = () => {
  const [mode, setMode] = useState<'edit' | 'loading' | 'error'>('loading');
  const [documentId, setDocumentId] = useState<string>('');
  const [canEditRole, setCanEditRole] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const formInstance = useForm<{
    config: GenerationConfig;
    jsonSample: string;
    jsonSchema: string;
    specTable: SpecTable;
    code: string;
    warnings: Warning[];
    generationSource: GenerationSource;
    isSourceValid: boolean;
  }>({
    defaultValues: { generationSource: 'specTable', isSourceValid: false },
  });
  const { control, reset } = formInstance;
  const specTable = useWatch({ control, name: 'specTable' });
  const { isGenerating } = useGeneratorSync(formInstance);

  useEffect(() => {
    let isMounted = true;

    const bootstrapApp = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('CONFLUENCE_TIMEOUT')), 3000),
        );

        const dataFetchPromise = Promise.all([storage.getDocumentId(), storage.canEdit()]);

        const [docId, editPermission] = (await Promise.race([
          dataFetchPromise,
          timeoutPromise,
        ])) as [string, boolean];

        if (!isMounted) {
          return;
        }

        setMode('edit');
        setDocumentId(docId);
        setCanEditRole(editPermission);

        const data = await storage.load(docId);
        if (data) {
          reset({
            specTable: mapToSpecTable(data),
            generationSource: 'specTable',
            isSourceValid: true,
          });
        }
      } catch {
        if (!isMounted) {
          return;
        }
        setMode('error');
      }
    };

    bootstrapApp();
    return () => {
      isMounted = false;
    };
  }, [reset]);

  useEffect(() => {
    if (mode === 'edit' && canEditRole && specTable && documentId) {
      setIsDirty(true);
    }
  }, [canEditRole, mode, specTable, documentId]);

  useEffect(() => {
    if (mode !== 'edit' || !canEditRole || !documentId || !specTable) return;

    let isCurrent = true;

    storage
      .save(documentId, mapToSpecModel(specTable))
      .then(() => {
        if (isCurrent) {
          setIsDirty(false);
        }
      })
      .catch((err) => {
        if (err === 'Debounced') return;
        if (!isCurrent) return;
        let errorMessage = 'Failed to save changes';
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (err?.responseText) {
          errorMessage = `Sync error: ${err.status}`;
        }
        notifyError(errorMessage);
        console.error('Auto-save error:', err);
      });
    return () => {
      isCurrent = false;
    };
  }, [specTable, documentId, mode, canEditRole]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    const timer = setTimeout(() => {
      import('@/shared/ui/MonacoEditor/JsonMonacoEditor');
      import('@/shared/ui/MonacoEditor/CodeMonacoEditor');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (mode === 'loading') {
    return (
      <div
        className={`flex w-full flex-col items-center justify-center bg-base-200 gap-4 ${isEmbedded ? 'min-h-[150px] py-8' : 'h-screen'}`}
      >
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <h3 className="text-lg font-medium text-base-content/80 animate-pulse">
          Loading Workspace...
        </h3>
      </div>
    );
  }

  if (mode === 'error') {
    return (
      <div
        className={`flex w-full items-center justify-center bg-base-200 p-4 ${isEmbedded ? 'min-h-[150px] py-8' : 'h-screen'}`}
      >
        <div className="alert alert-error max-w-md shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-bold">Error</h3>
            <div className="text-sm text-error-content/80">
              Connection Failed. Please Reload Page.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...formInstance}>
      <div
        className={`flex w-full bg-base-300 ${isEmbedded ? 'min-h-full' : 'h-screen overflow-hidden'}`}
      >
        <aside
          className={`bg-base-200 border-r border-base-300 transition-all duration-300 ease-in-out flex flex-col overflow-hidden
            ${showConfig ? 'w-[400px]' : 'w-0'}`}
        >
          <div
            className="w-[400px] p-6 overflow-y-auto h-full"
            style={{ scrollbarGutter: 'stable' }}
          >
            <ConfigSidebarWidget />
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 relative">
          <main
            className={`flex-1 p-4 md:p-8 ${isEmbedded ? '' : 'overflow-y-auto'}`}
            style={{ scrollbarGutter: 'stable' }}
          >
            <div className="mx-auto max-w-[2000px]">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setShowConfig(!showConfig)}
                  className={`btn btn-square ${showConfig ? 'btn-ghost' : 'btn-primary'} btn-sm`}
                  title={showConfig ? 'Hide Settings' : 'Show Settings'}
                >
                  <Settings size={18} />
                </button>
                {!showConfig && (
                  <span className="text-sm font-bold opacity-30 uppercase tracking-wider">
                    Settings Hidden
                  </span>
                )}
              </div>

              <WorkspaceWidget isGenerating={isGenerating} isContentDisabled={!canEditRole} />
            </div>
          </main>

          <footer className="w-full px-4 md:px-8 border-t border-base-300/30 bg-base-200/50">
            <div className="mx-auto max-w-[2000px]">
              <DiagnosticsConsole />
            </div>
          </footer>
        </div>
      </div>
    </FormProvider>
  );
};
