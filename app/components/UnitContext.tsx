import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  unit: 'metric' | 'imperial';
  toggleUnit: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <SettingsContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a UnitProvider');
  }
  return context;
};

export default SettingsContext;