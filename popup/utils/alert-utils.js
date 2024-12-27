// 커스텀 토스트 알림 표시
export const customAlert = (message, type = "error", timeout = 0) => {
  const alert = document.createElement("div");
  alert.className = `custom-alert ${type}`;
  alert.textContent = message;
  document.body.appendChild(alert);

  setTimeout(() => alert.classList.add("show"), 10);

  if (timeout > 0) {
    setTimeout(() => {
      alert.classList.remove("show");
      setTimeout(() => alert.remove(), 300);
    }, timeout);
  }
};
