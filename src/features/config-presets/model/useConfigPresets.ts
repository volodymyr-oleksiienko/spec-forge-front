import React, { useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { DEFAULT_JAVA, DEFAULT_TS, type GenerationConfig } from '@/entities/config';

import { CONFIG_PRESETS } from './consts.ts';

const USER_PRESETS_KEY = 'spec-forge-user-presets';

interface ExportedConfig {
  presetName: string;
  config: GenerationConfig;
  exportedAt: string;
}

export const useConfigPresets = (form: UseFormReturn<{ config?: GenerationConfig }>) => {
  const { watch, setValue } = form;
  const config = watch('config');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedPresetName, setSelectedPresetName] = useState<string>('');
  const [userPresets, setUserPresets] = useState<Record<string, GenerationConfig>>(() => {
    try {
      const saved = localStorage.getItem(USER_PRESETS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse user configuration presets from localStorage', e);
    }
    return {};
  });
  const isJava = config?.language === 'JAVA';

  const updateAndSaveUserPresets = (newPresets: Record<string, GenerationConfig>) => {
    setUserPresets(newPresets);
    localStorage.setItem(USER_PRESETS_KEY, JSON.stringify(newPresets));
  };

  const handleSavePreset = () => {
    if (!config) {
      return;
    }

    const name = window.prompt('Enter preset name:');
    if (!name || name.trim() === '') {
      return;
    }

    const updated = { ...userPresets, [name]: config };
    updateAndSaveUserPresets(updated);
    setSelectedPresetName(name);
  };

  const handleDeletePreset = () => {
    if (!selectedPresetName || !userPresets[selectedPresetName]) {
      return;
    }

    if (!window.confirm(`Delete preset "${selectedPresetName}"?`)) {
      return;
    }

    const updated = { ...userPresets };
    delete updated[selectedPresetName];
    updateAndSaveUserPresets(updated);
    setSelectedPresetName('');
  };

  const handleSelectPreset = (name: string) => {
    const newConfig = userPresets[name] || CONFIG_PRESETS[name];
    if (newConfig) {
      setValue('config', newConfig);
      setSelectedPresetName(name);
    } else {
      setSelectedPresetName('');
    }
  };

  const handleResetToCurrentPreset = () => {
    const presetData = userPresets[selectedPresetName] || CONFIG_PRESETS[selectedPresetName];
    const fallbackDefault = isJava ? DEFAULT_JAVA : DEFAULT_TS;
    setValue('config', presetData || fallbackDefault);
  };

  const handleExport = () => {
    if (!config) {
      return;
    }

    const exportData: ExportedConfig = {
      presetName: selectedPresetName || 'Custom Configuration',
      config: config,
      exportedAt: new Date().toISOString(),
    };

    const data = JSON.stringify(exportData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exportData.presetName.replace(/\s+/g, '_')}.json`;
    link.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const rawJson = JSON.parse(ev.target?.result as string);

        let importedConfig: GenerationConfig;
        let importedName: string;

        if (rawJson.presetName && rawJson.config) {
          importedConfig = rawJson.config;
          importedName = `${rawJson.presetName} (Imported)`;
        } else {
          importedConfig = rawJson;
          importedName = `Imported_${new Date().toLocaleTimeString()}`;
        }

        setValue('config', importedConfig);

        const updated = { ...userPresets, [importedName]: importedConfig };
        updateAndSaveUserPresets(updated);
        setSelectedPresetName(importedName);

        e.target.value = '';
      } catch (err) {
        alert('Invalid JSON file format');
        console.error('Import failed', err);
      }
    };
    reader.readAsText(file);
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  return {
    selectedPresetName,
    userPresets,
    systemPresets: CONFIG_PRESETS,
    fileInputRef,
    handleSavePreset,
    handleDeletePreset,
    handleSelectPreset,
    handleResetToCurrentPreset,
    handleExport,
    handleImport,
    triggerImport,
  };
};
