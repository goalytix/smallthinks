# smallthinks

Free, simple games for kids aged 4–7. Plain HTML, CSS and JavaScript. There's no build step, and no ads or tracking.

## Games

- **numtap**: tap one of the numbers 1–120 and it turns a bright color, with a pop sound and the number read out loud.
- **numfade**: a "Next" square shows the coming color. Tap a white box to place it. If it lands next to a box of the same color (above, below, left or right), they fade into empty slots with a whoosh. When no white boxes are left: confetti! Each color also has a shape (♥ ▲ ★ ■ ● ◆) for kids who can't tell some colors apart.
- **numchomp**: the dog wants a number of donuts. Add donuts ("I want 8! I have 5") or take some back ("I have 9, I only want 6"), then press **Feed me!**. Right: it munches and shows the sum (5 + 3 = 8). Too many: it burps. Ten stars wins. Three sizes: up to 5, 10 or 20.

## Try it on your computer

Open `index.html` in a browser. That's all you need.

## Folder layout

```
index.html          home page with a card for each game
shared/style.css    colors, fonts, top bar and buttons for every page
shared/nav.js       the list of games (GAMES) and the top bar
shared/sound.js     pop, whoosh, chomp, burp and ta-da sounds, reading numbers aloud, sound on/off
shared/confetti.js  confetti for a happy finish
shared/hold.js      press-and-hold buttons (used for Reset)
shared/fonts/       the Baloo 2 font (free, SIL Open Font License)
games/numtap/       the numtap game
games/numfade/      the numfade game
games/numchomp/     the numchomp game
```

## Add a new game

1. Copy `games/numtap/` to `games/<your-game>/` and rename the files.
2. In the new `index.html`, change `data-game="numtap"` to your game's id.
3. Add one line to the `GAMES` list in `shared/nav.js`:
   ```js
   { id: "your-game", name: "your game", emoji: "🎨", about: "One short line." },
   ```
   The tab and the home-page card show up on their own.

## Publish free on GitHub Pages

1. Make a new repository on GitHub named `smallthinks` (leave it empty).
2. Push this folder to it:
   ```sh
   git add .
   git commit -m "First version of smallthinks"
   git remote add origin https://github.com/<your-username>/smallthinks.git
   git push -u origin main
   ```
3. On GitHub, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then branch **main** and folder **/ (root)**, and click **Save**.
4. After a minute or two the site is live at `https://<your-username>.github.io/smallthinks/`.

Every later `git push` updates the site.
