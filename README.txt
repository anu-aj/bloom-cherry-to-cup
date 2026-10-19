BLOOM - From Cherry to Cup  (local website)

HOW TO RUN
1. Unzip this folder anywhere.
2. Double-click index.html (works offline), or for a proper local web server run in this folder:
     python -m http.server 8000
   then open http://localhost:8000

FILES
index.html              Home: click-the-cup landing, episodes, the girl, how it's made
behind-the-scenes.html  Credits, pipeline, who made what (own work vs AI)
css/style.css           All styles
js/main.js              Cup click, click-bee effect, scroll reveal, episode video player (EPISODES list at the top)
assets/videos/          The three narrated episodes (MP4, H.264 + AAC, subtitles burned in)
assets/posters/         Poster images shown on the episode cards (replace with your final posters, same file names)
assets/images/          Video poster frames, stills, favicon
assets/fonts/           Fraunces and Figtree (OFL licensed), loaded locally
captions/               episode-01..03.vtt: WebVTT captions, timed from the narration script
assets/docs/            Report and presentation for assessment: BLOOM_Report.pdf, BLOOM_Presentation.pdf

AI ASSISTANCE
The website (layout, code, styles and this README) was built and enhanced with Claude Code,
Anthropic's AI coding assistant (Claude Opus), working from Anugraha's design direction.
The website animations (the floating cup, steam and pour, drifting clouds, scroll reveals,
the click bee and the episode crossfade) were made with Claude's assistance.
Claude also pushed the code to GitHub and deployed it on GitHub Pages:
  https://anu-aj.github.io/bloom-cherry-to-cup/
ChatGPT gave step-by-step guidance for the animation and video compositing.
Full credits are on behind-the-scenes.html.


