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

            const hashed = await sha256(verifier);
            const challenge = base64encode(hashed);
            setCodeChallenge(challenge);
        };

        generateCodeChallenge();
    }, []);

    return (
        <div>
            <Button
                variant="contained"
                size="large"
                endIcon={<OpenInNewIcon />}
            >
                Click here to authorize
            </Button>
        </div>
    );
}

export default Auth;
