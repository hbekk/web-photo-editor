import React, { useRef, useState} from "react";
import '../css/navbar.css'
import App from '../App';



export const Navbar = ({ setImage, canvasRef, gaussianBlur, rotate}) => {
    const fileInputRef = useRef(null);
    const upload = (event) => {
        event.preventDefault(); 
        fileInputRef.current.click(); 
    };
    
    const handleFileChange = (event) => {
      const file = event.target.files[0]; 
      if (file) {
        const imageUrl = URL.createObjectURL(file); 
        setImage(imageUrl) 
      }
    };

    const download = (event) => {
      const filename = prompt("Enter a filename:", "canvas-image");
      if (filename) {
        const canvas = canvasRef.current;
        let canvasUrl = canvas.toDataURL();
        const createEl = document.createElement('a');
        createEl.href = canvasUrl;
        createEl.download =`${filename}.png`;
        createEl.click();
        createEl.remove();
      }
    }

    const newFile = (event) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

      
    
    
    return ( 
        <div className="navbar-container">
        <nav className="navbar">
          <ul>
          <li> 
            <a className="logo">Web Editor &nbsp;|</a>
            </li>
            <li>
            <div class="dropdown">
                <a class="dropbtn">File
                  <i class="fa fa-caret-down"></i>
                </a>
                     <div class="dropdown-content">
                        <a onClick={newFile}>New...</a>
                        <div id="upload">
                        <a onClick={upload}>Open</a>
                        <input type="file" onChange={handleFileChange} ref={fileInputRef} id="imageLoader" name="imageLoader"/>
                        </div>
                        <a onClick={download}>Save As...</a>
                        <a href="#">Properties</a>

                     </div>
            </div> 
            </li>
            <li>
            <div class="dropdown">
                <a class="dropbtn">Image
                  <i class="fa fa-caret-down"></i>
                </a>
                     <div class="dropdown-content">
                        <a href="#">Crop</a>
                        <a href="#">Resize</a>
                        <a onClick={() => rotate(canvasRef.current)}>Rotate</a>
                        <a href="#">Flip</a>
                     </div>
            </div> 
            </li>
            <li>
            <div class="dropdown">
                <a class="dropbtn">Clipboard
                  <i class="fa fa-caret-down"></i>
                </a>
                     <div class="dropdown-content">
                        <a href="#">Copy</a>
                        <a href="#">Paste</a>
                        <a href="#">Cut</a>
                     </div>
            </div> 
            </li>
            <li>
            <div class="dropdown">
                <a class="dropbtn">Effects
                  <i class="fa fa-caret-down"></i>
                </a>
                     <div class="dropdown-content">
                     <a onClick={() => gaussianBlur(canvasRef.current)}>GaussianBlur</a>
                      <a href="#">Link 2</a>
                        <a href="#">Link 3</a>
                     </div>
            </div> 
            </li>
          
          </ul>
        </nav>
        </div>
    )
}