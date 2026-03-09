export const formatJson = (value: string) => {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch (_: unknown) {
    return value;
  }
};

export const isValidSpecJson = (data?: string): boolean => {
  try {
    if (!data) {
      return false;
    }
    const parsed = JSON.parse(data);
    if (typeof parsed !== 'object' || parsed === null) {
      return false;
    }
    return isValidSpecJsonElement(parsed);
  } catch (_: unknown) {
    return false;
  }
};

const isValidSpecJsonElement = (data: unknown): boolean => {
  if (data === null) {
    return true;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return false;
    }
    return data.every(isValidSpecJsonElement);
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      return false;
    }
    for (const key of keys) {
      if (key.trim() === '') {
        return false;
      }
      if (!isValidSpecJsonElement((data as Record<string, unknown>)[key])) {
        return false;
      }
    }
    return true;
  }

  return true;
};
