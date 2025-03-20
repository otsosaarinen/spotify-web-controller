import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function Auth() {
    const [code, setCode] = useState<string | null>(null);
    const [state, setState] = useState<string | null>(null);

    // redirect user to backend's url to send GET request for user authorization
    const Authorization = () => {
        const auth_url = new URL(`http://localhost:3000/auth`);

        window.location.href = auth_url.toString();
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const codeParam = urlParams.get("code");
        const stateParam = urlParams.get("state");

        if (codeParam && stateParam) {
            setCode(codeParam);
            setState(stateParam);
        } else {
            console.log("url parameters are missing");
        }
    }, []);

    useEffect(() => {
        const fetch_access_token = async () => {
            if (code && state) {
                const body = new URLSearchParams({ code: code, state: state });
                try {
                    const response = await fetch(
                        `http://localhost:3000/access?code=${code}&state=${state}`,
                        {
                            method: "POST",
                            body: body.toString(),
                        }
                    );
                    const data = await response.json();
                    console.log(data);
                } catch (error) {
                    console.error("Error fetching access token: ", error);
                }
            }
        };

        if (code && state) {
            fetch_access_token();
        }
    }, [code, state]);

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
