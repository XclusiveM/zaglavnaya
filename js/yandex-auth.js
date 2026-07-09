const YANDEX_CLIENT_ID = "e2139a2152674e2a867cf8875c74db84";

const REDIRECT_URI = window.location.origin + window.location.pathname;

const AUTH_URL = "https://oauth.yandex.ru/authorize";


function generateCodeVerifier() {
    const array = new Uint32Array(56);
    window.crypto.getRandomValues(array);

    return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
}


async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);

    return await window.crypto.subtle.digest(
        "SHA-256",
        data
    );
}


function base64url(buffer) {
    return btoa(
        String.fromCharCode(...new Uint8Array(buffer))
    )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}


async function loginYandex() {

    const verifier = generateCodeVerifier();

    localStorage.setItem(
        "yandex_code_verifier",
        verifier
    );

    const challenge = base64url(
        await sha256(verifier)
    );


    const url =
        AUTH_URL +
        "?response_type=code" +
        "&client_id=" + YANDEX_CLIENT_ID +
        "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
        "&code_challenge=" + challenge +
        "&code_challenge_method=S256";


    window.location.href = url;
}
