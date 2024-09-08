import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/signup/Register";
import Navbar from "./components/Navbar";
import ProtectRouter from "./utils/ProtectRouter";


function App() {

  return (
    <>
    <Navbar/>
     <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectRouter />}>
          <Route path="/" element={<Home />} />
        </Route>
     </Routes>
    </>
  )
}

export default App
