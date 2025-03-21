import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

const auth_endpoint = "/auth";
const access_endpoint = "/access";

const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = process.env.REDIRECT_URI as string;

app.use(cors());
app.use(express.json());

app.get(auth_endpoint, (req, res) => {
    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
        res.status(400).send(
            "Missing environment variables (CLIENT_ID or CLIENT_SECRET or REDIRECT_URI)."
        );
    }

    const state = generateRandomString(16);
    const scope = "user-read-playback-state user-modify-playback-state";

    const authUrl = new URL("https://accounts.spotify.com/authorize");

    const params = {
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: scope,
        show_dialog: "true",
    };

    authUrl.search = new URLSearchParams(params).toString();

    res.redirect(authUrl.toString());
});

app.post(access_endpoint, async (req, res) => {
    const code = req.body.code || null;
    const state = req.body.state || null;

    if (state === null) {
        res.status(400).send("State parameter is missing");
    } else {
        const body = new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: REDIRECT_URI,
        });

        const authorization = Buffer.from(
            CLIENT_ID + ":" + CLIENT_SECRET
        ).toString("base64");

        try {
            const response = await fetch(
                "https://accounts.spotify.com/api/token",
                {
                    method: "POST",
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                        Authorization: `Basic ${authorization}`,
                    },
                    body: body.toString(),
                }
            );

            const data = await response.json();
            console.log(data);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: "error occured" });
        }
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
