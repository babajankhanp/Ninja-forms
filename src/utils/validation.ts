import { Field, ValidationError } from '../types/form';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateField = (field: Field, value: any): ValidationError | null => {
  const rules = field.validation || {};
  
  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return { message: 'This field is required', type: 'error' };
  }

  if (value) {
    switch (field.type) {
      case 'text':
      case 'richText':
        if (typeof value === 'string') {
          if (rules.maxLength && value.length > rules.maxLength) {
            return { message: `Maximum ${rules.maxLength} characters allowed`, type: 'error' };
          }
          if (rules.minLength && value.length < rules.minLength) {
            return { message: `Minimum ${rules.minLength} characters required`, type: 'error' };
          }
          if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
            return { message: 'Invalid format', type: 'error' };
          }
        }
        break;

      case 'email':
        if (typeof value === 'string') {
          const emails = rules.emailValidation?.allowMultiple 
            ? value.split(',').map(e => e.trim())
            : [value.trim()];

          for (const email of emails) {
            if (!EMAIL_REGEX.test(email)) {
              return { message: 'Please enter a valid email address', type: 'error' };
            }

            if (rules.emailValidation?.domainWhitelist?.length) {
              const domain = email.split('@')[1];
              if (!rules.emailValidation.domainWhitelist.includes(domain)) {
                return { message: 'Email domain not allowed', type: 'error' };
              }
            }
          }
        }
        break;

      case 'number':
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return { message: 'Please enter a valid number', type: 'error' };
        }
        if (rules.min !== undefined && numValue < rules.min) {
          return { message: `Minimum value is ${rules.min}`, type: 'error' };
        }
        if (rules.max !== undefined && numValue > rules.max) {
          return { message: `Maximum value is ${rules.max}`, type: 'error' };
        }
        break;

      case 'date':
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return { message: 'Please enter a valid date', type: 'error' };
        }
        break;

      case 'singleSelect':
        if (!field.options?.some(opt => opt.value === value)) {
          return { message: 'Please select a valid option', type: 'error' };
        }
        break;

      case 'multiSelect':
        if (!Array.isArray(value) || !value.every(v => field.options?.some(opt => opt.value === v))) {
          return { message: 'Please select valid options', type: 'error' };
        }
        break;
    }
  }

  if (rules.customValidation) {
    const customError = rules.customValidation(value);
    if (customError) {
      return { message: customError, type: 'error' };
    }
  }

  return null;
};