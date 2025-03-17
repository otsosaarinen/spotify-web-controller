import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function Auth() {
    const [codeVerifier, setCodeVerifier] = useState<string>("");
    const [codeChallenge, setCodeChallenge] = useState<string>("");

    const generateRandomString = (length: number): string => {
        const possible =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce(
            (acc, x) => acc + possible[x % possible.length],
            ""
        );
    };

    const sha256 = async (plain: string): Promise<ArrayBuffer> => {
        const encoder = new TextEncoder();
        const data: Uint8Array = encoder.encode(plain);
        return window.crypto.subtle.digest("SHA-256", data);
    };

    const base64encode = (input: ArrayBuffer): string => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    };

    useEffect(() => {
        // check if a code verifier already exists in localstorage
        const savedCodeVerifier = localStorage.getItem("code_verifier");
        if (savedCodeVerifier) {
            // if it exists, use it and generate the code challenge
            setCodeVerifier(savedCodeVerifier);
            const hashed = sha256(savedCodeVerifier);
            hashed.then((hash) => {
                const challenge = base64encode(hash);
                setCodeChallenge(challenge);
            });
        } else {
            // if no code verifier exists, create a new one and store it in localstorage
            const verifier = generateRandomString(64);
            setCodeVerifier(verifier);
            localStorage.setItem("code_verifier", verifier);

            const hashed = sha256(verifier);
            hashed.then((hash) => {
                const challenge = base64encode(hash);
                setCodeChallenge(challenge);
            });
        }
    }, []);

    // redirect user to backend's url to send GET request for user authorization
    const Authorization = () => {
        const authUrl = new URL(
            `http://localhost:3000/auth?code_challenge=${codeChallenge}`
        );

        window.location.href = authUrl.toString();
    };

    const getAccessToken = async (code: string) => {
        const accessCodeVerifier = localStorage.getItem("code_verifier");

        if (!accessCodeVerifier) {
            console.log("Code verifier is missing");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/access`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    code_verifier: accessCodeVerifier,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to receive access token");
            }

            const data = await response.json();
            // save access token to localstorage
            localStorage.setItem("access_token", data.access_token);
        } catch (error) {
            console.error("Error exchanging code for access token", error);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get("code") as string;

        if (!code) {
            console.log("No code in the url, authorize using spotify first");
        } else getAccessToken(code);
    }, []);

    return (
        <div>
            <Button
                variant="contained"
                size="large"
                endIcon={<OpenInNewIcon />}
                onClick={Authorization}
            >
                Click here to authorize
            </Button>
        </div>
    );
}

export default Auth;
