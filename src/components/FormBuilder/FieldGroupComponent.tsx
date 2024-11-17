import React from 'react';
import { FieldGroup, FormErrors } from '../../types/form';
import { FieldComponent } from './FieldComponent';

interface FieldGroupComponentProps {
  group: FieldGroup;
  values: Record<string, any>;
  errors: FormErrors;
  onChange: (fieldId: string, value: any) => void;
}

export const FieldGroupComponent: React.FC<FieldGroupComponentProps> = ({
  group,
  values = {},
  errors = {},
  onChange,
}) => {
  if (!group?.fields?.length) {
    return null;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
      {group.description && (
        <p className="text-sm text-gray-600 mb-4">{group.description}</p>
      )}
      <div className="space-y-6">
        {group.fields.map((field) => (
          field && <FieldComponent
            key={field.id}
            field={field}
            value={values[field.id]}
            error={errors[field.id]}
            onChange={(value) => onChange(field.id, value)}
          />
        ))}
      </div>
    </div>
  );
};