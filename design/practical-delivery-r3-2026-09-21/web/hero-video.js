// One decorative video element, with no source until its scene can actually play.
// Original CSS landscapes remain visible during loading, errors and reduced motion.
export function createHeroVideo(video, sources) {
  let state = { visible: false, hidden: false, paused: false, reduced: false, saveData: false };
  let source = "";
  let attempt = 0;
  let pending = false;
  const failed = new Set();

  function wanted() {
    return !state.hidden && !state.paused && !state.reduced && !state.saveData && state.visible;
  }

  function clear() {
    attempt++;
    pending = false;
    video.pause();
    video.classList.remove("is-ready");
    if (source) {
      source = "";
      video.removeAttribute("src");
      video.load();
    }
  }

  function update(next) {
    state = { ...state, ...next };
    const selected = sources[state.scene] || "";
    if (state.reduced || state.saveData || !selected || (source && selected !== source)) clear();
    if (!wanted() || !selected || failed.has(selected)) {
      attempt++;
      pending = false;
      video.pause();
      return;
    }
    if (!source) {
      source = selected;
      video.muted = true;
      video.src = source;
      video.load();
    }
    if (pending || !video.paused) return;
    const request = ++attempt;
    pending = true;
    Promise.resolve(video.play())
      .catch(() => {
        // Autoplay policies and codec/network errors must leave a usable still.
        if (request === attempt && source === selected) {
          failed.add(selected);
          clear();
        }
      })
      .finally(() => {
        if (request === attempt) pending = false;
      });
  }

  video.addEventListener("playing", () => {
    if (wanted() && source === sources[state.scene]) video.classList.add("is-ready");
    else video.pause();
  });
  video.addEventListener("error", () => {
    // Ignore an obsolete event from a just-aborted source.
    if (!source || !video.error) return;
    failed.add(source);
    clear();
  });
  return { update };
}
