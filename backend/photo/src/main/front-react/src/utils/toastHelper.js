import { toast } from "react-toastify/dist/react-toastify.cjs.development"

function getDefaultConfig() {
  const config = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  return config;
}

const ToastHelper = {
  showDefault: function(message, onClose) {
    let config = getDefaultConfig();
    config.onClose = onClose
    toast.info(message, config);
  },

  showWarning: function(message, onClose) {
    let config = getDefaultConfig();
    config.onClose = onClose
    toast.warning(message, config);
  },

  showError: function(message, onClose) {
    let config = getDefaultConfig();
    config.onClose = onClose
    toast.error(message, config);
  }
};

export default ToastHelper;