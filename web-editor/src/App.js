import './App.css';
import { Navbar } from './js/navbar';
import { Toolbar } from './js/toolbar';

function App() {
  

  return (
    <>
    <Navbar/>
    <Toolbar/>
    <div className="canvas-container">
    <canvas className="myCanvas" width="240" height="297">
    </canvas>
    </div>

    </>
  );
 
}

export default App;
