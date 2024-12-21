// 마이크 권한 체크
export const checkMicPermission = async () => {
  try {
    const permissionStatus = await navigator.permissions.query({
      name: "microphone",
    });
    return permissionStatus.state;
  } catch (err) {
    console.error("마이크 권한 확인 중 오류:", err.message);
    throw new Error(`마이크 권한 확인 실패: ${err.message}`);
  }
};

// 마이크 권한 요청
export const allowMicPermission = async (permission) => {
  if (permission === "denied") {
    goToMicSetting();
    return;
  }

  if (permission === "prompt") {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.error("마이크 권한 요청 중 오류:", err);
      goToMicSetting();
    }
  }
};

// 마이크 권한 거부시 설정 이동
export const goToMicSetting = () => {
  const statusText = document.getElementById("status");
  statusText.textContent =
    "마이크 권한이 거부되었습니다. 설정으로 이동하시겠습니까?";

  const settingsLink = document.createElement("a");
  settingsLink.className = "settings-link";
  settingsLink.textContent = "마이크 설정으로 이동 ->";
  settingsLink.onclick = () => {
    chrome.tabs.create({
      url: "chrome://settings/content/microphone",
    });
  };

  statusText.appendChild(settingsLink);
};
