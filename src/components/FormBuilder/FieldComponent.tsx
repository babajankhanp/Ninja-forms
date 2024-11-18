import React from 'react';
import { Field, ValidationError } from '../../types/form';
import { AlertCircle } from 'lucide-react';
import { SearchableSelect } from './SearchableSelect';
import { RichTextEditor } from './RichTextEditor';
import { DateInput } from './DateInput';

interface FieldComponentProps {
  field: Field;
  value: any;
  error: ValidationError | null;
  onChange: (value: any) => void;
}

export const FieldComponent: React.FC<FieldComponentProps> = ({
  field,
  value = null,
  error = null,
  onChange
}) => {
  if (!field?.type) {
    console.warn('Invalid field configuration:', field);
    return null;
  }

  const renderError = () => {
    if (!error?.message) return null;
    return (
      <div className="form-error">
        <AlertCircle size={14} />
        <span>{error.message}</span>
      </div>
    );
  };

  const renderField = () => {
    const hasError = !!error;

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`form-input ${hasError ? 'error' : ''}`}
            maxLength={field.validation?.maxLength}
            required={field.validation?.required}
            pattern={field.validation?.pattern}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.valueAsNumber)}
            placeholder={field.placeholder}
            className={`form-input ${hasError ? 'error' : ''}`}
            min={field.validation?.min}
            max={field.validation?.max}
            required={field.validation?.required}
            step="any"
          />
        );

      case 'richText':
        return (
          <RichTextEditor
            value={value ?? ''}
            onChange={onChange}
            placeholder={field.placeholder}
            error={hasError}
          />
        );

      case 'date':
        return (
          <DateInput
            value={value ?? ''}
            onChange={onChange}
            error={hasError}
            format={field?.dateFormat || "DD/MM/YYYY"}
          />
        );

      case 'singleSelect':
        return (
          <SearchableSelect
            options={field.options ?? []}
            value={value ?? ''}
            onChange={onChange}
            placeholder={field.placeholder}
            error={hasError}
          />
        );

      case 'multiSelect':
        return (
          <SearchableSelect
            options={field.options ?? []}
            value={value ?? []}
            onChange={onChange}
            multiple
            placeholder={field.placeholder}
            error={hasError}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="form-label">
        {field.name}
        {field.validation?.required && <span className="text-[rgb(var(--color-error))] ml-1">*</span>}
      </label>
      {field.description && (
        <p className="form-description">{field.description}</p>
      )}
      {renderField()}
      {renderError()}
    </div>
  );
};