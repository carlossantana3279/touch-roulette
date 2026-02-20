import { useEffect, useMemo, useRef, useState } from "react";

function usePointerTracker() {
	const [pointers, setPointers] = useState([]); // {id, x, y}
	const containerRef = useRef(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const onDown = (e) => {
			el.setPointerCapture?.(e.pointerId);
			setPointers((prev) => {
				const rect = el.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				const exists = prev.some((p) => p.id === e.pointerId);
				const next = exists
					? prev.map((p) =>
							p.id === e.pointerId ? { id: e.pointerId, x, y } : p,
					  )
					: [...prev, { id: e.pointerId, x, y }];
				return next;
			});
		};
		const onMove = (e) => {
			setPointers((prev) => {
				const rect = el.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				return prev.map((p) =>
					p.id === e.pointerId ? { id: e.pointerId, x, y } : p,
				);
			});
		};
		const onUp = (e) => {
			setPointers((prev) => prev.filter((p) => p.id !== e.pointerId));
		};

		el.addEventListener("pointerdown", onDown);
		el.addEventListener("pointermove", onMove);
		el.addEventListener("pointerup", onUp);
		el.addEventListener("pointercancel", onUp);
		el.addEventListener("pointerleave", onUp);

		return () => {
			el.removeEventListener("pointerdown", onDown);
			el.removeEventListener("pointermove", onMove);
			el.removeEventListener("pointerup", onUp);
			el.removeEventListener("pointercancel", onUp);
			el.removeEventListener("pointerleave", onUp);
		};
	}, []);

	return { containerRef, pointers };
}

function vibrate() {
	try {
		if (navigator?.vibrate) {
			navigator.vibrate([30, 60, 30]);
			return;
		}
	} catch {}
}

function shuffle(arr) {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export default function RouletteScreen({ mode, onBack }) {
	const { containerRef, pointers } = usePointerTracker();
	const [phase, setPhase] = useState("collect"); // collect | spinning | result
	const [highlightIndex, setHighlightIndex] = useState(-1);
	const [result, setResult] = useState(null); // depends on mode
	const [startCount, setStartCount] = useState(0);

	const canStart = useMemo(() => {
		if (pointers.length < 1) return false;
		if (mode === "team" || mode === "pairs")
			return pointers.length % 2 === 0 && pointers.length > 1;
		return true;
	}, [pointers.length, mode]);

	useEffect(() => {
		setPhase("collect");
		setResult(null);
		setHighlightIndex(-1);
	}, [mode]);

	const startSpin = () => {
		if (!canStart) return;
		setStartCount((c) => c + 1);
		setPhase("spinning");
		const total = pointers.length;
		let idx = 0;
		let interval = 80; // ms
		const duration = 1800 + Math.random() * 1500; // 1.8s to 3.3s
		const start = performance.now();

		const tick = () => {
			const elapsed = performance.now() - start;
			idx = (idx + 1) % total;
			setHighlightIndex(idx);
			if (elapsed < duration) {
				// slow down towards the end
				interval = Math.min(180, 80 + Math.floor((elapsed / duration) * 120));
				spinTimer = setTimeout(tick, interval);
			} else {
				// finalize selection
				const selectedIndex = Math.floor(Math.random() * total);
				setHighlightIndex(selectedIndex);
				finalize(selectedIndex);
			}
		};
		let spinTimer = setTimeout(tick, interval);
	};

	const finalize = (selectedIndex) => {
		// Disable for now
		// vibrate();
		setPhase("finalizing");
		console.log("Selected index:", selectedIndex, "for mode:", mode);

		if (mode === "classic") {
			setResult({ type: "person", index: selectedIndex });
		} else if (mode === "team") {
			// assign teams and pick winning team
			const ids = pointers.map((p, i) => i);
			const shuffled = shuffle(ids);
			const mid = Math.floor(shuffled.length / 2);
			const blue = new Set(shuffled.slice(0, mid));
			const red = new Set(shuffled.slice(mid));
			const winning = Math.random() < 0.5 ? "blue" : "red";
			setResult({ type: "teams", blue, red, winning });
		} else if (mode === "pairs") {
			const ids = pointers.map((p, i) => i);
			const shuffled = shuffle(ids);
			const pairs = [];
			for (let i = 0; i < shuffled.length; i += 2) {
				pairs.push([shuffled[i], shuffled[i + 1]]);
			}
			setResult({ type: "pairs", pairs });
		}
		setPhase("result");
	};

	return (
		<div className="screen">
			<div className="topbar">
				<button className="back-button" onClick={onBack}>
					← Home
				</button>
				<h2>
					Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
					{/* for testing */} phase: {phase}
				</h2>
			</div>
			{phase === "result" && result && (
				<div className="result">
					{result.type === "person" && (
						<div className="callout">Selected: Person #{result.index + 1}</div>
					)}
					{result.type === "teams" && (
						<div className="callout">
							Team Split: <span className="blue">Blue</span> vs{" "}
							<span className="red">Red</span> — Winner:{" "}
							<strong className={result.winning}>
								{result.winning.toUpperCase()}
							</strong>
						</div>
					)}
					{result.type === "pairs" && (
						<div className="callout">Paired everyone — see colored links</div>
					)}
				</div>
			)}
			<div className="arena" ref={containerRef}>
				<div className="instructions">
					{phase === "collect" && (
						<>
							<div>Place all fingers on the screen.</div>
							<div className="muted">
								Use multiple fingers from different people.
							</div>
						</>
					)}
					{phase !== "collect" && (
						<div className="muted">Don't move fingers during spin.</div>
					)}

					<div>canStart: {canStart ? "Yes" : "No"}</div>
					<div>pointers: {pointers.length}</div>
					<div>startCount: {startCount}</div>
				</div>

				{pointers.map((p, i) => (
					<div
						key={p.id}
						className={
							"finger" +
							(result?.type === "teams"
								? result.blue.has(i)
									? " blue"
									: result.red.has(i)
									? " red"
									: ""
								: result?.type === "pairs"
								? " pair"
								: "")
						}
						style={{ transform: `translate(${p.x - 28}px, ${p.y - 28}px)` }}
					>
						<div className={"dot" + (i === highlightIndex ? " selected" : "")}>
							<div className="dot__text">{i + 1}</div>
						</div>
					</div>
				))}

				{result?.type === "pairs" && (
					<PairsOverlay pairs={result.pairs} pointers={pointers} />
				)}
			</div>

			<div className="controls">
				<button
					className="big-button"
					disabled={!canStart || phase !== "collect"}
					onPointerDown={startSpin}
				>
					Start Roulette
				</button>
				<button
					className="big-button"
					onClick={() => {
						setPhase("collect");
						setResult(null);
						setHighlightIndex(-1);
					}}
				>
					Reset
				</button>
			</div>
		</div>
	);
}

function PairsOverlay({ pairs, pointers }) {
	// Render lines connecting paired dots
	return (
		<svg
			className="pairs-overlay"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
		>
			{pairs.map((pair, idx) => {
				const [a, b] = pair;
				const pa = pointers[a];
				const pb = pointers[b];
				if (!pa || !pb) return null;
				return (
					<line
						key={idx}
						x1={pa.x / 1}
						y1={pa.y / 1}
						x2={pb.x / 1}
						y2={pb.y / 1}
						className="pair-line"
					/>
				);
			})}
		</svg>
	);
}
