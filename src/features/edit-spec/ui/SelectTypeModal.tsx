import { Clock, List, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';

import { type SpecRow, type SpecType } from '@/entities/spec';
import { useModal } from '@/shared/modal';
import type { UseModalReturn } from '@/shared/modal/useModal.ts';
import { Modal } from '@/shared/ui';

import { RecentlyUsedTypes } from './RecentlyUsedTypes.tsx';

const RECENT_TYPES_KEY = 'spec-forge-user-recent-types';

const TYPE_DEFAULTS: Record<string, any> = {
  BOOLEAN: { type: 'BOOLEAN' },
  DATE: { type: 'DATE', format: 'yyyy-MM-dd' },
  DATE_TIME: { type: 'DATE_TIME', format: "yyyy-MM-dd'T'HH:mm:ss" },
  TIME: { type: 'TIME', format: 'HH:mm:ss' },
  INTEGER: { type: 'INTEGER' },
  DOUBLE: { type: 'DOUBLE' },
  DECIMAL: { type: 'DECIMAL', scale: 2 },
  STRING: { type: 'STRING', examples: [] },
  ENUM: { type: 'ENUM', values: ['VALUE_1'] },
  OBJECT: { type: 'OBJECT' },
  LIST: { type: 'LIST', valueType: { type: 'STRING' } },
  MAP: { type: 'MAP', keyType: { type: 'STRING' }, valueType: { type: 'STRING' } },
};

export function SelectTypeModal({
  onSelect,
}: {
  onSelect: (rowId: string, value: SpecType) => void;
}) {
  const modal = useModal<SpecRow>('selectSpecType');
  return modal.isModalOpen && modal.data ? <SelectType {...modal} onSelect={onSelect} /> : null;
}

export const SelectType = ({
  isModalOpen,
  closeModal,
  data,
  onSelect,
}: UseModalReturn<SpecRow> & { onSelect: (rowId: string, value: SpecType) => void }) => {
  const formInstance = useForm<{ value: SpecType }>({
    defaultValues: { value: data!.type },
  });
  const [activeTab, setActiveTab] = useState<'recent' | 'all'>('recent');
  const [recentTypes] = useState<SpecType[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_TYPES_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to parse recent types from localStorage', error);
    }
    return [];
  });

  const handleConfirm = (formData: { value: SpecType }) => {
    const type = formData.value;
    const filtered = recentTypes.filter((t) => JSON.stringify(t) !== JSON.stringify(type));
    localStorage.setItem(RECENT_TYPES_KEY, JSON.stringify([type, ...filtered].slice(0, 20)));
    onSelect(data!.id, type);
    closeModal();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={`Select Type For ${data!.name}`}
      actions={
        <button className="btn btn-primary" onClick={formInstance.handleSubmit(handleConfirm)}>
          Confirm
        </button>
      }
    >
      <div className="flex flex-col gap-4 h-[60vh]">
        <div className="tabs tabs-boxed bg-base-200 shrink-0">
          <button
            className={`tab flex-1 gap-2 ${activeTab === 'recent' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('recent')}
          >
            <Clock size={14} /> Recent
          </button>
          <button
            className={`tab flex-1 gap-2 ${activeTab === 'all' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <List size={14} /> All Types
          </button>
        </div>

        <FormProvider {...formInstance}>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {activeTab === 'recent' ? (
              <RecentlyUsedTypes
                recentTypes={recentTypes}
                onSelect={(t) => {
                  onSelect(data!.id, t);
                  closeModal();
                }}
              />
            ) : (
              <TypePicker path="value" label="Base Type" />
            )}
          </div>
        </FormProvider>
      </div>
    </Modal>
  );
};

const TypePicker = ({ path, label }: { path: string; label: string }) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const currentPath = path ? `${path}.` : '';
  const currentType = useWatch({
    control,
    name: `${currentPath}type`,
  });
  const currentFormat = useWatch({
    control,
    name: `${currentPath}format`,
  });
  const getFieldError = (fieldPath: string) => {
    return fieldPath
      .split('.')
      .filter(Boolean)
      .reduce((acc: any, part) => acc?.[part], errors);
  };

  const formatError = getFieldError(`${currentPath}format`);
  const enumValues = watch(`${currentPath}values`) || [];

  const types = [
    'BOOLEAN',
    'DATE',
    'DATE_TIME',
    'TIME',
    'INTEGER',
    'DOUBLE',
    'DECIMAL',
    'STRING',
    'ENUM',
    'OBJECT',
    'LIST',
    'MAP',
  ];

  return (
    <div className="space-y-4 py-2">
      <div className="form-control">
        <label className="label py-1">
          <span className="label-text font-bold text-xs uppercase opacity-60">{label}</span>
        </label>
        <select
          className="select select-bordered select-sm w-full"
          value={currentType}
          onChange={(e) => setValue(path, TYPE_DEFAULTS[e.target.value])}
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {['INTEGER', 'DOUBLE', 'DECIMAL'].includes(currentType) && (
        <div className="grid grid-cols-2 gap-2 p-3 bg-base-200 rounded-lg">
          <div className="form-control">
            <label className="label-text text-[10px] uppercase font-bold pl-1 mb-1">Minimum</label>
            <input
              type="number"
              className="input input-bordered input-xs"
              {...control.register(`${currentPath}minimum`, { valueAsNumber: true })}
            />
          </div>
          <div className="form-control">
            <label className="label-text text-[10px] uppercase font-bold pl-1 mb-1">Maximum</label>
            <input
              type="number"
              className="input input-bordered input-xs"
              {...control.register(`${currentPath}maximum`, { valueAsNumber: true })}
            />
          </div>
          {currentType === 'DECIMAL' && (
            <div className="form-control col-span-2 mt-2">
              <label className="label-text text-[10px] uppercase font-bold pl-1 mb-1">
                Scale (Precision)
              </label>
              <input
                type="number"
                className="input input-bordered input-xs"
                {...control.register(`${currentPath}scale`, { valueAsNumber: true })}
              />
            </div>
          )}
        </div>
      )}

      {currentType === 'STRING' && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 p-3 bg-base-200 rounded-lg">
            <div className="form-control">
              <label className="label-text text-[10px] uppercase font-bold pl-1 mb-1">Format</label>
              <select
                className="select select-ghost select-xs"
                {...control.register(`${currentPath}format`)}
              >
                <option value="">None</option>
                <option value="EMAIL">Email</option>
                <option value="UUID">UUID</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label-text text-[10px] uppercase font-bold pl-1 mb-1">
                Pattern
              </label>
              <input
                type="text"
                placeholder="regex..."
                className="input input-ghost input-xs"
                {...control.register(`${currentPath}pattern`)}
              />
            </div>
            <div className="form-control">
              <label className="label-text text-[10px] uppercase font-bold pl-1 mb-1">
                Min Length
              </label>
              <input
                type="number"
                className="input input-ghost input-xs"
                {...control.register(`${currentPath}minLength`, { valueAsNumber: true })}
              />
            </div>
            <div className="form-control">
              <label className="label-text text-[10px] uppercase font-bold pl-1 mb-1">
                Max Length
              </label>
              <input
                type="number"
                className="input input-ghost input-xs"
                {...control.register(`${currentPath}maxLength`, { valueAsNumber: true })}
              />
            </div>
          </div>

          {!currentFormat && (
            <div className="p-3 bg-base-200 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="label-text text-[10px] uppercase font-bold">Examples</span>
                <button
                  className="btn btn-ghost btn-xs text-primary"
                  onClick={() => {
                    const ex = watch(`${currentPath}examples`) || [];
                    setValue(`${currentPath}examples`, [...ex, '']);
                  }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {(watch(`${currentPath}examples`) || []).map((_: string, i: number) => (
                  <div key={i} className="join w-full">
                    <input
                      className="input input-bordered input-xs join-item flex-1"
                      {...control.register(`${currentPath}examples.${i}`)}
                    />
                    <button
                      className="btn btn-square btn-xs join-item text-error"
                      onClick={() => {
                        const ex = watch(`${currentPath}examples`);
                        setValue(
                          `${currentPath}examples`,
                          ex.filter((_: any, idx: number) => idx !== i),
                        );
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {['DATE', 'DATE_TIME', 'TIME'].includes(currentType) && (
        <div className="p-3 bg-base-200 rounded-lg">
          <label className="label-text text-[10px] uppercase font-bold pl-1 mb-1">
            Format Pattern <span className="text-error">*</span>
          </label>
          <input
            type="text"
            className={`input input-bordered input-sm w-full mt-1 ${formatError ? 'input-error' : ''}`}
            placeholder="e.g. yyyy-MM-dd"
            {...control.register(`${currentPath}format`, {
              required: 'Format pattern is required',
            })}
          />
          {formatError && (
            <span className="text-error text-[10px] mt-1 block font-medium">
              {(formatError.message as string) || 'This field is required'}
            </span>
          )}
        </div>
      )}

      {currentType === 'ENUM' && (
        <div className="p-3 bg-base-200 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="label-text text-[10px] uppercase font-bold">
              Values <span className="text-error">*</span>
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-xs text-primary"
              onClick={() => {
                setValue(`${currentPath}values`, [...enumValues, `VALUE_${enumValues.length + 1}`]);
              }}
            >
              <Plus size={12} /> Add
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {enumValues.map((_: string, i: number) => {
              const valError = getFieldError(`${currentPath}values.${i}`);

              return (
                <div key={i} className="flex flex-col w-full">
                  <div className="join w-full">
                    <input
                      className={`input input-bordered input-xs join-item flex-1 ${valError ? 'input-error' : ''}`}
                      {...control.register(`${currentPath}values.${i}`, {
                        required: 'Value cannot be empty',
                      })}
                    />
                    <button
                      type="button"
                      className="btn btn-square btn-xs join-item text-error"
                      disabled={enumValues.length <= 1}
                      onClick={() => {
                        setValue(
                          `${currentPath}values`,
                          enumValues.filter((_: any, idx: number) => idx !== i),
                        );
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  {valError && (
                    <span className="text-error text-[10px] mt-0.5 ml-1 font-medium">
                      {valError.message as string}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {currentType === 'LIST' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-3 bg-base-200 rounded-lg">
            <div className="form-control">
              <label className="label-text text-[10px] uppercase font-bold pl-1 mb-1">
                Min Items
              </label>
              <input
                type="number"
                className="input input-bordered input-xs"
                {...control.register(`${currentPath}minItems`, { valueAsNumber: true })}
              />
            </div>
            <div className="form-control">
              <label className="label-text text-[10px] uppercase font-bold pl-1 mb-1">
                Max Items
              </label>
              <input
                type="number"
                className="input input-bordered input-xs"
                {...control.register(`${currentPath}maxItems`, { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="pl-4 border-l-2 border-primary/30 ml-2">
            <TypePicker path={`${currentPath}valueType`} label="Items Type" />
          </div>
        </div>
      )}

      {currentType === 'MAP' && (
        <div className="pl-4 border-l-2 border-secondary/30 ml-2 space-y-4">
          <TypePicker path={`${currentPath}keyType`} label="Key Type" />
          <TypePicker path={`${currentPath}valueType`} label="Value Type" />
        </div>
      )}
    </div>
  );
};
