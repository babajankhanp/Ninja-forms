import React from 'react';
import { FormSubmitConfig, HttpMethod } from '../../types/form';

interface SubmitConfigEditorProps {
  config: FormSubmitConfig;
  onChange: (config: FormSubmitConfig) => void;
}

export const SubmitConfigEditor: React.FC<SubmitConfigEditorProps> = ({ config, onChange }) => {
  const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900">Form Submission Configuration</h3>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Endpoint URL
        </label>
        <input
          type="url"
          value={config.endpoint}
          onChange={(e) => onChange({ ...config, endpoint: e.target.value })}
          placeholder="https://api.example.com/submit"
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          HTTP Method
        </label>
        <select
          value={config.method}
          onChange={(e) => onChange({ ...config, method: e.target.value as HttpMethod })}
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {methods.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Custom Headers
        </label>
        <div className="space-y-2">
          {Object.entries(config.headers).map(([key, value], index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={key}
                onChange={(e) => {
                  const newHeaders = { ...config.headers };
                  delete newHeaders[key];
                  newHeaders[e.target.value] = value;
                  onChange({ ...config, headers: newHeaders });
                }}
                placeholder="Header name"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  onChange({
                    ...config,
                    headers: { ...config.headers, [key]: e.target.value },
                  });
                }}
                placeholder="Header value"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => {
                  const newHeaders = { ...config.headers };
                  delete newHeaders[key];
                  onChange({ ...config, headers: newHeaders });
                }}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              onChange({
                ...config,
                headers: { ...config.headers, '': '' },
              });
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Header
          </button>
        </div>
      </div>
    </div>
  );
};