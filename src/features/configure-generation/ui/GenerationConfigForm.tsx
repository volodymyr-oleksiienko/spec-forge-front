import { Download, RotateCcw, Save, Settings2, Trash2, Upload } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

import { DEFAULT_JAVA, DEFAULT_TS, type GenerationConfig } from '@/entities/config';
import { useConfigPresets } from '@/features/config-presets';
import { Collapse } from '@/shared/ui';

export const GenerationConfigForm = () => {
  const form = useFormContext<{ config?: GenerationConfig }>();
  const { control, register, watch, setValue } = form;

  const config = watch('config');

  const {
    selectedPresetName,
    userPresets,
    systemPresets,
    fileInputRef,
    handleSavePreset,
    handleDeletePreset,
    handleSelectPreset,
    handleResetToCurrentPreset,
    handleExport,
    handleImport,
    triggerImport,
  } = useConfigPresets(form);

  const isEnabled = !!config;
  const isJava = config?.language === 'JAVA';

  const handleToggle = (checked: boolean) => {
    setValue('config', checked ? DEFAULT_JAVA : undefined);
    handleSelectPreset('');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="form-control bg-base-200 p-3 rounded-xl border border-base-300 shadow-sm">
        <label className="label cursor-pointer justify-between gap-4">
          <span className="label-text font-bold text-base text-base-content/80">
            Enable Code Generation
          </span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={isEnabled}
            onChange={(e) => handleToggle(e.target.checked)}
          />
        </label>
      </div>

      {isEnabled && (
        <div className="flex flex-col gap-4 animate-in slide-in-from-top-1 duration-200">
          <div className="flex flex-col gap-3 p-3 bg-base-300/30 rounded-xl border border-base-300/50">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <select
                  className="select select-sm select-bordered w-40 text-xs"
                  value={selectedPresetName}
                  onChange={(e) => handleSelectPreset(e.target.value)}
                >
                  <option value="">Manual Setup</option>
                  {Object.keys(userPresets).length > 0 && (
                    <optgroup label="My Presets">
                      {Object.keys(userPresets).map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="System">
                    {Object.keys(systemPresets).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </optgroup>
                </select>

                <div className="join">
                  <button
                    type="button"
                    className="btn btn-sm join-item tooltip"
                    data-tip="Save current as new preset"
                    onClick={handleSavePreset}
                  >
                    <Save size={14} className="text-primary" />
                  </button>
                  {userPresets[selectedPresetName] && (
                    <button
                      type="button"
                      className="btn btn-sm join-item text-error tooltip"
                      data-tip="Delete this preset"
                      onClick={handleDeletePreset}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="tabs tabs-boxed bg-base-300 p-0.5">
                <button
                  type="button"
                  className={`tab tab-sm ${isJava ? 'tab-active' : ''}`}
                  onClick={() => {
                    setValue('config', DEFAULT_JAVA);
                    handleSelectPreset('');
                  }}
                >
                  Java
                </button>
                <button
                  type="button"
                  className={`tab tab-sm ${!isJava ? 'tab-active' : ''}`}
                  onClick={() => {
                    setValue('config', DEFAULT_TS);
                    handleSelectPreset('');
                  }}
                >
                  Typescript
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center px-1 border-t border-base-content/5 pt-2">
              <span className="text-[10px] uppercase font-bold opacity-40">Preset Actions</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="btn btn-xs btn-ghost gap-1 opacity-60 hover:opacity-100 text-primary"
                  onClick={handleResetToCurrentPreset}
                >
                  <RotateCcw size={12} /> Reset
                </button>
                <div className="divider divider-horizontal mx-0 w-1"></div>
                <button
                  type="button"
                  className="btn btn-xs btn-ghost gap-1 opacity-60 hover:opacity-100"
                  onClick={handleExport}
                >
                  <Download size={12} /> Export
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-ghost gap-1 opacity-60 hover:opacity-100"
                  onClick={() => triggerImport()}
                >
                  <Upload size={12} /> Import
                </button>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json"
              onChange={handleImport}
            />
          </div>

          <div className="space-y-2">
            <Collapse title="Naming & Fields" icon={<Settings2 size={18} />} defaultOpen>
              <div className="form-control">
                <label className="label text-xs opacity-70">Root Class Name</label>
                <input
                  {...register('config.base.naming.className')}
                  className="input input-bordered input-sm"
                />
              </div>
              <div className="form-control">
                <label className="label text-xs opacity-70">Sorting</label>
                <Controller
                  name="config.base.fields.sort"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="select select-bordered select-sm">
                      <option value="AS_IS">As Is</option>
                      <option value="ALPHABETICAL">Alphabetical</option>
                      <option value="REQUIRED_FIRST">Required First</option>
                    </select>
                  )}
                />
              </div>
            </Collapse>

            {isJava ? (
              <>
                <Collapse title="Java Structure">
                  <div className="grid grid-cols-2 gap-2">
                    {['CLASS', 'RECORD'].map((t) => (
                      <label
                        key={t}
                        className="label cursor-pointer justify-start gap-3 bg-base-200/50 rounded-lg px-4"
                      >
                        <input
                          type="radio"
                          className="radio radio-primary radio-xs"
                          checked={config?.structure?.type === t}
                          onChange={() => setValue('config.structure.type' as any, t)}
                        />
                        <span className="label-text text-xs uppercase font-medium">{t}</span>
                      </label>
                    ))}
                  </div>
                </Collapse>
                <Collapse title="Features">
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('config.validation.enabled' as any)}
                        className="checkbox checkbox-sm checkbox-primary"
                      />
                      <span className="text-xs font-medium text-base-content/80">
                        Jakarta Validation
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('config.builder.enabled' as any)}
                        className="checkbox checkbox-sm checkbox-primary"
                      />
                      <span className="text-xs font-medium text-base-content/80">
                        Lombok @Builder
                      </span>
                    </label>
                    {watch('config.builder.enabled') && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('config.builder.onlyIfMultipleFields' as any)}
                          className="checkbox checkbox-sm checkbox-primary"
                        />
                        <span className="text-xs font-medium text-base-content/80">
                          Builder If Multiple Fields
                        </span>
                      </label>
                    )}
                    <div className="form-control">
                      <label className="label text-xs opacity-70">JsonProperty</label>
                      <Controller
                        name="config.serialization.jsonPropertyMode"
                        control={control}
                        render={({ field }) => (
                          <select {...field} className="select select-bordered select-sm">
                            <option value="ALWAYS">Always</option>
                            <option value="IF_NAME_CHANGED">If field name changed</option>
                            <option value="NEVER">Never</option>
                          </select>
                        )}
                      />
                    </div>
                  </div>
                </Collapse>
              </>
            ) : (
              <>
                <Collapse title="TS Structure">
                  <div className="form-control">
                    <label className="label text-xs opacity-70">Declaration Style</label>
                    <Controller
                      name="config.structure.style"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="select select-bordered select-sm w-full text-sm"
                        >
                          <option value="INTERFACE">interface</option>
                          <option value="TYPE_ALIAS">type alias</option>
                        </select>
                      )}
                    />
                  </div>
                  <div className="form-control mt-2">
                    <label className="label text-xs opacity-70">Enum Style</label>
                    <Controller
                      name="config.enums.style"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="select select-bordered select-sm w-full text-sm"
                        >
                          <option value="TS_ENUM">TS Enum</option>
                          <option value="UNION_STRING">String Union</option>
                        </select>
                      )}
                    />
                  </div>
                </Collapse>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
