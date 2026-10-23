import {
  storyPoint,
  storySize,
  type MosaicStory,
  type StoryContext,
  type StoryMark,
  type StoryPoint,
  type StoryTile,
} from "./mosaic-story";
import { dataBounds, dataCells } from "./mosaic-data";
export { dataCells } from "./mosaic-data";

export const endings = [
  {
    id: "quiet",
    label: "Quiet",
    description: "Keep the source islands; let DATA appear quietly in the tiles.",
  },
  {
    id: "sources",
    label: "Sources",
    description: "Gather the source islands into the foundation, keeping its platforms.",
  },
  {
    id: "all",
    label: "All",
    description: "Gather every brand, leaving a continuous field of DATA.",
  },
] as const;
export type EndingId = (typeof endings)[number]["id"];
export function endingId(search: string): EndingId {
  const value = new URLSearchParams(search).get("ending");
  return endings.find((ending) => ending.id === value)?.id ?? "all";
}
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => {
  const t = clamp(n);
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export type EndingTimeline = {
  id: EndingId;
  contexts: Record<string, number>;
  departures: Record<string, number>;
  dataStarts: number;
  ends: number;
  ink: number;
};
/** A source owns both its drifting fragments and the exact tiles collected by the agents. */
export function sourceSettles(story: MosaicStory, id: string) {
  return Math.max(
    0,
    ...story.tiles
      .filter((tile) => tile.source === id)
      .map((tile) => {
        const job = tile.job === undefined ? undefined : story.jobs[tile.job];
        return job ? job.starts + job.duration : tile.starts + tile.duration;
      }),
  );
}
export function endingTimeline(
  story: MosaicStory,
  id: EndingId,
  previous?: EndingTimeline,
  switchedAt = 0,
): EndingTimeline {
  const contexts: Record<string, number> = {};
  const departures: Record<string, number> = {};
  if (id !== "quiet")
    story.sources.forEach((mark, index) => {
      const start =
        previous?.contexts[mark.id] ??
        Math.max(sourceSettles(story, mark.id) + 2, previous ? switchedAt + 1.2 + index * 0.45 : 0);
      contexts[mark.id] = start;
      // The two remaining context tiles arrive before their software's logo leaves.
      departures[mark.id] = start + 3.4;
    });
  const sourcesEnd = Math.max(story.ends, ...Object.values(departures).map((t) => t + 6));
  if (id === "all") {
    story.platforms
      .filter((mark) => mark.id !== "arcitai")
      .forEach((mark, index) => {
        departures[mark.id] =
          previous?.departures[mark.id] ??
          Math.max(sourcesEnd + 3 + index * 2.5, previous ? switchedAt + 1.2 + index * 2.5 : 0);
      });
    departures.arcitai = Math.max(...Object.values(departures)) + 7;
  }
  const computedDataStart =
    id === "quiet" ? story.ends + 4 : id === "sources" ? sourcesEnd + 3 : departures.arcitai + 3;
  const dataStarts =
    previous && previous.dataStarts <= switchedAt ? previous.dataStarts : computedDataStart;
  return {
    id,
    contexts,
    departures,
    dataStarts,
    ends: Math.max(dataStarts + 8, computedDataStart),
    ink: id === "quiet" ? 0.22 : id === "sources" ? 0.26 : 0.94,
  };
}

export type EndingFrame = StoryPoint & { scale: number; opacity: number; flying: boolean };
export function storyAppearance(start: number | undefined, seconds: number, complete = false) {
  const progress = complete || start === undefined ? 1 : ease((seconds - start) / 0.9);
  return { opacity: progress, rise: (1 - progress) * 6 };
}
const centre = (story: MosaicStory, mark: StoryMark) => {
  const p = storyPoint(mark.column, mark.row, story.basis);
  const size = mark.span * 36.4 - 8.4;
  return {
    x: p.x + (size * (story.basis.ux + story.basis.vx)) / 2,
    y: p.y + (size * (story.basis.uy + story.basis.vy)) / 2,
  };
};
function gatherFrame(
  story: MosaicStory,
  origin: StoryPoint,
  size: number,
  seconds: number,
  start: number,
  duration: number,
): EndingFrame {
  const t = ease((seconds - start) / duration);
  const scale = mix(1, 0.4, t);
  const dx = (size * (story.basis.ux + story.basis.vx)) / 2;
  const dy = (size * (story.basis.uy + story.basis.vy)) / 2;
  const from = { x: origin.x + dx, y: origin.y + dy };
  const to = centre(story, story.platforms[0]);
  // Descend beside the headline before turning inward. No bounce or reverse flight.
  const control = { x: from.x, y: to.y };
  return {
    x: (1 - t) ** 2 * from.x + 2 * (1 - t) * t * control.x + t * t * to.x - dx * scale,
    y: (1 - t) ** 2 * from.y + 2 * (1 - t) * t * control.y + t * t * to.y - dy * scale,
    scale,
    opacity: 1 - ease((t - 0.6) / 0.4),
    flying: t > 0 && t < 1,
  };
}
export function endingMarkFrame(
  story: MosaicStory,
  mark: StoryMark,
  timeline: EndingTimeline,
  seconds: number,
  complete = false,
): EndingFrame {
  const time = complete ? timeline.ends : seconds;
  const p = storyPoint(mark.column, mark.row, story.basis);
  const arrival = storyAppearance(mark.appears, time, complete);
  const start = timeline.departures[mark.id];
  if (start === undefined || time < start)
    return { x: p.x, y: p.y + arrival.rise, scale: 1, opacity: arrival.opacity, flying: false };
  if (mark.id === "arcitai") {
    const t = ease((time - start) / 3);
    return { x: p.x, y: p.y + t * 4, scale: 1 - t * 0.1, opacity: 1 - t, flying: t > 0 && t < 1 };
  }
  return gatherFrame(story, p, mark.span * 36.4 - 8.4, time, start, 6);
}
export function endingContextFrame(
  story: MosaicStory,
  tile: StoryContext,
  timeline: EndingTimeline,
  seconds: number,
  complete = false,
): EndingFrame {
  const time = complete ? timeline.ends : seconds;
  const p = storyPoint(tile.column, tile.row, story.basis);
  p.x += storySize * 0.09 * (story.basis.ux + story.basis.vx);
  p.y += storySize * 0.09 * (story.basis.uy + story.basis.vy);
  const mark = story.sources.find((source) => source.id === tile.markId)!;
  const arrival = storyAppearance(mark.appears, time, complete);
  const start = timeline.contexts[tile.markId];
  return start === undefined || time < start
    ? { x: p.x, y: p.y + arrival.rise, scale: 1, opacity: arrival.opacity, flying: false }
    : gatherFrame(story, p, storySize * 0.82, time, start, 3);
}

export function endingInk(
  tile: StoryTile,
  timeline: EndingTimeline,
  seconds: number,
  complete = false,
) {
  const cell = dataCells.find((cell) => cell.column === tile.column && cell.row === tile.row);
  return !cell
    ? 0
    : timeline.ink * (complete ? 1 : ease((seconds - timeline.dataStarts - cell.delay) / 0.8));
}
/** Settle the word's background without introducing a separate plane or a hard-edged panel. */
export function endingCalm(
  tile: StoryTile,
  timeline: EndingTimeline,
  seconds: number,
  complete = false,
) {
  const left = dataBounds.left - 1,
    right = dataBounds.right + 1;
  if (tile.accent || tile.column < left || tile.column > right) return 0;
  const cell = dataCells.find((cell) => cell.column === tile.column && cell.row === tile.row);
  if (cell) return complete ? 1 : ease((seconds - timeline.dataStarts - cell.delay) / 0.8);
  const edge = tile.column === left || tile.column === right || tile.row === 0 || tile.row === 6;
  return (edge ? 0.35 : 0.7) * (complete ? 1 : ease((seconds - timeline.dataStarts) / 6.8));
}
export function endingAccent(
  tile: StoryTile,
  timeline: EndingTimeline,
  seconds: number,
  complete = false,
) {
  const start = tile.accent ? timeline.departures[tile.accent] : undefined;
  return start === undefined ? 1 : complete ? 0 : 1 - ease((seconds - start) / 3);
}
export function endingWorkers(timeline: EndingTimeline, seconds: number, complete = false) {
  return complete ? 0 : 1 - ease((seconds - timeline.dataStarts) / 1.5);
}
/** Vacated platform footprints become ordinary foundation cells in All, without adding data identities. */
export function endingFoundation(
  story: MosaicStory,
  timeline: EndingTimeline,
  seconds: number,
  complete = false,
) {
  return story.platforms.flatMap((mark) => {
    const opacity =
      timeline.id !== "all"
        ? 0
        : complete
          ? 1
          : ease((seconds - timeline.departures[mark.id] - 1) / 3);
    return Array.from({ length: mark.span ** 2 }, (_, i) => ({
      id: `foundation-${mark.id}-${i}`,
      column: mark.column + (i % mark.span),
      row: mark.row + Math.floor(i / mark.span),
      opacity,
    }));
  });
}

/** Crossfades returning islands at home; newly departing islands receive a future departure time. */
export function transitionEndingFrame(
  from: EndingFrame | undefined,
  target: EndingFrame,
  secondsSinceSwitch: number,
): EndingFrame {
  if (!from || secondsSinceSwitch >= 1.2) return target;
  const t = ease(secondsSinceSwitch / 1.2);
  if (from.flying && !target.flying) {
    return t < 0.5
      ? { ...from, opacity: from.opacity * (1 - t * 2) }
      : { ...target, opacity: target.opacity * (t * 2 - 1) };
  }
  if (from.opacity === 0) return { ...target, opacity: target.opacity * t };
  return {
    x: mix(from.x, target.x, t),
    y: mix(from.y, target.y, t),
    scale: mix(from.scale, target.scale, t),
    opacity: mix(from.opacity, target.opacity, t),
    flying: from.flying || target.flying,
  };
}
export const transitionEndingValue = (
  from: number | undefined,
  target: number,
  secondsSinceSwitch: number,
) => (from === undefined ? target : mix(from, target, ease(secondsSinceSwitch / 1.2)));
