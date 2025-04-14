import { AppRouter } from "./routes";
import "./App.css";
import { GlobalStyles } from "./styles/GlobalStyles";

function App() {
  return (
    <div className="app">
      <GlobalStyles />
      <AppRouter />
    </div>
  );
}

export default App;
