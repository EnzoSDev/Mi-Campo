import React, { createContext, useContext, useState } from "react";

interface FieldContextType {
  fieldId: number | null;
  setFieldId: (id: number | null) => void;
}

const FieldContext = createContext<FieldContextType | undefined>(undefined);

export const FieldProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fieldId, setFieldId] = useState<number | null>(null);

  return (
    <FieldContext.Provider value={{ fieldId, setFieldId }}>
      {children}
    </FieldContext.Provider>
  );
};

export const useField = () => {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error("useField must be used inside FieldProvider");
  }
  return context;
};
