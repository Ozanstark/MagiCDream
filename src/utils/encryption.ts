export const encryptMessage = (message: string, key: string): string => {
  try {
    // Convert the message to UTF-8 bytes
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    
    // Simple XOR encryption with key
    const encryptedBytes = new Uint8Array(messageBytes.length);
    for (let i = 0; i < messageBytes.length; i++) {
      encryptedBytes[i] = messageBytes[i] ^ key.charCodeAt(i % key.length);
    }
    
    // Convert encrypted bytes to base64
    const encrypted = btoa(String.fromCharCode.apply(null, [...encryptedBytes]));
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Mesaj şifrelenirken bir hata oluştu");
  }
};

export const decryptMessage = (encrypted: string, key: string): string => {
  try {
    // Convert base64 back to bytes
    const encryptedBytes = new Uint8Array(
      atob(encrypted)
        .split("")
        .map(char => char.charCodeAt(0))
    );
    
    // XOR decrypt with key
    const decryptedBytes = new Uint8Array(encryptedBytes.length);
    for (let i = 0; i < encryptedBytes.length; i++) {
      decryptedBytes[i] = encryptedBytes[i] ^ key.charCodeAt(i % key.length);
    }
    
    // Convert decrypted bytes back to text
    const decoder = new TextDecoder();
    const decrypted = decoder.decode(decryptedBytes);
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Mesaj çözülürken bir hata oluştu");
  }
};