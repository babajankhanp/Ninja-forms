export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type PersistenceType = 'none' | 'session' | 'permanent';

export type FieldType = 'text' | 'number' | 'richText' | 'date' | 'singleSelect' | 'multiSelect' | 'email';

export type ExpiryDuration = '1_day' | '1_week' | '2_weeks' | '3_weeks' | '1_month' | '3_months' | '6_months';

export interface ValidationRule {
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  customValidation?: (value: any) => string | null;
  emailValidation?: {
    allowMultiple?: boolean;
    domainWhitelist?: string[];
  };
}

export interface ValidationError {
  message: string;
  type: 'error' | 'warning';
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface Field {
  id: string;
  name: string;
  description: string;
  type: FieldType;
  validation?: ValidationRule;
  options?: SelectOption[];
  placeholder?: string;
  defaultValue?: any;
  persistenceType?: PersistenceType;
  dateFormat?: string;
}

export interface FieldGroup {
  id: string;
  name: string;
  description: string;
  fields: Field[];
}

export interface FormSubmitConfig {
  endpoint: string;
  method: HttpMethod;
  headers: Record<string, string>;
}

export interface SubmitButtonConfig {
  text: string;
  apiEndpoint?: string;
  httpMethod: HttpMethod;
  validation?: boolean;
}

export interface Form {
  id?: string;
  name: string;
  groups: FieldGroup[];
  persistenceType: PersistenceType;
  expiryDuration?: ExpiryDuration;
  submitConfig: SubmitButtonConfig;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: ValidationError | null;
}