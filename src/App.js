import ImageUpload from "./components/uploadFile";
import ImageDisplay from "./components/imageData";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ImageUpload/>} />
          <Route path="/users/:id" element={<ImageDisplay/>} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
