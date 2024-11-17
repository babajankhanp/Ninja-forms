import React, { useState } from 'react';
import { ValidationRule, FieldType } from '../../types/form';

interface ValidationRuleEditorProps {
  fieldType: FieldType;
  validation: ValidationRule;
  onChange: (validation: ValidationRule) => void;
}

export const ValidationRuleEditor: React.FC<ValidationRuleEditorProps> = ({
  fieldType,
  validation,
  onChange,
}) => {
  const [useCustomValidation, setUseCustomValidation] = useState(!!validation.customValidation);

  const getDefaultValidationFields = () => {
    switch (fieldType) {
      case 'email':
        return (
          <>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={validation.required}
                  onChange={(e) => onChange({ ...validation, required: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Required</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={validation.emailValidation?.allowMultiple}
                  onChange={(e) => onChange({
                    ...validation,
                    emailValidation: {
                      ...validation.emailValidation,
                      allowMultiple: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Allow Multiple Emails</span>
              </label>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-700">Allowed Domains (one per line)</label>
              <textarea
                value={validation.emailValidation?.domainWhitelist?.join('\n') || ''}
                onChange={(e) => {
                  const domains = e.target.value.split('\n').filter(d => d.trim());
                  onChange({
                    ...validation,
                    emailValidation: {
                      ...validation.emailValidation,
                      domainWhitelist: domains.length > 0 ? domains : undefined
                    }
                  });
                }}
                placeholder="example.com&#10;company.org"
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 h-24"
              />
              <p className="text-xs text-gray-500">Leave empty to allow all domains</p>
            </div>
          </>
        );

      case 'text':
      case 'richText':
        return (
          <>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={validation.required}
                  onChange={(e) => onChange({ ...validation, required: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Required</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-700">Min Length</label>
                <input
                  type="number"
                  value={validation.minLength || ''}
                  onChange={(e) => onChange({ ...validation, minLength: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-700">Max Length</label>
                <input
                  type="number"
                  value={validation.maxLength || ''}
                  onChange={(e) => onChange({ ...validation, maxLength: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-700">Pattern (RegEx)</label>
              <input
                type="text"
                value={validation.pattern || ''}
                onChange={(e) => onChange({ ...validation, pattern: e.target.value })}
                placeholder="e.g., ^[A-Za-z]+$"
                className="w-full px-3 py-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );

      case 'number':
        return (
          <>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={validation.required}
                  onChange={(e) => onChange({ ...validation, required: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Required</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-700">Min Value</label>
                <input
                  type="number"
                  value={validation.min || ''}
                  onChange={(e) => onChange({ ...validation, min: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-700">Max Value</label>
                <input
                  type="number"
                  value={validation.max || ''}
                  onChange={(e) => onChange({ ...validation, max: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </>
        );

      default:
        return (
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={validation.required}
                onChange={(e) => onChange({ ...validation, required: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Required</span>
            </label>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">Validation Rules</h4>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useCustomValidation}
            onChange={(e) => {
              setUseCustomValidation(e.target.checked);
              if (!e.target.checked) {
                const { customValidation, ...rest } = validation;
                onChange(rest);
              }
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Use Custom Validation</span>
        </label>
      </div>

      {useCustomValidation ? (
        <div className="space-y-2">
          <label className="text-sm text-gray-700">Custom Validation Function</label>
          <textarea
            value={validation.customValidation?.toString() || ''}
            onChange={(e) => {
              try {
                // eslint-disable-next-line no-new-func
                const fn = new Function('value', `return ${e.target.value}`);
                onChange({ ...validation, customValidation: fn });
              } catch (error) {
                console.error('Invalid function:', error);
              }
            }}
            placeholder="(value) => { if (!value) return 'Value is required'; return null; }"
            className="w-full h-24 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>
      ) : (
        getDefaultValidationFields()
      )}
    </div>
  );
};