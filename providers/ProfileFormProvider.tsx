import { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileData {
  username: string;
  fullName: string;
  avatar: any;
  about: string;
  neighborhood: string;
}

interface FormContextType {
  formData: ProfileData;
  updateProfileData: (data: Partial<ProfileData>) => void;
  resetProfile: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<ProfileData>({
    username: "",
    fullName: "",
    avatar: null,
    about: "",
    neighborhood: "",
  });

  const updateProfileData = (data: Partial<ProfileData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetProfile = () => {
    setFormData({
      username: "",
      fullName: "",
      avatar: null,
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