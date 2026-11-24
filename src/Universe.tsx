"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Box,
  Orbit,
  BookOpen,
  ArrowUpRight,
  Compass,
  Layers3,
  RotateCcw,
  Plus,
  Minus,
  Maximize,
  Minimize,
  MousePointer2,
  GitFork,
  Star,
  Code2,
  Grid2X2,
  Search,
  X,
  Building2,
  Globe2,
  UserRound,
  ChevronRight,
  GitBranch,
  Menu,
} from "lucide-react";
import City from "./City";
import { repos, districtCount } from "./data";
type Mode = "home" | "demo" | "docs";
const worlds = [
  {
    title: "Repository City",
    icon: Building2,
    copy: "Explore a skyline shaped by your repositories.",
    status: "Explore city",
    className: "cyan",
  },
  {
    title: "Personal World",
    icon: UserRound,
    copy: "A home for your work, projects, and developer story.",
    status: "Planned · Phase 5",
    className: "purple",
  },
  {
    title: "Global World",
    icon: Globe2,
    copy: "Discover developers and visit their worlds.",
    status: "Planned · Phase 6",
    className: "green",
  },
];
export default function Universe({ mode }: { mode: Mode }) {
  const [selected, select] = useState(0),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [reset, setReset] = useState(0),
    [zoom, setZoom] = useState(0),
    [expanded, expand] = useState(false),
    [query, search] = useState(""),
    [list, showList] = useState(false),
    [menu, showMenu] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const repo = repos.find((r) => r.id === selected);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") {
        expand(false);
        showList(false);
        select(0);
        showMenu(false);
      }
      if (
        mode !== "docs" &&
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();
        showList((v) => !v);
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [mode]);
  const pick = (id: number) => {
    select(id);
    showList(false);
  };
  const nav = (
    <>
      <Link className={mode === "home" ? "active" : ""} href="/">
        Overview
      </Link>
      <Link className={mode === "demo" ? "active" : ""} href="/demo/">
        City explorer
      </Link>
      <Link className={mode === "docs" ? "active" : ""} href="/docs/">
        Documentation
      </Link>
    </>
  );
  return (
    <>
      <header>
        <div className="bar">
          <Link className="brand" href="/">
            <span className="brandmark">
              <Box size={23} />
            </span>
            GitVerse
          </Link>
          <nav>{nav}</nav>
          <Link className="navdemo" href="/demo/">
            <Orbit size={16} />
            Launch demo
          </Link>
          <button
            className="mobile"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            onClick={() => showMenu(!menu)}
          >
            <Menu />
          </button>
        </div>
        {menu && <div className="menu">{nav}</div>}
      </header>
      <main>
        {mode === "docs" ? (
          <article className="docs">
            <div className="eyebrow">
              <BookOpen /> FIELD GUIDE
            </div>
            <h1>Explorer guide</h1>
            <p>
              GitVerse maps repository metadata to a city you can explore from
              any angle.
            </p>
            <h2>Explore the city</h2>
            <p>
              Drag to orbit, pinch or scroll to zoom, and select a building to
              inspect its repository. Use the directory for keyboard navigation.
              Escape closes panels.
            </p>
            <h2>Read the skyline</h2>
            <p>
              Each of the 25 buildings represents a fictional repository.
              Building height reflects stars, footprint reflects size, and
              accent colors distinguish languages.
            </p>
            <h2>Data and privacy</h2>
            <p>
              The demo runs locally with labeled sample data. GitHub
              authentication and synchronization are planned for Phase 3. No
              account or token is required.
            </p>
            <Link className="primary" href="/demo/">
              <Compass />
              Explore demo
            </Link>
          </article>
        ) : (
          <>
            {mode === "home" && (
              <section className="intro">
                <div className="eyebrow">
                  <i /> THE DEVELOPER UNIVERSE
                </div>
                <h1>
                  Your code deserves
                  <br />
                  its own <em>universe.</em>
                </h1>
                <p>
                  Transform your repositories into a living 3D city.
                  <br className="desktop" /> Explore the skyline and discover
                  the stories behind your code.
                </p>
                <div className="ctas">
                  <Link className="primary" href="/demo/">
                    <Compass />
                    Explore demo
                  </Link>
                  <Link className="secondary" href="/docs/">
                    <BookOpen />
                    Read the docs
                  </Link>
                </div>
              </section>
            )}
            <section
              className={
                mode === "demo" ? "sceneSection explore" : "sceneSection"
              }
            >
              <div className="sectionhead">
                <div>
                  <div className="eyebrow muted">
                    <span className="line" /> WORLD EXPLORER
                  </div>
                  <h2>Repository City</h2>
                </div>
                <span className="sample">
                  <i />
                  Demo world
                </span>
              </div>
              <div
                className={"panel " + (expanded ? "expanded" : "")}
                ref={panel}
              >
                <div className="scene">
                  <City
                    selected={selected}
                    onSelect={pick}
                    resetKey={reset}
                    zoomSignal={zoom}
                    onReady={() => setReady(true)}
                    onError={() => setFailed(true)}
                  />
                </div>
                <div className="hud">
                  <span className="cross">⌖</span> ORBIT VIEW
                </div>
                <button
                  className="directory"
                  onClick={() => showList(!list)}
                  aria-expanded={list}
                >
                  <Grid2X2 size={15} />
                  Directory
                </button>
                {!ready && !failed && (
                  <div className="loading" role="status">
                    Generating city…
                  </div>
                )}
                {failed && (
                  <div className="loading">
                    3D rendering unavailable.{" "}
                    <button onClick={() => showList(true)}>
                      Browse repositories
                    </button>
                  </div>
                )}
                <div className="compass" aria-hidden="true">
                  <b>N</b>
                  <Compass size={29} />
                </div>
                <div className="tools">
                  <button
                    aria-label="Zoom in"
                    onClick={() => setZoom((v) => v + 1)}
                  >
                    <Plus />
                  </button>
                  <button
                    aria-label="Zoom out"
                    onClick={() => setZoom((v) => v - 1)}
                  >
                    <Minus />
                  </button>
                  <button
                    aria-label="Reset camera"
                    onClick={() => setReset((v) => v + 1)}
                  >
                    <RotateCcw />
                  </button>
                  <button
                    aria-label={
                      expanded ? "Exit immersive view" : "Immersive view"
                    }
                    onClick={() => expand(!expanded)}
                  >
                    {expanded ? <Minimize /> : <Maximize />}
                  </button>
                </div>
                {list && (
                  <aside className="overlay" aria-label="Repository directory">
                    <div className="overlaytitle">
                      <b>Repository directory</b>
                      <button
                        aria-label="Close directory"
                        onClick={() => showList(false)}
                      >
                        <X />
                      </button>
                    </div>
                    <label className="search">
                      <Search size={16} />
                      <input
                        autoFocus
                        aria-label="Search repositories"
                        placeholder="Find a repository"
                        value={query}
                        onChange={(e) => search(e.target.value)}
                      />
                    </label>
                    <div className="results">
                      {repos
                        .filter((r) =>
                          (r.name + " " + r.language)
                            .toLowerCase()
                            .includes(query.toLowerCase()),
                        )
                        .map((r) => (
                          <button key={r.id} onClick={() => pick(r.id)}>
                            <i style={{ background: r.color }} />
                            {r.name}
                            <ChevronRight size={14} />
                          </button>
                        ))}
                      {!repos.some((r) =>
                        (r.name + " " + r.language)
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                      ) && <p>No matching repositories.</p>}
                    </div>
                  </aside>
                )}
                {repo && !list && (
                  <aside className="overlay inspector" aria-live="polite">
                    <div className="overlaytitle">
                      <small>SAMPLE REPOSITORY</small>
                      <button
                        aria-label="Close inspector"
                        onClick={() => select(0)}
                      >
                        <X />
                      </button>
                    </div>
                    <span className="owner">{repo.owner} /</span>
                    <h3>{repo.name}</h3>
                    <p>{repo.description}</p>
                    <div className="tags">
                      <span style={{ color: repo.color }}>{repo.language}</span>
                      <span>Public</span>
                    </div>
                    <div className="stats">
                      <span>
                        <Star />
                        {repo.stars}
                      </span>
                      <span>
                        <GitFork />
                        {repo.forks}
                      </span>
                      <span>
                        <GitBranch />
                        {repo.branch}
                      </span>
                    </div>
                    <small>
                      {repo.district} district · {repo.license} license ·{" "}
                      {repo.issues} open issues
                    </small>
                  </aside>
                )}
              </div>
              <div className="scenebar">
                <div>
                  <Building2 />
                  {repos.length} repositories<span> / </span>
                  <Layers3 />
                  {districtCount} districts
                </div>
                <div className="hint">
                  <MousePointer2 />
                  Drag to orbit · Scroll to zoom
                </div>
              </div>
            </section>
            {mode === "home" && (
              <section className="worlds">
                <div className="eyebrow muted">
                  <span className="line" /> THE UNIVERSE
                </div>
                <h2>Three connected worlds</h2>
                <div className="cards">
                  {worlds.map((w) => (
                    <article key={w.title} className={w.className}>
                      <w.icon />
                      <h3>{w.title}</h3>
                      <p>{w.copy}</p>
                      {w.title === "Repository City" ? (
                        <Link href="/demo/">
                          {w.status}
                          <ArrowUpRight size={15} />
                        </Link>
                      ) : (
                        <small>{w.status}</small>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <footer>
        <span>
          <Box size={16} /> GitVerse
        </span>
        <span>
          <Code2 size={15} /> Open-source developer universe
        </span>
      </footer>
    </>
  );
}
