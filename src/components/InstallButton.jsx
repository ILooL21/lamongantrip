import { useEffect, useState } from "react";
import "../styles/InstallButton.css";
import { DownloadOutlined } from "@ant-design/icons";

const InstallButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const checkPrompt = () => {
      if (window.pwaState?.deferredPrompt && !localStorage.getItem("pwaInstalled")) {
        setShowButton(true);
      }
    };

    checkPrompt(); // Cek saat komponen mount

    window.pwaState.onPromptReady = () => {
      checkPrompt(); // Trigger ulang kalau event baru muncul setelah mount
    };

    const handleAppInstalled = () => {
      console.log("✅ Installed!");
      setShowButton(false);
      localStorage.setItem("pwaInstalled", "true");
      window.pwaState.deferredPrompt = null;
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.pwaState.onPromptReady = null;
    };
  }, []);

  const handleClick = async () => {
    const prompt = window.pwaState?.deferredPrompt;
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      console.log(`🧠 Install outcome: ${outcome}`);
    }
  };

  if (!showButton) return null;

  return (
    <button
      id="install-button"
      onClick={handleClick}>
      Install Web App <DownloadOutlined style={{ marginLeft: 5 }} />
    </button>
  );
};

export default InstallButton;
