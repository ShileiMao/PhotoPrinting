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
  showDefault: function(message) {
    let config = getDefaultConfig();
    toast.info(message, config);
  },

  showWarning: function(message) {
    let config = getDefaultConfig();
    toast.warning(message, config);
  },

  showError: function(message) {
    let config = getDefaultConfig();
    toast.error(message, config);
  }
};

export default ToastHelper;