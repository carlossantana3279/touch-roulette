const modes = [
	{ id: "classic", label: "Classic", description: "Select one person" },
	{
		id: "team",
		label: "Team",
		description: "Split into two teams (even required)",
	},
	{ id: "pairs", label: "Pairs", description: "Pair everyone (even required)" },
];

export default function SettingsScreen({ mode, onChangeMode, onBack }) {
	return (
		<div className="screen">
			<div className="topbar">
				<button className="back-button" onClick={onBack}>
					← Home
				</button>
				<h2>Settings</h2>
			</div>

			<div className="settings">
				<h3>Roulette Mode</h3>
				<div className="mode-list">
					{modes.map((m) => (
						<label
							key={m.id}
							className={`mode-item ${mode === m.id ? "selected" : ""}`}
						>
							<input
								type="radio"
								name="mode"
								value={m.id}
								checked={mode === m.id}
								onChange={() => onChangeMode(m.id)}
							/>
							<div className="mode-content">
								<div className="mode-title">{m.label}</div>
								<div className="mode-desc">{m.description}</div>
							</div>
						</label>
					))}
				</div>

				<div className="hint">
					Tip: For Team and Pairs, you need an even number of fingers.
				</div>

				<div className="support">
					<a
						href="https://buymeacoffee.com/carlossantana"
						target="_blank"
						rel="noopener noreferrer"
						className="support-link"
					>
						Buy me a coffee ☕
					</a>
				</div>
			</div>
		</div>
	);
}
