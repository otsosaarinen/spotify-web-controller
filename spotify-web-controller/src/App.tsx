import { useState, useEffect } from "react";
import Auth from "./Auth";
import Header from "./Header";
import Music from "./Music";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <>
            <div className="flex justify-center items-center h-screen bg-white font-roboto">
                <Header />

                {isAuthenticated ? <Music /> : <Auth />}
            </div>
        </>
    );
}

export default App;
