import { createContext, useContext, useState, ReactNode } from 'react';

interface FormData {
  category: string;
  title: string;
  description: string;
  image: string | null;
  location: {
    latitude: number;
    longitude: number;
  };
  severity: number;
}

interface FormContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>({
    category: '',
    title: '',
    description: '',
    image: null,
    location: {
      latitude: 0,
      longitude: 0,
    },
    severity: 0,
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      category: '',
      title: '',
      description: '',
      image: null,
      location: {
        latitude: 0,
        longitude: 0,
      },
      severity: 0,
    });
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetForm }}>
      {children}
    </FormContext.Provider>
  );
}

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (undefined === context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};