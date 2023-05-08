import React, { createContext, useState } from 'react';

const DarkModeContext = createContext({});

const DarkModeSwitchProvider = ({ children }) => {

    let getDarkTheme = JSON.parse(localStorage.getItem("darkTheme"));
    if (!getDarkTheme) {
        getDarkTheme = false;
    }
    const [ifDarkMode, setIfDarkMode] = useState(getDarkTheme);
    const toggleDarkMode = () => {
        localStorage.setItem("darkTheme", JSON.stringify(!ifDarkMode));
        setIfDarkMode(!ifDarkMode);
    }
    const clearDarkMode = () => {
        localStorage.setItem("darkTheme", JSON.stringify(false));
        setIfDarkMode(false);
    }
   
    return (
        <DarkModeContext.Provider value={{ ifDarkMode, toggleDarkMode, clearDarkMode }} >
            {children}
        </DarkModeContext.Provider>
    );
}

export {DarkModeContext, DarkModeSwitchProvider};