import { createContext, useContext, useState, ReactNode } from 'react';

export interface ProfileData {
  id?: string;
  username: string;
  gender: string;
  about: string;
  neighborhood: string;
}

interface FormContextType {
  formData: ProfileData;
  updateProfileData: (data: Partial<ProfileData>) => Promise<void>;
  resetProfile: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<ProfileData>({
    username: "",
    gender: "",
    about: "",
    neighborhood: "",
  });

  const updateProfileData = (data: Partial<ProfileData>) => {
    return new Promise<void>((resolve) => {
      setFormData(prev => {
        const newData = { ...prev, ...data };
        resolve();
        return newData;
      });
    });
  };

  const resetProfile = () => {
    setFormData({
      username: "",
      gender: "",
      about: "",
      neighborhood: "",
    });
  };

  return (
    <FormContext.Provider value={{ formData, updateProfileData, resetProfile }}>
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