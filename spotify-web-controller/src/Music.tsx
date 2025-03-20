import { useEffect, useState } from "react";
import PlayCircleFilled from "@mui/icons-material/PlayCircleFilled";
import PauseCircleFilled from "@mui/icons-material/PauseCircleFilled";
import SkipNext from "@mui/icons-material/SkipNext";
import SkipPrevious from "@mui/icons-material/SkipPrevious";
import { IconButton } from "@mui/material";

function Music() {
    // get access token from the localstorage
    const access_token = localStorage.getItem("access_token");

    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const [currentSong, setCurrentSong] = useState({
        title: "Unknown",
        artist: "Unknown",
    });

    const getPlaybackState = async () => {
        const response = await fetch("https://api.spotify.com/v1/me/player", {
            method: "GET",
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const data = await response.json();
        if (data.item) {
            setCurrentSong({
                title: data.item.name,
                artist: data.item.artists[0].name,
            });
        }

        // sets isPlaying value
        setIsPlaying(data["is_playing"]);
    };

    const playMusic = async () => {
        await fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: { Authorization: `Bearer ${access_token}` },
        });

        await getPlaybackState();
    };

    const pauseMusic = async () => {
        await fetch("https://api.spotify.com/v1/me/player/pause", {
            method: "PUT",
            headers: { Authorization: `Bearer ${access_token}` },
        });

        await getPlaybackState();
    };

    // API call for skipping to next song
    const skipToNext = async () => {
        await fetch("https://api.spotify.com/v1/me/player/next", {
            method: "POST",
            headers: { Authorization: `Bearer ${access_token}` },
        });

        // wait for 250ms before updates the current song
        setTimeout(() => {
            getPlaybackState();
        }, 250); //
    };

    // API call for skipping to previous song
    const skipToPrevious = async () => {
        await fetch("https://api.spotify.com/v1/me/player/previous", {
            method: "POST",
            headers: { Authorization: `Bearer ${access_token}` },
        });

        // wait for 250ms before updates the current song
        setTimeout(() => {
            getPlaybackState();
        }, 250); //
    };

    // run getPlaybackState on page load to update the current song
    useEffect(() => {
        getPlaybackState();
    }, []);

    return (
        <>
            <div className="flex flex-col justify-center items-center gap-5">
                <div className="text-xl font-medium">
                    <span>
                        {currentSong.title} - {currentSong.artist}
                    </span>
                </div>
                <div className="flex flex-row justify-center items-center border-solid border-4 rounded-4xl border-blue-500">
                    <IconButton
                        size="large"
                        color="primary"
                        onClick={skipToPrevious}
                    >
                        <SkipPrevious fontSize="inherit" />
                    </IconButton>

                    {isPlaying ? (
                        <IconButton
                            size="large"
                            color="primary"
                            onClick={pauseMusic}
                        >
                            <PauseCircleFilled fontSize="inherit" />
                        </IconButton>
                    ) : (
                        <IconButton
                            size="large"
                            color="primary"
                            onClick={playMusic}
                        >
                            <PlayCircleFilled fontSize="inherit" />
                        </IconButton>
                    )}

                    <IconButton
                        size="large"
                        color="primary"
                        onClick={skipToNext}
                    >
                        <SkipNext fontSize="inherit" />
                    </IconButton>
                </div>
            </div>
        </>
    );
}

export default Music;
