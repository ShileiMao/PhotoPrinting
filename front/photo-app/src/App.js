import logo from './logo.svg';
import { QueryOrder } from './routes/order/QueryOrder';
// import 'bootswatch/dist/slate/bootstrap.min.css'; // Added this :boom:
import "bootswatch/dist/minty/bootstrap.min.css";
import { AppRouter } from './Route';
import { Link, Route, Switch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';

import './App.scss';


function App() {
  return (
    
    <div className='container app-container'>
      <AppRouter>
      </AppRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
