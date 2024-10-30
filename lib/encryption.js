import CryptoJS from 'crypto-js';

export function encryptFile(file, key) {
  return CryptoJS.AES.encrypt(file, key).toString();
}

export function decryptFile(encryptedFile, key) {
  const bytes = CryptoJS.AES.decrypt(encryptedFile, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
