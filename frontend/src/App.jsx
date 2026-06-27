import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Result from "./pages/Result";
import History from "./pages/History";
function App() {

    return (

        <Routes>
           
            <Route path="/" element={<Login />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/interview" element={<Interview />} />

            <Route path="/result" element={<Result />} />
             <Route path="/history" element={<History />} />
        </Routes>

    );

}

export default App;