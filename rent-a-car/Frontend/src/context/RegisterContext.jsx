import { createContext, useContext, useState } from 'react';

const RegisterContext = createContext(null);

export function RegisterProvider({ children }) {
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [currentStep, setCurrentStep] = useState(1);

  const updateData = (fields) => {
    setRegisterData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => {
    setCurrentStep((step) => Math.min(step + 1, 2));
  };

  const prevStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  return (
    <RegisterContext.Provider
      value={{ registerData, updateData, currentStep, nextStep, prevStep }}
    >
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  const context = useContext(RegisterContext);

  if (!context) {
    throw new Error('useRegister must be used within a RegisterProvider');
  }

  return context;
}
