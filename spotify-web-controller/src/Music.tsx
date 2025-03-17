import PlayCircleFilled from "@mui/icons-material/PlayCircleFilled";
import { IconButton } from "@mui/material";

function Music() {
    const skipToNext = () => {
        const access_token = localStorage.getItem("access_token");
        fetch("https://api.spotify.com/v1/me/player/next", {
            method: "POST",
            headers: { Authorization: `Bearer ${access_token}` },
        });
    };

    return (
        <>
            <IconButton size="large" color="primary" onClick={skipToNext}>
                <PlayCircleFilled fontSize="inherit" />
            </IconButton>
        </>
    );
}

export default Music;
