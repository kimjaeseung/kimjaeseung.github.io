import { useState, useCallback } from 'react';

export function useDefenseState() {
  const [activeDefenses, setActiveDefenses] = useState<Set<string>>(new Set());

  const toggleDefense = useCallback((id: string) => {
    setActiveDefenses(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isDefenseActive = useCallback((id: string) => {
    return activeDefenses.has(id);
  }, [activeDefenses]);

  const isStepBlocked = useCallback((defenseIds: string[]) => {
    return defenseIds.some(id => activeDefenses.has(id));
  }, [activeDefenses]);

  const resetDefenses = useCallback(() => {
    setActiveDefenses(new Set());
  }, []);

  return { activeDefenses, toggleDefense, isDefenseActive, isStepBlocked, resetDefenses };
}
