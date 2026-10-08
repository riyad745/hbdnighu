# Nighu Birthday Surprise ❤️
Static site — GitHub Pages ready (no backend).

## Deploy
1. Ei folder er sob kichu (index.html, style.css, script.js, assets/) repo te push korun.
2. Repo > Settings > Pages > Branch: `main` / root > Save.

## Customize
`script.js` er ekdom upore `CONFIG` — naam, date, message, memories timeline, audio, theme.

## Song
`assets/audio/happy-birthday.mp3` nam e file rakhun. Na thakle built-in melody bajbe.

## Photo
Website e "Upload Our Memory ❤️" button diye photo din — IndexedDB te save hoy.
⚠️ Eta shudhu oi browser/device e thake. Nighur phone e dekhate chaile oi phone theke upload korte hobe
(othoba apnar phone e site khule dekhan). Shobar jonno fixed photo chaile timeline e `photo: "assets/m1.jpg"` use korun.

## Test
- `index.html?test=8` — 8 second por celebration
- `index.html?preview=site` — shorashori main site
- Time Asia/Dhaka (UTC+6) onujayi, device timezone e kichu ashe jay na. Tobe device er clock thik thaka dorkar.
- Midnight er age page ta khule "Open your surprise" e ekbar tap kore rakhte hobe (browser autoplay rule), tahole 12:00 e song auto bajbe.