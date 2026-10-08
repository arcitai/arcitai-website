# Arc’IT hero motion — production handed off

24 September 2026. Requested: animate the existing Arc’IT hero landscapes through Google Flow, using the approach in Kastanje. Parent browser control is unavailable. The bounded local `gpt-6-luna` / max worker performed capability checks only and is now stopped. It generated nothing and spent no Flow credits. The user's separate animation helper has since obtained supported Flow access and is producing/revising candidates. No accepted clip is integrated here; do not substitute CSS zoom and call it generated video.

## Verified worker limitation

Worker: `01a0d483-a8c1-7791-9e66-f9df600d017c`. CUA computer-use tools were available, but both browser and tab inventories returned empty. The supported native-app check was explicitly denied: “Computer Use is not allowed to use the app 'com.openai.codex' for safety reasons.” No Flow page or settings were observed. The worker stopped; there is no generation running. Do not work around that restriction with hidden app internals, debugging ports or another automation surface.

The final legitimate separate-browser check was also refused: “Computer Use was not approved to use Zen.” It returned no window/AX/screenshot and opened no tab. Evidence: `hero-worker-preflight-result.md`, `hero-worker-native-preflight-result.md` and `hero-worker-separate-browser-result.md`. The model/effort were supplied in the CLI launch and resume flags; the worker could not independently read them from runtime metadata. All worker invocations have exited; no controller is running.

## Current continuation owner

Gustav's separate animation helper task `01a0d488-a887-7041-a58a-3df91dc1baf8` owns browser/video coordination for the four Arc’IT scenes and single Resources image. Do not resume the old worker or start parallel control. It confirmed supported Flow/PRO access and project `75247d81-4920-4f29-a46f-947c856d8128`. Initial takes were generated; later attempts introduced unwanted objects and were rejected. The helper reports a revised compositing approach with original composition, generated water and bounded motion of existing objects. Follow its actual accepted handoff, not the rejected raw candidates. This Arc’IT task retains integration and review ownership; await real files and `HANDOFF.md`.

## Recovered reference

Read Kastanje's actual saved `design/landing-cinematic/r5/ANIMATION.md` on disk, and the referenced task “Landing page redesign”. Its accepted process used the same illustration as first and last frame, a locked camera, ten-second silent clips, then H.264 1280×720 web exports with faststart and still-image fallbacks. Its historical model choice was Omni 1.1 Flash after an unsatisfactory Veo 3.1 Lite attempt. That does not establish today's model availability or account balance.

[Existing Kastanje Flow project](https://flow.google.com/project/660085fe-3cc9-48e4-b99c-d283e85495c9). Inspect it when browser control is available; preserve its work. Arc’IT should be a separate project.

Kastanje's prompt animated a chestnut mascot. That acting is not transferable: Arc’IT explicitly rejected a pet. Transfer the stable camera, preserved composition, small deliberate motion and loop constraint.

## Original inputs

Repository root: `/Users/gustavanderson/Downloads/arcitai`.

- `public/assets/arcitai-panorama-day-v1.jpg` — current light preview.
- `public/assets/arcitai-panorama-night-v1.jpg` — current dark preview.
- `public/assets/arcitai-panorama-morning-v1.jpg` — original alternative.
- `public/assets/arcitai-panorama-evening-v1.jpg` — original alternative.

Prioritize day/night for this preview, then the original morning/evening alternatives. Preserve all originals. Do not use screenshots containing the overlaid landing copy or logo.

## Proposed Flow prompt

> Animate this exact illustrated Danish landscape as a quiet ten-second looping website background. Keep the camera completely locked: no pan, tilt, zoom, dolly, reframing or parallax. Preserve the composition, architecture, coastline, fields, pixel details, colors and the existing time of day. The landscape must remain recognizable and structurally unchanged in every frame. Add only very subtle environmental motion: small slow ripples in the harbor and sea, a slight shimmer in existing water reflections, and a barely perceptible breeze through existing foliage and grasses. Keep buildings, roads, cliffs, the embedded A-shaped monument and all technical/pixel motifs fixed. Keep clouds almost still. No new objects, characters, faces, limbs, lettering, interface elements or logos. No time-lapse, sweeping shadows, flashing lights or weather change. Motion should sit quietly behind readable page text, never compete with it. Return naturally to the supplied starting composition at the end for a smooth loop. Silent, no music or sound effects.

Day: keep the supplied daylight stable. Night: retain the supplied night palette and existing window lights; only subtle motion in reflected light, no flicker or added lights. Morning/evening: preserve the source's existing light, not a transition between times of day.

Use the source as start and end frame if the selected model supports that mode. Preserve its framing/aspect ratio where possible; if the model requires 16:9, inspect the crop before generating. Do not stretch.

## Finish when generation is available

Inspect actual Flow settings and cost first; do not purchase credits or upgrade. Generate a bounded first day/night pair, review for drift, warping, camera movement and visible loop seams, then choose output. Download the generated files through the normal UI. Keep raw takes outside the served web directory.

Export silent, web-optimized MP4 with a matching still poster; add WebM only if useful. Integrate only verified existing files. Load only the selected scene, retain the static image on errors/reduced motion, and connect playback to global pause, visibility and offscreen state. Check day/night transitions, mobile crop, text contrast and payload size. No live deployment.
