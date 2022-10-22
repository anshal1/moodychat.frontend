import MessageBox from "./Components/MessageBox";
import Navbar from "./Components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Chat from "./Components/Chat";
import State from "./context/State";
import Login from "./Components/Login";
import Alert from "./Components/Alert";
import SignUp from "./Components/SignUp";
import CreateChat from "./Components/CreateChat";
import DeletePage from "./Components/DeletePage";

function App() {
  return (
    <>
      <State>
        <Router>
          <Navbar />
          <Alert />
          <Routes>
            <Route path="/" element={<MessageBox />} />
            <Route path="/login/:v0" element={<Login />} />
            <Route path="/signup/:v0" element={<SignUp />} />
            <Route path="/create/chat/:v0" element={<CreateChat />} />
            <Route path="/delete/chat/:v0" element={<DeletePage />} />
            <Route path="/chat/:v0" element={<Chat />} />
          </Routes>
        </Router>
      </State>
      {/* <Test /> */}

    </>
  );
}

export default App;
