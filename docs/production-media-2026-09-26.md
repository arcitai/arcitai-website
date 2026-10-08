# Media correction — production receipt

Delivered under the owner's existing Arc’IT deployment authority. Resources is
a separate local-only review and was not published by this release.

- PR: https://github.com/arcitai/arcitai/pull/8
- Reviewed source: `14db94be33fa79a4741fb9fb10bf560d6c58fed7`.
- Merged main: `0cd552a6f050c5cbafddd39607df29d50f9eb54e` (identical tree).
- Pages production: `c1a89d9a-b8f2-4c9f-94b4-1c4a9d451cad`,
  https://c1a89d9a.arcitai.pages.dev, read back from Wrangler.
- Previous recovery anchor retained: `d9196d93e47fda38532f85caa3de6ec564ef8cb3`,
  https://62342018.arcitai.pages.dev. No rollback was exercised.
- Dedicated inquiry Worker unchanged; no DNS, credentials or Kit changes.

The owner supplied the missing night and morning v6 exports locally. Both were
converted to silent H.264 1280×720, 24fps, 10s with matching first-frame JPEGs.
Original downloads are untouched. Day/evening media remain unchanged.

All four scenes now animate. Mark is black in light and white in dark. Rounded
Play video appears on hover/focus and is visible on touch. Clicking plays the
same landscape with controls, as requested; no unrecorded VSL is implied.
`VITE_VSL_VIDEO_URL` can replace explicit playback later without replacing the
ambient scene. End/retry and reduced-motion behavior are verified.

Proof: 66 repository tests, formatting/lint/build, zero audit vulnerabilities,
Worker typecheck/tests/dry-run, GitHub Quality PASS. Local all-scene playback,
end/focus restore, network-error retry, 390px and reduced-motion checks pass.
Live arcitai.com all four clips play with controls and correct theme mark;
www.arcitai.com morning loop also checked in Chrome. No page exceptions on that
live media journey. A mocked inquiry failure retains input and success clears
it; two requests intercepted, zero real inquiries. 320px overflow check passes.
An initial browser-test helper used an unsupported timer; it was discarded and
the form check rerun successfully in a fresh session. Expected mock 503 is not
a production service incident.

Fetched live media hashes match the reviewed local assets:

- Morning: `552b20781646f9e45004a7882de89022cac7535f26a0b9fd8bbd044e7456712c`
- Night: `0310e1aed2c7254cdcfde84ca1261876b7b121439eaa14a1bdaa6f9e3e7d5fc8`

Delivery and immediate media outcome: PASS. VSL recording remains with Gustav;
the temporary landscape playback is intentional. Recovery anchor available,
rollback not invoked. Broader newsletter integration status is unchanged from
the September 25 release receipt.
