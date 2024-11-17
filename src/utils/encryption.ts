import { Buffer } from 'buffer';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

async function getKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(data: string): Promise<string> {
  try {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const key = await getKey(crypto.randomUUID(), salt);
    
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    
    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      encodedData
    );
    
    const encryptedArray = new Uint8Array(encryptedContent);
    const resultArray = new Uint8Array(salt.length + iv.length + encryptedArray.length);
    resultArray.set(salt, 0);
    resultArray.set(iv, salt.length);
    resultArray.set(encryptedArray, salt.length + iv.length);
    
    return Buffer.from(resultArray).toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decrypt(encryptedData: string): Promise<string> {
  try {
    const encryptedArray = Buffer.from(encryptedData, 'base64');
    const salt = encryptedArray.slice(0, SALT_LENGTH);
    const iv = encryptedArray.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const data = encryptedArray.slice(SALT_LENGTH + IV_LENGTH);
    
    const key = await getKey(crypto.randomUUID(), salt);
    
    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      data
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decryptedContent);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}