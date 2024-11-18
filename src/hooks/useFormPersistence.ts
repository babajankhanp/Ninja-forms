import { useState, useEffect } from 'react';
import { FormData, PersistenceType } from '../types/form';
import { encrypt, decrypt } from '../utils/encryption';

const COOKIE_EXPIRY = 365; // days

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict; Secure`;
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
};

export const useFormPersistence = (formId: string, persistenceType: PersistenceType = 'session') => {
  const storageKey = `form_data_${formId}`;

  const loadPersistedData = async (): Promise<FormData> => {
    try {
      if (persistenceType === 'permanent') {
        const cookieData = getCookie(storageKey);
        if (cookieData) {
          const decryptedData = await decrypt(cookieData);
          return JSON.parse(decryptedData);
        }
      } else if (persistenceType === 'session') {
        const sessionData = sessionStorage.getItem(storageKey);
        if (sessionData) {
          return JSON.parse(sessionData);
        }
      }
      return {};
    } catch (error) {
      console.error('Error loading form data:', error);
      return {};
    }
  };

  const [formData, setFormData] = useState<FormData>({});

  console.log(formData, "formData from persist")

  useEffect(() => {
    loadPersistedData().then(setFormData);
  }, []);

  useEffect(() => {
    if (!formData || Object.keys(formData).length === 0) return;

    const saveData = async () => {
      try {
        if (persistenceType === 'permanent') {
          const encryptedData = await encrypt(JSON.stringify(formData));
          setCookie(storageKey, encryptedData, COOKIE_EXPIRY);
        } else if (persistenceType === 'session') {
          sessionStorage.setItem(storageKey, JSON.stringify(formData));
        }
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    };

    saveData();
  }, [formData, storageKey, persistenceType]);

  const clearPersistedData = () => {
    try {
      if (persistenceType === 'permanent') {
        setCookie(storageKey, '', -1);
      } else if (persistenceType === 'session') {
        sessionStorage.removeItem(storageKey);
      }
      setFormData({});
    } catch (error) {
      console.error('Error clearing form data:', error);
    }
  };

  const hasPersistedData = (): boolean => {
    if (persistenceType === 'permanent') {
      return !!getCookie(storageKey);
    } else if (persistenceType === 'session') {
      return !!sessionStorage.getItem(storageKey);
    }
    return false;
  };

  return {
    formData,
    setFormData,
    clearPersistedData,
    hasPersistedData,
  };
};