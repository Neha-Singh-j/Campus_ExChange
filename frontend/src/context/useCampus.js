import { createContext, useContext } from 'react';

// Kept in its own file so CampusContext.jsx only exports a component
// (required by react-refresh/only-export-components).
export const CampusContext = createContext(null);

export function useCampus() {
  const ctx = useContext(CampusContext);
  if (!ctx) throw new Error('useCampus must be used inside <CampusProvider>');
  return ctx;
}