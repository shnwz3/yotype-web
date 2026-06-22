import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HowItWorks from "@/components/HowItWorks";
import LiveCommandDemo from "@/components/LiveCommandDemo";

const Home = () => {
  return (
    <main data-testid="yotype-landing">
      <HowItWorks />
      <LiveCommandDemo />
    </main>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
