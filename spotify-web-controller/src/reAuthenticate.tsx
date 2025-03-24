import Button from "@mui/material/Button";

function ReAuthenticate() {
    const reAuthorize = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <>
            <div className="flex justify-center items-center">
                <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={reAuthorize}
                >
                    Reauthorize
                </Button>
            </div>
        </>
    );
}
export default ReAuthenticate;
