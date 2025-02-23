import { BrowserRouter as Router, Routes } from "react-router-dom";
import { routeElements } from "./routes";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>{routeElements}</Routes>
      </div>
    </Router>
  );
}

export default App;
