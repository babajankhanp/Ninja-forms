import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormData, FormErrors } from '../../types/form';
import { FieldGroupComponent } from './FieldGroupComponent';
import { ArrowLeft, Save } from 'lucide-react';
import { useFormStore } from '../../store/formStore';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { validateField } from '../../utils/validation';

interface FormRendererProps {
  form: Form;
}

export const FormRenderer: React.FC<FormRendererProps> = ({ form }) => {
  const { setActiveForm , forms} = useFormStore();
  const { formData, setFormData, clearPersistedData } = useFormPersistence(form.id);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

   console.log(forms, "formhdjshs")


  const navigate = useNavigate();

  console.log(formData, "formData")

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    form.groups.forEach(group => {
      group.fields.forEach(field => {
        const error = validateField(field, formData[field.id]);
        if (error) {
          newErrors[field.id] = error;
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [fieldId]: value };
      const error = validateField(
        form.groups.flatMap(g => g.fields).find(f => f.id === fieldId)!,
        value
      );
      setErrors(prev => ({ ...prev, [fieldId]: error }));
      return newData;
    });
  };

  const collectFormData = () => {
    const payload: Record<string, any> = {
      formId: form.id,
      formName: form.name,
      version: form.version,
      submittedAt: new Date().toISOString(),
      data: {}
    };

     console.log(form.groups, "form groups")
     console.log(formData, "my fff")
    // Collect all field values organized by groups
    form.groups.forEach(group => {
      payload.data[group.name] = {};
      group.fields.forEach(field => {
        payload.data[group.name][field.name] = formData[field.id];
      });
    });

    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(form, "my form")

    if (form.submitConfig?.validation && !validateForm()) {
      alert('Please fill all required fields correctly');
      return;
    }

    try {
      if (!form.submitConfig?.apiEndpoint) {
        throw new Error('No API endpoint configured');
      }

      const payload = collectFormData();
      console.log('Submitting form data:', payload);

      const response = await fetch(form.submitConfig.apiEndpoint, {
        method: form.submitConfig.httpMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Submission failed');
      }

      // Handle successful submission
      setSubmitted(true);
      clearPersistedData();

      // Show success message and redirect
      setTimeout(() => {
        setSubmitted(false);
        setActiveForm(null);
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit form. Please try again.');
    }
  };

  const handleReset = () => {
    clearPersistedData();
    setErrors({});
  };

  const handleBack = ()=> {
    setActiveForm(null)
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={handleBack}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to Forms
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{form.name}</h2>
          <p className="text-sm text-gray-500 mt-1">Version {form.version}</p>
        </div>

        {form.groups.map((group) => (
          <FieldGroupComponent
            key={group.id}
            group={group}
            values={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        ))}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            <Save size={16} className="mr-1" /> {form?.submitButton?.text || 'Submit'}
          </button>
        </div>

        {submitted && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg">
            Form submitted successfully!
          </div>
        )}
      </form>
    </div>
  );
};