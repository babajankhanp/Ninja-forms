import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, FieldGroup, FieldType, Form, PersistenceType, SelectOption } from '../../types/form';
import { Plus, Save, Database, Minus } from 'lucide-react';
import { useFormStore } from '../../store/formStore';
import { SelectOptionsEditor } from './SelectOptionsEditor';

interface FormBuilderProps {
  initialForm?: Form;
  onSubmit?: (form: Form) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ initialForm, onSubmit }) => {
  const navigate = useNavigate();
  const { addForm } = useFormStore();
  const [formName, setFormName] = useState(initialForm?.name || '');
  const [groups, setGroups] = useState<FieldGroup[]>(initialForm?.groups || []);
  const [persistenceType, setPersistenceType] = useState<PersistenceType>(initialForm?.persistenceType || 'session');
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
          updatedAt: new Date()
        });
        navigate('/');
      } else {
        addForm({
          name: formName,
          groups,
          persistenceType
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
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
          <select
            value={persistenceType}
            onChange={(e) => setPersistenceType(e.target.value as PersistenceType)}
            className="flex-1 px-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="none">No Data Persistence</option>
            <option value="session">Session Storage</option>
            <option value="permanent">Permanent Storage (Encrypted)</option>
          </select>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-4">
            <input
              type="text"
              value={group.name}
              onChange={(e) => setGroups(groups.map(g => g.id === group.id ? { ...g, name: e.target.value } : g))}
              placeholder="Group Name"
              className="w-full px-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
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