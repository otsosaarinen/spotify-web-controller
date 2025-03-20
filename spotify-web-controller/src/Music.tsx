import PlayCircleFilled from "@mui/icons-material/PlayCircleFilled";
import PauseCircleFilled from "@mui/icons-material/PauseCircleFilled";
import SkipNext from "@mui/icons-material/SkipNext";
import SkipPrevious from "@mui/icons-material/SkipPrevious";
import { IconButton } from "@mui/material";

function Music() {
    // get access token from the localstorage
    const access_token = localStorage.getItem("access_token");

    const playMusic = () => {
        fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: { Authorization: `Bearer ${access_token}` },
        });
    };

    const pauseMusic = () => {
        fetch("https://api.spotify.com/v1/me/player/pause", {
            method: "PUT",
            headers: { Authorization: `Bearer ${access_token}` },
        });
    };

    // API call for skipping to next song
    const skipToNext = () => {
        fetch("https://api.spotify.com/v1/me/player/next", {
            method: "POST",
            headers: { Authorization: `Bearer ${access_token}` },
        });
    };

    // API call for skipping to previous song
    const skipToPrevious = () => {
        fetch("https://api.spotify.com/v1/me/player/previous", {
            method: "POST",
            headers: { Authorization: `Bearer ${access_token}` },
        });
    };

    return (
        <>
            <div className="flex flex-row justify-center items-center border-solid border-3 rounded-4xl border-blue-500">
                <IconButton
                    size="large"
                    color="primary"
                    onClick={skipToPrevious}
                >
                    <SkipPrevious fontSize="inherit" />
                </IconButton>

                <IconButton size="large" color="primary" onClick={playMusic}>
                    <PlayCircleFilled fontSize="inherit" />
                </IconButton>

                <IconButton size="large" color="primary" onClick={pauseMusic}>
                    <PauseCircleFilled fontSize="inherit" />
                </IconButton>

                <IconButton size="large" color="primary" onClick={skipToNext}>
                    <SkipNext fontSize="inherit" />
                </IconButton>
            </div>
        </>
    );
}

export default Music;
