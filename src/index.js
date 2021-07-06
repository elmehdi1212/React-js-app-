import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Menu from './Components/Menu.js'
import NavBar from './Components/NavBar.js'
import Map from './Components/GMapDemo'
import DataTableDemo from './Components/DataTableDemo'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route,BrowserRouter as Router,Switch,Link} from 'react-router-dom';


ReactDOM.render(
  <React.StrictMode>
    <Router>
    <Switch>
          <Route  exact  path="/Amis">
          <NavBar/>
          <DataTableDemo />
          </Route>
          <Route exact path="/">
          <NavBar/>
            <Map />
          </Route>
        </Switch>
        </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
