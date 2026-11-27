import { useEffect, useMemo } from 'react';
import { CAMPUSES, DEFAULT_CAMPUS_ID } from '../data/campuses';
import { CampusContext } from './useCampus';

export function CampusProvider({ children }) {
  const campus = CAMPUSES.find((c) => c.id === DEFAULT_CAMPUS_ID) ?? CAMPUSES[0];

  useEffect(() => {
    document.title = `Campus Exchange • ${campus.name}`;
  }, [campus.name]);

  const value = useMemo(() => ({ campus, campuses: CAMPUSES }), [campus]);
  return <CampusContext.Provider value={value}>{children}</CampusContext.Provider>;
}
