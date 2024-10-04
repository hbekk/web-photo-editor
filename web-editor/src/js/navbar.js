import React, { useRef } from "react";
import '../css/navbar.css'

export const Navbar = () => {

    const fileInputRef = useRef(null); // Reference for the file input

    const upload = (event) => {
        event.preventDefault(); // Prevent the default behavior of the link
        fileInputRef.current.click(); // Trigger the file input click
    };
    
    
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
                        <a href="#">New...</a>
                        <div id="upload">
                        <a onClick={upload}>Open</a>
                        <input type="file" ref={fileInputRef} id="imageLoader" name="imageLoader"/>
                        </div>
                        <a href="#">Save</a>
                        <a href="#">Save As...</a>
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
                        <a href="#">Rotate</a>
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
                        <a href="#">Blur</a>
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