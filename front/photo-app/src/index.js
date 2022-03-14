import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import PhotoSelect from './routes/photoList/PhotoSelect';
import UploadPhoto from './routes/photoList/UploadPhoto';
import { QueryOrder } from './routes/order/QueryOrder';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './Route'

render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
// ReactDOM.render(
  
//   <React.StrictMode>
//     <BrowserRouter>
//       <QueryOrder />
//     </BrowserRouter>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
