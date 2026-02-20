import { useEffect, useState } from "react";
import "./App.css";
import HomeScreen from "./components/HomeScreen.jsx";
import SettingsScreen from "./components/SettingsScreen.jsx";
import RouletteScreen from "./components/RouletteScreen.jsx";

function App() {
	const [screen, setScreen] = useState("home"); // home | settings | roulette
	const [mode, setMode] = useState("classic"); // classic | team | pairs

	useEffect(() => {
		const saved = localStorage.getItem("tr.mode");
		if (saved) setMode(saved);
	}, []);

	const goHome = () => setScreen("home");
	const goSettings = () => setScreen("settings");
	const startRoulette = () => {
		console.log("Starting roulette with mode:", mode);
		setScreen("roulette");
	};

	return (
		<div className="app-root">
			{screen === "home" && (
				<HomeScreen onStart={startRoulette} onSettings={goSettings} />
			)}

			{screen === "settings" && (
				<SettingsScreen
					mode={mode}
					onChangeMode={(m) => {
						setMode(m);
						localStorage.setItem("tr.mode", m);
					}}
					onBack={goHome}
				/>
			)}

			{screen === "roulette" && <RouletteScreen mode={mode} onBack={goHome} />}
		</div>
	);
}

export default App;
