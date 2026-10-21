import { agentSceneFrame, type AgentPositions, type AgentScene } from "./factory-agent-motion";

export type AgentBeat = "arrive" | "install";
type Story = {
  beat?: (scene: AgentScene, beat: AgentBeat) => void;
  next?: (scene: AgentScene, positions: AgentPositions) => AgentScene | null;
};
/** One shared visible-time clock controls both workers, surfaces, and the next job. */
export function playAgentScene(
  element: SVGSVGElement,
  initialScene: AgentScene,
  paint: (poses: AgentPositions, seconds: number, running: boolean, scene: AgentScene) => void,
  story: Story = {},
) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 760px)");
  let scene = initialScene,
    visible = false,
    stopped = false,
    complete = false;
  let elapsed = 0,
    frame = 0,
    last = 0,
    painted = 0;
  let arrived = false,
    installed = false;
  const install = () => {
    if (!installed) {
      installed = true;
      story.beat?.(scene, "install");
    }
  };
  const tick = (now: number) => {
    frame = 0;
    if (stopped || complete || !visible || document.hidden) return;
    elapsed = Math.min(scene.duration, elapsed + Math.min(now - last, 100) / 1000);
    last = now;
    if (!arrived && elapsed >= scene.arriveAt) {
      arrived = true;
      story.beat?.(scene, "arrive");
    }
    if (elapsed >= scene.installAt) install();
    complete = elapsed >= scene.duration;
    if (now - painted >= 1000 / 24 || complete) {
      paint(agentSceneFrame(scene, elapsed), elapsed, !complete, scene);
      painted = now;
    }
    if (complete) {
      const next = story.next?.(scene, agentSceneFrame(scene, scene.duration));
      if (next) {
        scene = next;
        elapsed = 0;
        arrived = false;
        installed = false;
        complete = false;
      }
    }
    if (!complete) frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (stopped) return;
    if (reduced.matches || mobile.matches) {
      complete = true;
      install();
      paint(agentSceneFrame(scene, scene.duration), scene.duration, false, scene);
      return;
    }
    if (complete || !visible || document.hidden) return;
    last = performance.now();
    painted = last - 1000 / 24;
    frame = requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(element);
  reduced.addEventListener("change", sync);
  mobile.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  return () => {
    stopped = true;
    if (frame) cancelAnimationFrame(frame);
    observer.disconnect();
    reduced.removeEventListener("change", sync);
    mobile.removeEventListener("change", sync);
    document.removeEventListener("visibilitychange", sync);
  };
}
