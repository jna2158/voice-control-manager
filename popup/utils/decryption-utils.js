// API 키 복호화
export const decryptApiKey = async () => {
  const encryptedKey = await chrome.storage.local.get("openaiApiKey");
  const key = await crypto.subtle.importKey(
    "raw",
    new Uint8Array(encryptedKey.openaiApiKey.key),
    "AES-GCM",
    true,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(encryptedKey.openaiApiKey.iv),
    },
    key,
    new Uint8Array(encryptedKey.openaiApiKey.encrypted)
  );

  return new TextDecoder().decode(decrypted);
};
