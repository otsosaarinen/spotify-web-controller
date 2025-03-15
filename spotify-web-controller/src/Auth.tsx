import Button from "@mui/material/Button";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function Auth() {
    return (
        <>
            <div className="">
                <Button
                    variant="contained"
                    size="large"
                    endIcon={<OpenInNewIcon />}
                >
                    Click here to authorize
                </Button>
            </div>
        </>
    );
}

export default Auth;
