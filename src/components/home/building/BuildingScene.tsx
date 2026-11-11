"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { ActiveLayer } from "./geometry";

/**
 * Mounts the 3D building into a div. three.js is loaded only here, on demand,
 * so the rest of the page does not pay for it. If WebGL is unavailable it does
 * nothing, and the static poster underneath stays visible.
 */
export function BuildingScene({
  active,
  onReady,
  progress,
  className,
}: {
  active: ActiveLayer;
  onReady: () => void;
  /** Scroll progress of the pinned hero, 0 to 1 */
  progress?: RefObject<number>;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const activeRef = useRef<ActiveLayer>(active);
  const readyRef = useRef(onReady);
  const progressRef = useRef(progress);

  useEffect(() => {
    activeRef.current = active;
    readyRef.current = onReady;
    progressRef.current = progress;
  });

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let dispose = () => {};
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!gl) return;
    (async () => {
      const [THREE, { createBuildingScene }] = await Promise.all([import("three"), import("./createBuildingScene")]);
      if (disposed) return;
      dispose = createBuildingScene(
        THREE,
        el,
        () => activeRef.current,
        () => readyRef.current(),
        () => progressRef.current?.current ?? 0,
      );
    })();
    return () => {
      disposed = true;
      dispose();
    };
  }, []);

  return <div ref={host} className={className} aria-hidden="true" />;
}
