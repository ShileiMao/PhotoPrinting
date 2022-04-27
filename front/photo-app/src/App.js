// import 'bootswatch/dist/slate/bootstrap.min.css'; // Added this :boom:
// import "bootswatch/dist/minty/bootstrap.min.css";
import { AppRouter } from './Route';
import { ToastContainer } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import { useState } from 'react';
import { StringUtils } from './utils/StringUtils';


function App() {
  const [modalTitle, setModalTitle] = useState("");
  const [modalMsg, setModalMsg] = useState("");
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [cancelCallback, setCancelCallback] = useState(null);

  /**
   * 
   * @param {{
   *  title: String
   *  message: String 
   *  confirm: (String)
   *  cancel: (String)
   * }} config 
   */
  const showModal = (config) => {
    // title, message,  confirm, cancel
    if(!StringUtils.isEmpty(config.title)) {
      setModalTitle(config.title);
    } else {
      setModalTitle("")
    }

    if(!StringUtils.isEmpty(config.message)) {
      setModalMsg(config.message);
    } else {
      setModalMsg("");
    }

    if(config.cancel != null) {
      setCancelCallback(config.cancel);
    } else {
      setCancelCallback(null);
    }

    // if(config.confirm != null) {
      setConfirmCallback(config.confirm);
    // } else {
    //   setConfirmCallback(null);
    // }


    const select = (el, all = false) => {
      el = el.trim()
      if (all) {
        return [...document.querySelectorAll(el)]
      } else {
        return document.querySelector(el)
      }
    }

    select("#triggerModal").click();
  }

  const confirmClicked = () => {
    console.log("000000---ckuc")
    if(confirmCallback) {
      confirmCallback();
    }
  }

  return (
    <>
      <AppRouter showModal={showModal}>
      </AppRouter>
      <ToastContainer />

      <button type="button" className="btn btn-primary" id="triggerModal" data-bs-toggle="modal" data-bs-target="#basicModal" style={{display: 'none'}}>
              </button>
      <div className="modal fade" id="basicModal" tabIndex="-1" style={{display: `none`}} aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalTitle}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {modalMsg}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={cancelCallback}>取消</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={confirmClicked}>确认</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
