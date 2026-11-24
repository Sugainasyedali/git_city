import { useEffect, useRef, useState } from "react";
import {
  CarFront,
  RotateCcw,
  Lightbulb,
  Camera,
  Map as MapIcon,
} from "lucide-react";
import { keys, plots, spawn } from "./driving";
import { repos } from "./data";
import type { Telemetry, View } from "./Vehicle";

export function useDriving(blocked: boolean, pick: (id: number) => void) {
  const [active, activate] = useState(false),
    [view, setView] = useState<View>("Chase"),
    [lights, setLights] = useState(true),
    [low, setLow] = useState(false),
    [map, setMap] = useState(false),
    [pause, setPause] = useState(false),
    [destination, send] = useState({ id: 0, seq: 0 });
  const [data, report] = useState<Telemetry>({ ...spawn(), nearby: 0 });
  const input = useRef(new Set<string>());
  const paused = blocked || pause || map;
  const move = (id: number) => {
    input.current.clear();
    send((prev) => ({ id, seq: prev.seq + 1 }));
    setMap(false);
    setPause(false);
    activate(true);
    pick(0);
  };
  const toggle = () => {
    input.current.clear();
    activate(!active);
    setPause(false);
    setMap(false);
    pick(0);
  };
  const state = useRef({ active, blocked, paused, data, pick, map, move });
  useEffect(() => {
    state.current = { active, blocked, paused, data, pick, map, move };
  });
  useEffect(() => {
    const pressed = input.current;
    const clear = () => pressed.clear();
    const down = (e: KeyboardEvent) => {
      const v = state.current;
      if (
        !v.active ||
        v.blocked ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        (e.target instanceof HTMLElement &&
          e.target.closest("input,textarea,select,[contenteditable=true]"))
      )
        return;
      if (e.code === "Space" && e.target instanceof HTMLButtonElement) return;
      if ((keys as readonly string[]).includes(e.code)) {
        e.preventDefault();
        if (!v.paused) pressed.add(e.code);
        return;
      }
      if (e.repeat) return;
      switch (e.code) {
        case "Escape":
          if (v.map) setMap(false);
          else setPause((p) => !p);
          break;
        case "KeyM":
          setMap((m) => !m);
          break;
        default:
          if (v.paused) return;
          if (e.code === "KeyE" && v.data.nearby) v.pick(v.data.nearby);
          if (e.code === "KeyF") setLights((l) => !l);
          if (e.code === "KeyC")
            setView((c) => (c === "Chase" ? "Overhead" : "Chase"));
          if (e.code === "KeyR") v.move(0);
      }
    };
    const up = (e: KeyboardEvent) => pressed.delete(e.code);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
      clear();
    };
  }, []);
  useEffect(() => {
    input.current.clear();
  }, [paused, active]);
  return {
    active,
    view,
    lights,
    low,
    map,
    pause,
    paused,
    destination,
    data,
    input,
    report,
    move,
    toggle,
    setLow,
    setLights,
    setView,
    setMap,
    setPause,
    pick,
  };
}
export type Drive = ReturnType<typeof useDriving>;
export function DriveControls({ d, blocked }: { d: Drive; blocked: boolean }) {
  const r = repos.find((r) => r.id === d.data.nearby);
  return (
    <>
      <div className="drivebar">
        <button
          onClick={(e) => {
            d.toggle();
            e.currentTarget.blur();
          }}
        >
          <CarFront size={16} />
          {d.active ? "Exit vehicle" : "Drive city"}
        </button>
        <label>
          Graphics{" "}
          <select
            aria-label="Graphics quality"
            value={d.low ? "low" : "high"}
            onChange={(e) => d.setLow(e.target.value === "low")}
          >
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </label>
        {d.active && (
          <>
            <button
              aria-label="Change driving camera"
              onClick={() =>
                d.setView(d.view === "Chase" ? "Overhead" : "Chase")
              }
            >
              <Camera size={15} />
              {d.view}
            </button>
            <button
              aria-label="Headlights"
              aria-pressed={d.lights}
              onClick={() => d.setLights(!d.lights)}
            >
              <Lightbulb size={15} />
            </button>
            <button aria-label="Reset vehicle" onClick={() => d.move(0)}>
              <RotateCcw size={15} />
            </button>
          </>
        )}
      </div>
      {d.active && !blocked && (
        <div className="driveHUD">
          <div className="instruments">
            <button
              aria-label="Toggle city map"
              aria-expanded={d.map}
              onClick={() => d.setMap(!d.map)}
            >
              <MapIcon size={14} />
              Map
            </button>
            <svg
              className="minimap"
              viewBox="-27 -27 54 54"
              role="img"
              aria-label="Live vehicle minimap"
            >
              {plots.map((p) => (
                <rect
                  key={p.id}
                  x={p.x - 3.9}
                  y={p.z - 3.9}
                  width="7.8"
                  height="7.8"
                  rx=".4"
                  fill={p.id === r?.id ? "#689ead" : "#384759"}
                />
              ))}
              <path
                d="M0 -2.4 L1.8 1.8 L0 1 L-1.8 1.8Z"
                fill="#5efcde"
                transform={`translate(${d.data.x} ${d.data.z}) rotate(${(-d.data.heading * 180) / Math.PI})`}
              />
            </svg>
            <strong>{Math.round(Math.abs(d.data.speed) * 3.6)} km/h</strong>
            <small>
              {d.data.speed < -0.02 ? "R" : "D"} ·{" "}
              {
                ["N", "W", "S", "E"][
                  ((Math.round(d.data.heading / (Math.PI / 2)) % 4) + 4) % 4
                ]
              }
            </small>
          </div>
          <div className="driveactions">
            {r && (
              <button onClick={() => d.pick(r.id)}>Inspect {r.name} · E</button>
            )}
            <div className="pedals">
              {[
                ["KeyA", "Left"],
                ["KeyD", "Right"],
                ["KeyS", "Brake / reverse"],
                ["KeyW", "Accelerate"],
              ].map(([code, label]) => (
                <button
                  key={code}
                  aria-label={label}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.currentTarget.setPointerCapture(e.pointerId);
                    if (!d.paused) d.input.current.add(code);
                  }}
                  onLostPointerCapture={() => d.input.current.delete(code)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {d.map && (
            <div className="driveDialog">
              <b>Teleport to a repository</b>
              <div className="mapgrid">
                {[...plots]
                  .sort((a, b) => a.z - b.z || a.x - b.x)
                  .map((p) => (
                    <button
                      key={p.id}
                      title={repos.find((r) => r.id === p.id)?.name}
                      onClick={() => d.move(p.id)}
                    >
                      {repos.find((r) => r.id === p.id)?.name}
                    </button>
                  ))}
              </div>
              <button onClick={() => d.setMap(false)}>Close map</button>
            </div>
          )}
          {d.pause && !d.map && (
            <div className="driveDialog">
              <button onClick={() => d.setPause(false)}>Resume driving</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
