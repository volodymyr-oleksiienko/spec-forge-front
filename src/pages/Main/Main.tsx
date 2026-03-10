import { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import type { GenerationConfig } from '@/entities/config';
import { mapToSpecModel, mapToSpecTable, type SpecTable } from '@/entities/spec';
import { type GenerationSource, useGeneratorSync, type Warning } from '@/features/artifacts-sync';
import { notifyError } from '@/shared/lib/notify';
import { storage } from '@/shared/lib/storage';
import { ConfigSidebarWidget } from '@/widgets/config-sidebar';
import { DiagnosticsConsole } from '@/widgets/diagnostics-console';
import { WorkspaceWidget } from '@/widgets/workspace';

export const Main = () => {
  const [mode] = useState<'init' | 'edit'>(() => storage.getMode());
  const [documentId, setDocumentId] = useState<string>('');
  const [canEditRole, setCanEditRole] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

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
    storage.getDocumentId().then((id) => {
      setDocumentId(id);
      storage.canEdit().then(setCanEditRole);

      if (mode === 'edit') {
        storage.load(id).then((data) => {
          if (data) {
            reset({
              specTable: mapToSpecTable(data),
              generationSource: 'specTable',
              isSourceValid: true,
            });
          }
        });
      }
    });
  }, [mode, reset]);

  useEffect(() => {
    if (mode === 'edit' && canEditRole && specTable && documentId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  if (mode === 'init') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-2xl">Welcome to Spec Forge</h2>
            <p className="text-base-content/70">Click to insert the generator into your page</p>
            <div className="card-actions mt-4">
              <button className="btn btn-primary" onClick={() => storage.init(documentId)}>
                Insert Spec Editor
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...formInstance}>
      <div className="flex flex-col h-screen overflow-hidden bg-base-200">
        <main className="flex-1 overflow-y-auto p-4 md:p-8" style={{ scrollbarGutter: 'stable' }}>
          <div className="mx-auto max-w-[2000px]">
            <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
              <ConfigSidebarWidget />
              <WorkspaceWidget isGenerating={isGenerating} />
            </div>
          </div>
        </main>

        <footer className="w-full px-4 md:px-8 border-t border-base-300/30 bg-base-200/50">
          <div className="mx-auto max-w-[2000px]">
            <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
              <div className="hidden lg:block" />
              <div className="relative">
                <DiagnosticsConsole />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </FormProvider>
  );
};
