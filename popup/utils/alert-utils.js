// 커스텀 토스트 알림 표시
export const customAlert = (message) => {
  const alert = document.createElement("div");
  alert.className = "custom-error-alert";
  alert.textContent = message;
  document.body.appendChild(alert);

  setTimeout(() => alert.classList.add("show"), 10);

  setTimeout(() => {
    alert.classList.remove("show");
    setTimeout(() => alert.remove(), 300);
  }, 3000);
};
