import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Auth from "./Auth";
import Header from "./Header";

function App() {
    return (
        <>
            <div className="flex justify-center items-center h-screen bg-neutral-900">
                <Header />
                <Auth />
            </div>
        </>
    );
}

export default App;
