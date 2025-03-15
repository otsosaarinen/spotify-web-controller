import Auth from "./Auth";
import Header from "./Header";

function App() {
    return (
        <>
            <div className="flex justify-center items-center h-screen bg-white">
                <Header />
                <Auth />
            </div>
        </>
    );
}

export default App;
