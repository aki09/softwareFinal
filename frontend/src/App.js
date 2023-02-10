import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Dashboard from './pages/Dashboard';
import InspectionReport from './pages/InspectionReport';

function App() {
  return (
    <div className="App">
      {/* <Dashboard/> */}
      <InspectionReport/>
    </div>
  );
}

export default App;
