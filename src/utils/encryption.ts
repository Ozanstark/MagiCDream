export const encryptMessage = (message: string, key: string): string => {
  try {
    // Convert message to UTF-8 bytes, then to base64
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    const messageBase64 = btoa(String.fromCharCode(...messageBytes));
    
    // Convert the base64 message and key to arrays for processing
    const messageArray = Array.from(messageBase64);
    const keyArray = Array.from(key);
    const keyLength = keyArray.length;
    
    // XOR encryption
    const encryptedArray = messageArray.map((char, index) => {
      const keyChar = keyArray[index % keyLength];
      return String.fromCharCode(
        char.charCodeAt(0) ^ keyChar.charCodeAt(0)
      );
    });
    
    // Convert to base64 for safe storage
    return btoa(encryptedArray.join(''));
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Mesaj şifrelenirken bir hata oluştu");
  }
};

export const decryptMessage = (encrypted: string, key: string): string => {
  try {
    // Decode the base64 encrypted message
    const encryptedStr = atob(encrypted);
    const encryptedArray = Array.from(encryptedStr);
    const keyArray = Array.from(key);
    const keyLength = keyArray.length;
    
    // XOR decryption
    const decryptedArray = encryptedArray.map((char, index) => {
      const keyChar = keyArray[index % keyLength];
      return String.fromCharCode(
        char.charCodeAt(0) ^ keyChar.charCodeAt(0)
      );
    });
    
    // Convert from base64 back to original message
    const decryptedBase64 = decryptedArray.join('');
    const decoded = atob(decryptedBase64);
    
    // Convert from UTF-8 bytes back to string
    const decoder = new TextDecoder();
    const decodedBytes = new Uint8Array([...decoded].map(c => c.charCodeAt(0)));
    return decoder.decode(decodedBytes);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Mesaj çözülürken bir hata oluştu");
  }
};