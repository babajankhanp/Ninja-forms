import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/formStore';
import { FormBuilder } from './FormBuilder';
import { ArrowLeft } from 'lucide-react';

export const FormEditor: React.FC = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { forms, updateForm } = useFormStore();
  const [form] = useState(() => forms.find(f => f.id === formId));

  useEffect(() => {
    if (!form) {
      navigate('/');
    }
  }, [form, navigate]);

  if (!form) return null;

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} className="mr-1" />
        Back to Forms
      </button>
      <FormBuilder initialForm={form} onSubmit={updateForm} />
    </div>
  );
};