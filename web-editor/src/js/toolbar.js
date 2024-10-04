import React from "react";
import '../css/toolbar.css'
import { RxText } from "react-icons/rx";
import { IoBrushSharp } from "react-icons/io5";
import { LuBoxSelect } from "react-icons/lu";
import { LuLasso } from "react-icons/lu";
import { BsEyedropper } from "react-icons/bs";
import { PiPaintBucketBold } from "react-icons/pi";





export const Toolbar = () => {
    
    return ( 
        <nav className="toolbar">
            <ul>
                <li>
                    <a><RxText/></a>
                </li>
                <li>
                    <a><IoBrushSharp/></a>
                </li>
                <li>
                    <a><LuBoxSelect/></a>
                </li>
                <li>
                    <a><LuLasso/></a>
                </li>
                <li>
                    <a><BsEyedropper/></a>
                </li>
                <li>
                    <a><PiPaintBucketBold/></a>
                </li>
                <li className="color-container">
                    <a className="color"></a>
                </li>
            </ul>
        </nav>
    )
}