import CryptoJS from 'crypto-js/crypto-js';

export default class Encryption {
  secret = '';

  enabled = true;

  constructor(enabled, secret) {
    // Constructor
    this.enabled = enabled;
    this.secret = secret;
  }

  encrypt(message, secret = '') {
    let secretValue = secret;
    if (secretValue === '') {
      secretValue = this.secret;
    }

    const ciphertext = CryptoJS.AES.encrypt(message, secretValue).toString();
    return ciphertext;
  }

  decrypt(message, secret = '') {
    let secretValue = secret;
    if (secretValue === '') {
      secretValue = this.secret;
    }

    const bytes = CryptoJS.AES.decrypt(message, secretValue);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  }

  sha512(message) {
    return CryptoJS.SHA512(message).toString();
  }

  sha256(message) {
    return CryptoJS.SHA256(message);
  }
}
