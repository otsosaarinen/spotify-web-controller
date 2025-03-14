import Button from "@mui/material/Button";

function Auth() {
    return (
        <>
            <div className="h-screen w-screen flex flex-col justify-center items-center">
                <div>spotify-web-controller</div>
                <Button size="large">Click here to authorize</Button>
            </div>
        </>
    );
}

export default Auth;
