import React, { useState } from 'react';
import { SelectOption } from '../../types/form';
import { Plus, X } from 'lucide-react';

interface SelectOptionsEditorProps {
  options: SelectOption[];
  onChange: (options: SelectOption[]) => void;
}

export const SelectOptionsEditor: React.FC<SelectOptionsEditorProps> = ({ options, onChange }) => {
  const [newOption, setNewOption] = useState({ value: '', label: '' });

  const addOption = () => {
    if (newOption.value.trim() && newOption.label.trim()) {
      onChange([...options, { ...newOption }]);
      setNewOption({ value: '', label: '' });
    }
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newOption.value}
          onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
          placeholder="Option Value"
          className="flex-1 px-3 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          value={newOption.label}
          onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
          placeholder="Option Label"
          className="flex-1 px-3 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={addOption}
          className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
            <span className="flex-1 text-sm">{option.value}</span>
            <span className="flex-1 text-sm text-gray-600">{option.label}</span>
            <button
              type="button"
              onClick={() => removeOption(index)}
              className="text-gray-400 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};