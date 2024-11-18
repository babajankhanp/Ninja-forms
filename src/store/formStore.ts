import { create } from 'zustand';
import { Form, FieldGroup, Field, FormSubmitConfig } from '../types/form';

interface FormStore {
  forms: Form[];
  activeForm: Form | null;
  publishedForms: Record<string, string>; // formId -> publishedId
  addForm: (form: Omit<Form, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => void;
  updateForm: (form: Form) => void;
  deleteForm: (formId: string) => void;
  setActiveForm: (formId: string | null) => void;
  publishForm: (formId: string) => string;
  updateSubmitConfig: (formId: string, config: FormSubmitConfig) => void;
}

export const useFormStore = create<FormStore>((set) => ({
  forms: [],
  activeForm: null,
  publishedForms: {},
  addForm: (formData) => {
    const newForm: Form = {
      ...formData,
      id: crypto.randomUUID(),
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      submitConfig: {
        endpoint: '',
        method: 'POST',
        headers: {},
      },
      submitButton: {
        text: 'Submit',
        apiEndpoint: '',
        httpMethod: 'POST' as HttpMethod,
        validation: true
      }
    };
    set((state) => ({
      forms: [...state.forms, newForm],
      activeForm: newForm
    }));
  },
  updateForm: (form) => {
    set((state) => ({
      forms: state.forms.map((f) => (f.id === form.id ? { ...form, version: f.version + 1, updatedAt: new Date() } : f)),
    }));
  },
  deleteForm: (formId) => {
    set((state) => ({
      forms: state.forms.filter((f) => f.id !== formId),
      activeForm: state.activeForm?.id === formId ? null : state.activeForm,
      publishedForms: { ...state.publishedForms, [formId]: undefined },
    }));
  },
  setActiveForm: (formId) => {
    set((state) => ({
      activeForm: formId ? state.forms.find((f) => f.id === formId) || null : null,
    }));
  },
  publishForm: (formId) => {
    const publishedId = `${formId}-${crypto.randomUUID().slice(0, 8)}`;
    set((state) => ({
      publishedForms: { ...state.publishedForms, [formId]: publishedId },
    }));
    return publishedId;
  },
  updateSubmitConfig: (formId, config) => {
    set((state) => ({
      forms: state.forms.map((f) =>
        f.id === formId ? { ...f, submitConfig: config } : f
      ),
    }));
  },
}));