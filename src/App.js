import React from 'react';
import './App.css';
import { Navbar } from './components/navbar';
import { Toolbar } from './components/toolbar';
import { Layers } from './components/layers';
import { CanvasProvider } from './context/CanvasProvider';
import CanvasContainer from './components/CanvasContainer';

function App() {


    return (
        <CanvasProvider>
            <Navbar />
            <Toolbar />
            <Layers />
            <CanvasContainer />
        </CanvasProvider>
    );
}
export default App;
