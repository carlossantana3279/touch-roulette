export default function HomeScreen({ onStart, onSettings }) {
	return (
		<div className="screen screen-center">
			<h1 className="title">Touch Roulette</h1>
			<p className="subtitle">Place fingers and let chance decide</p>
			<div className="home-actions">
				<button
					className="big-button primary"
					type="button"
					onClick={() => {
						console.log("Start button clicked");
						onStart();
					}}
					// onPointerDown={(e) => {
					// 	// Trigger immediately for touch/pen; let mouse use click
					// 	if (e.pointerType !== "mouse") {
					// 		console.log("On Pointer Down (touch/pen)");
					// 		e.preventDefault();
					// 		onStart();
					// 	}
					// }}
					// onTouchStart={(e) => {
					// 	console.log("On Touch Start");
					// 	e.preventDefault();
					// 	onStart();
					// }}
				>
					Start
				</button>

				<button
					className="big-button"
					type="button"
					onClick={() => {
						console.log("Settings button clicked");
						onSettings();
					}}
					// onPointerDown={(e) => {
					// 	if (e.pointerType !== "mouse") {
					// 		console.log("Settings On Pointer Down (touch/pen)");
					// 		e.preventDefault();
					// 		onSettings();
					// 	}
					// }}
					// onTouchStart={(e) => {
					// 	console.log("Settings On Touch Start");
					// 	e.preventDefault();
					// 	onSettings();
					// }}
				>
					Settings
				</button>
			</div>
		</div>
	);
}
