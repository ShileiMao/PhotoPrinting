// import 'bootswatch/dist/slate/bootstrap.min.css'; // Added this :boom:
// import "bootswatch/dist/minty/bootstrap.min.css";
import { AppRouter } from './Route';
import { ToastContainer } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';


function App() {
  return (
    <>
      <AppRouter>
      </AppRouter>
      <ToastContainer />
    </>
  );
}

export default App;
