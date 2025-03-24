import { useState, useEffect } from "react";
import Auth from "./Auth";
import Header from "./Header";
import Music from "./Music";
import ReAuthenticate from "./reAuthenticate";

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
            <div className="flex flex-col gap-10 justify-center items-center h-screen bg-white font-roboto">
                <Header />

                {isAuthenticated ? (
                    <>
                        <Music />
                        <ReAuthenticate />
                    </>
                ) : (
                    <Auth />
                )}
            </div>
        </>
    );
}

export default App;
