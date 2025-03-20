import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import PlayCircleFilled from "@mui/icons-material/PlayCircleFilled";
import PauseCircleFilled from "@mui/icons-material/PauseCircleFilled";
import SkipNext from "@mui/icons-material/SkipNext";
import SkipPrevious from "@mui/icons-material/SkipPrevious";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";

function Music() {
    // get access token from the localstorage
    const access_token = localStorage.getItem("access_token");

    // set variables for the player
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(50);
    const [currentSong, setCurrentSong] = useState({
        title: "Unknown",
        artist: "Unknown",
    });
    const [backgroundUrl, setBackgroundUrl] = useState<string>("");
    const [songUrl, setSongUrl] = useState<string>("");

    const getPlaybackState = async () => {
        const response = await fetch("https://api.spotify.com/v1/me/player", {
            method: "GET",
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const data = await response.json();

        if (data) {
            setCurrentSong({
                title: data.item.name,
                artist: data.item.artists[0].name,
            });
            setIsPlaying(data["is_playing"]);
            setVolume(data.device.volume_percent);
            setBackgroundUrl(data.item.album.images[0].url);
            setSongUrl(data.item.external_urls.spotify);
        }
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

    // updates volume slider
    const handleChange = (event: Event, newValue: number | number[]) => {
        setVolume(newValue as number);
    };

    // change playback volume
    const changeVolume = async () => {
        const newVolume = volume;

        await fetch(
            `https://api.spotify.com/v1/me/player/volume?volume_percent=${newVolume}`,
            {
                method: "PUT",
                headers: { Authorization: `Bearer ${access_token}` },
            }
        );
    };

    const openSongUrl = () => {
        const SpotifySongUrl = songUrl;
        window.open(SpotifySongUrl, "_blank");
    };

    // run getPlaybackState on page load to update the current song
    useEffect(() => {
        getPlaybackState();

        const interval = setInterval(() => {
            getPlaybackState();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="flex flex-col justify-center items-center gap-5">
                <div className="">
                    <img
                        src={backgroundUrl}
                        alt="background image"
                        className="h-auto w-xs bg-cover"
                    />
                </div>
                <div className="text-xl font-medium">
                    <span>
                        {currentSong.title} - {currentSong.artist}
                    </span>
                </div>
                <div className="w-3xs flex flex-row justify-evenly items-center border-solid border-4 rounded-4xl border-blue-500">
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

                <div className="flex flex-row items-center gap-2 w-3xs h-20">
                    <VolumeDown />
                    <Slider
                        aria-label="Volume"
                        color="primary"
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        value={volume}
                        onChange={handleChange}
                        onChangeCommitted={changeVolume}
                    />
                    <VolumeUp />
                </div>

                <div className="">
                    <Button
                        variant="contained"
                        size="medium"
                        onClick={openSongUrl}
                    >
                        Open in Spotify
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Music;
