import {BrowserRouter as Router ,Routes,Route} from "react-router-dom";
import './App.css';
import  MainForm  from './components/MainForm'
import ChatRoom from './components/ChatRoom'

function App() {
 
  return (
    <div className='container-fluid   d-flex align-items-center justify-content-center' style={{height:"100vh"}}>

      <Router>

        <Routes>

          <Route index element={<MainForm/>}></Route>
          <Route path="/chat/:roomName" element={<ChatRoom />}></Route>
          <Route path="*" element={"error 404 not found"}></Route>

        </Routes>

        
      </Router>
      
    </div>
  )
}

export default App
