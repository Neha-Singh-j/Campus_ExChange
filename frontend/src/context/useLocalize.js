import { useMemo } from 'react';
import { useCampus } from './useCampus';
import { localizeData } from '../data/campuses';

/** Returns `loc(valueOrStringOrObject)` that rewrites Berkeley-specific names for the active campus. */
export function useLocalize() {
  const { campus } = useCampus();
  return useMemo(() => (value) => localizeData(value, campus), [campus]);
}