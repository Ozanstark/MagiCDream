export const encryptMessage = (message: string, key: string): string => {
  try {
    // Convert message to chunks to handle large files
    const chunkSize = 1024 * 1024; // 1MB chunks
    const messageChunks: string[] = [];
    
    for (let i = 0; i < message.length; i += chunkSize) {
      messageChunks.push(message.slice(i, i + chunkSize));
    }
    
    // Encrypt each chunk
    const encryptedChunks = messageChunks.map(chunk => {
      const messageArray = Array.from(chunk);
      const keyArray = Array.from(key);
      const keyLength = keyArray.length;
      
      const encryptedArray = messageArray.map((char, index) => {
        const keyChar = keyArray[index % keyLength];
        return String.fromCharCode(
          char.charCodeAt(0) ^ keyChar.charCodeAt(0)
        );
      });
      
      return encryptedArray.join('');
    });
    
    // Join chunks and convert to base64
    return btoa(encryptedChunks.join(''));
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Mesaj şifrelenirken bir hata oluştu");
  }
};

export const decryptMessage = (encrypted: string, key: string): string => {
  try {
    // Decode base64
    const encryptedStr = atob(encrypted);
    
    // Split into chunks
    const chunkSize = 1024 * 1024; // 1MB chunks
    const encryptedChunks: string[] = [];
    
    for (let i = 0; i < encryptedStr.length; i += chunkSize) {
      encryptedChunks.push(encryptedStr.slice(i, i + chunkSize));
    }
    
    // Decrypt each chunk
    const decryptedChunks = encryptedChunks.map(chunk => {
      const encryptedArray = Array.from(chunk);
      const keyArray = Array.from(key);
      const keyLength = keyArray.length;
      
      const decryptedArray = encryptedArray.map((char, index) => {
        const keyChar = keyArray[index % keyLength];
        return String.fromCharCode(
          char.charCodeAt(0) ^ keyChar.charCodeAt(0)
        );
      });
      
      return decryptedArray.join('');
    });
    
    return decryptedChunks.join('');
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Mesaj çözülürken bir hata oluştu");
  }
};