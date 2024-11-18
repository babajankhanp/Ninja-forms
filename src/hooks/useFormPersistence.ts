import { useState, useEffect } from 'react';
import { useFormStore } from '../store/formStore';
import { Form } from '../types/form';

const getExpiryTime = (duration: string): number => {
  const now = new Date().getTime();
  switch (duration) {
    case '1_day':
      return now + (24 * 60 * 60 * 1000);
    case '1_week':
      return now + (7 * 24 * 60 * 60 * 1000);
    case '2_weeks':
      return now + (14 * 24 * 60 * 60 * 1000);
    case '3_weeks':
      return now + (21 * 24 * 60 * 60 * 1000);
    case '1_month':
      return now + (30 * 24 * 60 * 60 * 1000);
    case '3_months':
      return now + (90 * 24 * 60 * 60 * 1000);
    case '6_months':
      return now + (180 * 24 * 60 * 60 * 1000);
    default:
      return now + (7 * 24 * 60 * 60 * 1000); // Default to 1 week
  }
};

export const useFormPersistence = (formId: string) => {
  const form = useFormStore(state => state.forms.find(f => f.id === formId));
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!form) return;

    if (form.persistenceType === 'permanent') {
      const storedData = localStorage.getItem(`form_${formId}`);
      if (storedData) {
        const { data, expiry } = JSON.parse(storedData);
        if (expiry && new Date().getTime() < expiry) {
          setFormData(data);
        } else {
          localStorage.removeItem(`form_${formId}`);
        }
      }
    } else if (form.persistenceType === 'session') {
      const data = sessionStorage.getItem(`form_${formId}`);
      if (data) {
        setFormData(JSON.parse(data));
      }
    }
  }, [formId, form]);

  const persistData = (newData: Record<string, any>) => {
    if (!form) return;

    if (form.persistenceType === 'permanent') {
      const expiryTime = getExpiryTime(form.expiryDuration || '1_week');
      localStorage.setItem(`form_${formId}`, JSON.stringify({
        data: newData,
        expiry: expiryTime
      }));
    } else if (form.persistenceType === 'session') {
      sessionStorage.setItem(`form_${formId}`, JSON.stringify(newData));
    }
    setFormData(newData);
  };

  const clearPersistedData = () => {
    localStorage.removeItem(`form_${formId}`);
    sessionStorage.removeItem(`form_${formId}`);
    setFormData({});
  };

  return { formData, setFormData: persistData, clearPersistedData };
};