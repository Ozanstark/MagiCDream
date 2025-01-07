export const encryptMessage = (message: string, key: string): string => {
  try {
    // Convert the message and key to arrays for efficient processing
    const messageArray = Array.from(message);
    const keyArray = Array.from(key);
    const keyLength = keyArray.length;
    
    // Process the message in chunks to avoid stack overflow
    let encryptedArray = messageArray.map((char, index) => {
      const keyChar = keyArray[index % keyLength];
      return String.fromCharCode(
        char.charCodeAt(0) ^ keyChar.charCodeAt(0)
      );
    });
    
    // Join the array and convert to base64
    const encrypted = btoa(encryptedArray.join(''));
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Mesaj şifrelenirken bir hata oluştu");
  }
};

export const decryptMessage = (encrypted: string, key: string): string => {
  try {
    // Convert base64 back to string
    const encryptedStr = atob(encrypted);
    const encryptedArray = Array.from(encryptedStr);
    const keyArray = Array.from(key);
    const keyLength = keyArray.length;
    
    // Process the message in chunks to avoid stack overflow
    let decryptedArray = encryptedArray.map((char, index) => {
      const keyChar = keyArray[index % keyLength];
      return String.fromCharCode(
        char.charCodeAt(0) ^ keyChar.charCodeAt(0)
      );
    });
    
    return decryptedArray.join('');
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Mesaj çözülürken bir hata oluştu");
  }
};