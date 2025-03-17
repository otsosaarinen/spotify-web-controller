import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

const auth_endpoint = "/auth";
const access_endpoint = "/access";

const CLIENT_ID = process.env.CLIENT_ID as string;
const REDIRECT_URI = process.env.REDIRECT_URI as string;

app.use(cors());
app.use(express.json());

app.get(auth_endpoint, (req, res) => {
    if (!CLIENT_ID || !REDIRECT_URI) {
        res.status(500).send(
            "Missing environment variables (CLIENT_ID or REDIRECT_URI)."
        );
    }

    const state = generateRandomString(16);
    const scope = "user-read-playback-state user-modify-playback-state";
    const code_challenge_method = "S256";

    const code_challenge = req.query.code_challenge as string;

    if (typeof code_challenge !== "string") {
        res.status(400).send("Missing or invalid code_challenge parameter.");
    }

    const authUrl = new URL("https://accounts.spotify.com/authorize");

    const params = {
        response_type: "code",
        client_id: CLIENT_ID,
        state,
        scope,
        code_challenge_method,
        code_challenge,
        redirect_uri: REDIRECT_URI,
    };

    authUrl.search = new URLSearchParams(params).toString();

    res.redirect(authUrl.toString());
});

app.post(access_endpoint, async (req, res) => {
    const code = req.body.code as string;
    const code_verifier = req.body.code_verifier as string;

    if (!code || !code_verifier) {
        res.status(400).send("Missing 'code' or 'code_verifier'");
    }

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                grant_type: "authorization_code",
                code,
                redirect_uri: REDIRECT_URI,
                code_verifier: code_verifier,
            }),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            res.json(data);
        } else {
            res.status(400).json(data);
        }
    } catch (error) {
        res.status(500).send("Failed to get access token");
    }
});

function generateRandomString(length: number) {
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
});
