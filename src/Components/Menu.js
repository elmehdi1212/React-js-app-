import React from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
const Menu = () => {
    const items = [
        {
            label: 'Map',
            icon: 'pi pi-fw pi-map',
           
          
        },
        {
            label: 'Amis',
            icon: 'pi pi-fw pi-people',
          
        }
    ];

    const start = <img alt="logo" src="showcase/images/logo.png" onError={(e) => e.target.src='data:image/png;base64,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'} height="40" className="p-mr-2"></img>;
  

    return (
        <div>
            <div className="card">
                <Menubar model={items} start={start} >
                
		
                  </Menubar>
                  
               
               
            </div>
        </div>
    );
}
              
export default Menu;