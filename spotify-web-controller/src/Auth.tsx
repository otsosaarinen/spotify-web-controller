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
        const generateCodeChallenge = async () => {
            const verifier = generateRandomString(64);
            setCodeVerifier(verifier);

            // save verifier to localstorage
            localStorage.setItem("code_verifier", verifier);
            console.log("This verifier saved to localstorage ", verifier);

            const hashed = await sha256(verifier);
            const challenge = base64encode(hashed);
            setCodeChallenge(challenge);
        };

        generateCodeChallenge();
    }, []);

    const Authorization = () => {
        const authUrl = new URL(
            `http://localhost:3000/auth?code_challenge=${codeChallenge}`
        );

        window.location.href = authUrl.toString();
    };

    const getAccessToken = async (code: string) => {
        const accessCodeVerifier = localStorage.getItem("code_verifier");
        console.log(
            "This verifier was loaded before request ",
            accessCodeVerifier
        );

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
            console.log(data);
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
