import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, FieldGroup, FieldType, Form, HttpMethod, PersistenceType, SelectOption, SubmitButtonConfig, ExpiryDuration } from '../../types/form';
import { Plus, Save, Database, Minus, Clock } from 'lucide-react';
import { useFormStore } from '../../store/formStore';
import { SelectOptionsEditor } from './SelectOptionsEditor';

interface FormBuilderProps {
  initialForm?: Form;
  onSubmit?: (form: Form) => void;
}

  const expiryOptions = [
    { value: '1_day', label: '1 Day' },
    { value: '1_week', label: '1 Week' },
    { value: '2_weeks', label: '2 Weeks' },
    { value: '3_weeks', label: '3 Weeks' },
    { value: '1_month', label: '1 Month' },
    { value: '3_months', label: '3 Months' },
    { value: '6_months', label: '6 Months' },
  ];

  const dateFormatOptions = [
      { label: 'DD/MM/YYYY', value: 'dd/MM/yyyy' },
      { label: 'MM-DD-YYYY', value: 'MM-dd-yyyy' },
      {label:'YYYY-MM-DD', value:'yyyy-MM-dd'}
    ]

export const FormBuilder: React.FC<FormBuilderProps> = ({ initialForm, onSubmit }) => {
  const navigate = useNavigate();
  const { addForm } = useFormStore();
  const [formName, setFormName] = useState(initialForm?.name || '');
  const [groups, setGroups] = useState<FieldGroup[]>(initialForm?.groups || []);
  const [persistenceType, setPersistenceType] = useState<PersistenceType>(initialForm?.persistenceType || 'session');
  const [expiryDuration, setExpiryDuration] = useState<ExpiryDuration | undefined>(initialForm?.expiryDuration);
  const [submitConfig, setSubmitConfig] = useState<SubmitButtonConfig>(initialForm?.submitConfig || {
    text: 'Submit',
    apiEndpoint: '',
    httpMethod: 'POST',
    validation: true
  } );
  const [error, setError] = useState<string | null>(null);

  const fieldTypes: FieldType[] = ['text', 'number', 'richText', 'date', 'singleSelect', 'multiSelect', 'email'];


  const validateForm = (): boolean => {
    if (!formName.trim()) {
      setError('Form name is required');
      return false;
    }
    if (groups.length === 0) {
      setError('At least one group is required');
      return false;
    }

    for (const group of groups) {
      for (const field of group.fields) {
        if (['singleSelect', 'multiSelect'].includes(field.type) && (!field.options || field.options.length === 0)) {
          setError(`Field "${field.name}" requires at least one option`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (initialForm && onSubmit) {
        onSubmit({
          ...initialForm,
          name: formName,
          groups,
          persistenceType,
          expiryDuration: persistenceType === 'permanent' ? expiryDuration : undefined,
          submitConfig,
          updatedAt: new Date()
        });
        navigate('/');
      } else {
        addForm({
          name: formName,
          groups,
          persistenceType,
          expiryDuration: persistenceType === 'permanent' ? expiryDuration : undefined,
          submitConfig
        });
        navigate('/');
      }
    }
  };

  const addGroup = () => {
    const newGroup: FieldGroup = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      fields: [],
    };
    setGroups([...groups, newGroup]);
  };

  const deleteGroup = () => {
    if (groups.length > 0) {
      setGroups(groups.slice(0, -1));
    }
  };

  const deleteField = (groupId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              fields: group.fields.slice(0, -1),
            }
          : group
      )
    );
  };

  const addField = (groupId: string) => {
    const newField: Field = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      type: 'text',
      validation: { required: false },
      options: [],
      persistenceType: 'none',
    };
    setGroups(
      groups.map((g) =>
        g.id === groupId ? { ...g, fields: [...g.fields, newField] } : g
      )
    );
  };

  const updateFieldOptions = (groupId: string, fieldId: string, options: SelectOption[]) => {
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              fields: g.fields.map((f) =>
                f.id === fieldId ? { ...f, options } : f
              ),
            }
          : g
      )
    );
  };
console.log(submitConfig, "submitConfig")
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
       <label className="block text-sm font-medium text-gray-700" htmlFor="formName">
          Form Title
        </label>
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Form Name"
          className="w-full px-4 py-2 text-lg font-medium border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />

        <div className="flex items-center space-x-4">
          <Database size={20} className="text-gray-400" />
          <label htmlFor="persistenceType" className="block text-sm font-medium text-gray-700">
            Data Persistence Type
          </label>
          <select
            value={persistenceType}
            onChange={(e) => {
              setPersistenceType(e.target.value as PersistenceType);
              if (e.target.value !== 'permanent') {
                setExpiryDuration(undefined);
              }
            }}
            className="flex-1 px-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="none">No Data Persistence</option>
            <option value="session">Session Storage</option>
            <option value="permanent">Permanent Storage (Encrypted)</option>
          </select>
        </div>

        {persistenceType === 'permanent' && (
          <div className="flex items-center space-x-4 mt-4">
            <Clock size={20} className="text-gray-400" />
            <label htmlFor="expiryDuration" className="block text-sm font-medium text-gray-700">
              Data Expiry Duration
            </label>
            <select
              value={expiryDuration}
              onChange={(e) => setExpiryDuration(e.target.value as ExpiryDuration)}
              className="flex-1 px-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Expiry Duration</option>
              {expiryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {groups.map((group) => (
        <div key={group.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-4">
            <label htmlFor="Group Name" className="block text-sm font-medium text-gray-700">
           Group Name
          </label>
            <input
              type="text"
              value={group.name}
              onChange={(e) => setGroups(groups.map(g => g.id === group.id ? { ...g, name: e.target.value } : g))}
              placeholder="Group Name"
              className="w-full px-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
        <label htmlFor="Group Description" className="block text-sm font-medium text-gray-700">
           Group Description
          </label>
            <textarea
              value={group.description}
              onChange={(e) => setGroups(groups.map(g => g.id === group.id ? { ...g, description: e.target.value } : g))}
              placeholder="Group Description"
              className="w-full px-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {group.fields.map((field) => (
            <div key={field.id} className="mt-6 p-4 bg-gray-50 rounded-md">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => setGroups(groups.map(g => g.id === group.id ? {
                      ...g,
                      fields: g.fields.map(f => f.id === field.id ? { ...f, name: e.target.value } : f)
                    } : g))}
                    placeholder="Field Name"
                    className="w-full px-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <select
                    value={field.type}
                    onChange={(e) => setGroups(groups.map(g => g.id === group.id ? {
                      ...g,
                      fields: g.fields.map(f => f.id === field.id ? {
                        ...f,
                        type: e.target.value as FieldType,
                        options: ['singleSelect', 'multiSelect'].includes(e.target.value) ? [] : undefined
                      } : f)
                    } : g))}
                    className="w-full px-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fieldTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                {field.type === 'date' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <select
                            value={field.dateFormat || ''}
                            onChange={(e) =>
                              setGroups(
                                groups.map((g) =>
                                  g.id === group.id
                                    ? {
                                        ...g,
                                        fields: g.fields.map((f) =>
                                          f.id === field.id ? { ...f, dateFormat: e.target.value } : f
                                        ),
                                      }
                                    : g
                                )
                              )
                            }
                            className="w-full px-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Date Format</option>
                            {dateFormatOptions.map((format) => (
                              <option key={format.value} value={format.value}>
                                {format.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                {['singleSelect', 'multiSelect'].includes(field.type) && (
                  <SelectOptionsEditor
                    options={field.options || []}
                    onChange={(options) => updateFieldOptions(group.id, field.id, options)}
                  />
                )}

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={field.validation?.required || false}
                      onChange={(e) => setGroups(groups.map(g => g.id === group.id ? {
                        ...g,
                        fields: g.fields.map(f => f.id === field.id ? {
                          ...f,
                          validation: { ...f.validation, required: e.target.checked }
                        } : f)
                      } : g))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Required</span>
                  </label>
                </div>
              </div>
            </div>
          ))}

        <div className='flex justify-start align-middle gap-2'>
            <button
            type="button"
            onClick={() => addField(group.id)}
            className="mt-4 flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
          >
            <Plus size={16} className="mr-1" /> Add Field
          </button>
           <button
            type="button"
            onClick={() => deleteField(group.id)}
            className="mt-4 flex items-center px-4 py-2 text-sm text-red-600 hover:bg-[#e11d48]-50 rounded-md"
          >
            <Minus size={16} className="mr-1" /> Delete Last Field
          </button>
        </div>
        </div>
      ))}

      <div className="flex justify-between">
        <div className='flex gap-1 justify-center align-middle'>
          <button
          type="button"
          onClick={addGroup}
          className="flex items-center px-4 py-2 text-sm font-medium text--700 bg-white border border-gray-300 rounded-md"
          style={{ backgroundColor: '#22c55e', color:"#fff" }}
        >
          <Plus size={16} className="mr-1" /> Add Group
        </button>
        <button
          type="button"
          onClick={deleteGroup}
           className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-white-300 rounded-md hover:bg-[#e11d48]"
           style={{ backgroundColor: '#e11d48', color:"#fff" }}
        >
          <Minus size={16} className="mr-1" /> Delete Last Group
        </button>
        </div>
      </div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Submit Button Configuration</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Button Text
              </label>
              <input
                type="text"
                value={submitConfig.text}
                onChange={(e) => setSubmitConfig({ ...submitConfig, text: e.target.value })}
              className="w-full px-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Submit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                API Endpoint
              </label>
              <input
                type="text"
                value={submitConfig.apiEndpoint}
                 onChange={(e) => setSubmitConfig({ ...submitConfig, apiEndpoint: e.target.value })}
                 className="w-full px-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://api.example.com/submit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                HTTP Method
              </label>
              <select
                value={submitConfig.httpMethod}
                onChange={(e) => setSubmitConfig({ ...submitConfig, httpMethod: e.target.value as HttpMethod })}
              className="w-full px-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={submitConfig.validation}
                onChange={(e) => setSubmitConfig({ ...submitConfig, validation: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Enable Form Validation
              </label>
            </div>
          </div>
        </div>
        <div className='flex align-middle justify-end'>
           <button
          type="submit"
          className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          <Save size={16} className="mr-1" /> {initialForm ? 'Update Form' : 'Save Form'}
        </button>
        </div>
    </form>
  );
};