// API 키 암호화
export const encryptApiKey = async (apiKey) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);

  // 암호화 키 생성
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // 암호화
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return {
    encrypted: Array.from(new Uint8Array(encryptedData)),
    iv: Array.from(iv),
    key: await exportCryptoKey(key),
  };
};

// 암호화 키 내보내기
const exportCryptoKey = async (key) => {
  const exported = await crypto.subtle.exportKey("raw", key);
  return Array.from(new Uint8Array(exported));
};
