import logo from './logo.svg';
import './App.scss';
import { QueryOrder } from './routes/order/QueryOrder';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { AppRouter } from './Route';
import { Link, Route, Switch } from 'react-router-dom';


function App() {
  return (
    <div className="container">
      <AppRouter>
      </AppRouter>
      
    </div>
  );
}

export default App;
