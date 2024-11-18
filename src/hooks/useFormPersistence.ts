import { useState, useEffect } from 'react';
import { useFormStore } from '../store/formStore';
import { Form, FieldType } from '../types/form';

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
      return now + (7 * 24 * 60 * 60 * 1000);
  }
};

export const useFormPersistence = (formId: string) => {
  const form = useFormStore(state => state.forms.find(f => f.id === formId));
  const [formData, setFormData] = useState<Record<string, any>>({});

  const initializeFieldValue = (field: { type: FieldType; id: string }) => {
    switch (field.type) {
      case 'number':
        return '';
      case 'text':
        return '';
      case 'richText':
        return '';
      case 'singleSelect':
        return '';
      case 'multiSelect':
        return [];
      case 'date':
        return '';
      case 'email':
        return '';
      default:
        return '';
    }
  };

  const initializeFormData = (data: Record<string, any>): Record<string, any> => {
    if (!form?.groups) return data;

    const initializedData = { ...data };
    form.groups.forEach(group => {
      group.fields.forEach(field => {
        initializedData[field.id] = initializedData[field.id] ??
                                   field.defaultValue ??
                                   initializeFieldValue(field);
      });
    });
    return initializedData;
  };

  useEffect(() => {
    if (!form) return;

    try {
      if (form.persistenceType === 'permanent') {
        const storedData = localStorage.getItem(`form_${formId}`);
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            if (parsedData && parsedData.data) {
              const { data, expiry } = parsedData;
              if (expiry && new Date().getTime() < expiry) {
                setFormData(initializeFormData(data));
              } else {
                localStorage.removeItem(`form_${formId}`);
                setFormData(initializeFormData({}));
              }
            }
          } catch (e) {
            console.error('Error parsing stored data:', e);
            localStorage.removeItem(`form_${formId}`);
            setFormData(initializeFormData({}));
          }
        } else {
          setFormData(initializeFormData({}));
        }
      } else if (form.persistenceType === 'session') {
        const storedData = sessionStorage.getItem(`form_${formId}`);
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            setFormData(initializeFormData(parsedData));
          } catch (e) {
            console.error('Error parsing stored data:', e);
            sessionStorage.removeItem(`form_${formId}`);
            setFormData(initializeFormData({}));
          }
        } else {
          setFormData(initializeFormData({}));
        }
      } else {
        setFormData(initializeFormData({}));
      }
    } catch (e) {
      console.error('Error in useFormPersistence:', e);
      setFormData(initializeFormData({}));
    }
  }, [formId, form]);

  const persistData = (newData: Record<string, any>) => {
    if (!form) return;

    try {
      const updatedData = { ...formData, ...newData };

      if (form.persistenceType === 'permanent') {
        const expiryTime = getExpiryTime(form.expiryDuration || '1_week');
        localStorage.setItem(`form_${formId}`, JSON.stringify({
          data: updatedData,
          expiry: expiryTime
        }));
      } else if (form.persistenceType === 'session') {
        sessionStorage.setItem(`form_${formId}`, JSON.stringify(updatedData));
      }

      setFormData(updatedData);
    } catch (e) {
      console.error('Error persisting data:', e);
    }
  };

  const clearPersistedData = () => {
    try {
      localStorage.removeItem(`form_${formId}`);
      sessionStorage.removeItem(`form_${formId}`);
      setFormData(initializeFormData({}));
    } catch (e) {
      console.error('Error clearing persisted data:', e);
    }
  };

  return {
    formData,
    setFormData: (newData: Record<string, any>) => {
      if (typeof newData === 'function') {
        persistData(newData(formData));
      } else {
        persistData(newData);
      }
    },
    clearPersistedData
  };
};