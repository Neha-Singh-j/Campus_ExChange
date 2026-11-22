import { useCallback, useEffect, useMemo, useState } from 'react';
import { CAMPUSES, makeCustomCampus } from '../data/campuses';
import { CampusContext } from './useCampus';

const ID_KEY = 'campuszon.campusId';
const CUSTOM_KEY = 'campuszon.customCampuses';

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function CampusProvider({ children }) {
  const [customCampuses, setCustomCampuses] = useState(() => readJSON(CUSTOM_KEY, []));
  const [campusId, setCampusId] = useState(() => {
    try {
      return localStorage.getItem(ID_KEY) || 'berkeley';
    } catch {
      return 'berkeley';
    }
  });

  const campuses = useMemo(() => [...CAMPUSES, ...customCampuses], [customCampuses]);
  const campus = campuses.find((x) => x.id === campusId) ?? CAMPUSES[0];

  useEffect(() => {
    try {
      localStorage.setItem(ID_KEY, campus.id);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(customCampuses));
    } catch {
      /* storage unavailable — selection just won't persist */
    }
  }, [campus.id, customCampuses]);

  // Keep the browser tab title in sync with the active campus.
  useEffect(() => {
    document.title = `CampusZon • ${campus.name}`;
  }, [campus.name]);

  const selectCampus = useCallback(
    (idOrLabelOrName) => {
      const hit = campuses.find(
        (x) => x.id === idOrLabelOrName || x.label === idOrLabelOrName || x.name === idOrLabelOrName
      );
      if (hit) setCampusId(hit.id);
    },
    [campuses]
  );

  const addCustomCampus = useCallback((name) => {
    const created = makeCustomCampus(name);
    setCustomCampuses((prev) => (prev.some((x) => x.id === created.id) ? prev : [...prev, created]));
    setCampusId(created.id);
    return created;
  }, []);

  const value = useMemo(
    () => ({ campus, campuses, selectCampus, addCustomCampus }),
    [campus, campuses, selectCampus, addCustomCampus]
  );

  return <CampusContext.Provider value={value}>{children}</CampusContext.Provider>;
}