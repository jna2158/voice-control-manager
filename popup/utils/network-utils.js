// 네트워크 상태 체크
export const checkNetworkConnection = () => {
  return navigator.onLine;
};

// 네트워크 상태 변경 감지
export const setupNetworkListeners = (callback) => {
  window.addEventListener("online", () => callback(true));
  window.addEventListener("offline", () => callback(false));
};
