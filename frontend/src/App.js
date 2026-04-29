import { useState, useCallback, useRef } from "react";
import "@/App.css";
import GameCanvas from "@/components/GameCanvas";
import MainMenu from "@/components/MainMenu";
import GameHUD from "@/components/GameHUD";
import PauseMenu from "@/components/PauseMenu";
import InventoryPanel from "@/components/InventoryPanel";
import GameOver from "@/components/GameOver";
import VictoryScreen from "@/components/VictoryScreen";

function App() {
  const engineRef = useRef(null);
  const [screen, setScreen] = useState("menu");
  const [gameData, setGameData] = useState({
    health: 100,
    maxHealth: 100,
    mana: 100,
    maxMana: 100,
    score: 0,
    inventory: [],
    equipment: { weapon: null, armor: null, accessory: null },
  });

  const handleStateUpdate = useCallback((state) => {
    setGameData((prev) => ({
      ...prev,
      health: state.health,
      maxHealth: state.maxHealth,
      mana: state.mana,
      maxMana: state.maxMana,
      score: state.score,
      inventory: state.inventory || prev.inventory,
      equipment: state.equipment || prev.equipment,
    }));

    if (state.gameState) {
      setScreen(state.gameState);
    }
  }, []);

  const handleEngineReady = useCallback((engine) => {
    engineRef.current = engine;
  }, []);

  const handleStartGame = useCallback(() => {
    setScreen("playing");
    if (engineRef.current) engineRef.current.startGame();
  }, []);

  const handleResume = useCallback(() => {
    setScreen("playing");
    if (engineRef.current) engineRef.current.resume();
  }, []);

  const handleQuitToMenu = useCallback(() => {
    setScreen("menu");
    if (engineRef.current) engineRef.current.stop();
  }, []);

  const handleRestart = useCallback(() => {
    setScreen("playing");
    if (engineRef.current) engineRef.current.restart();
  }, []);

  const handleEquipItem = useCallback((item) => {
    if (engineRef.current) engineRef.current.equipItem(item);
  }, []);

  const handleUnequipItem = useCallback((slot) => {
    if (engineRef.current) engineRef.current.unequipItem(slot);
  }, []);

  const handleCloseInventory = useCallback(() => {
    setScreen("playing");
    if (engineRef.current) engineRef.current.closeInventory();
  }, []);

  return (
    <div className="App">
      <GameCanvas
        onStateUpdate={handleStateUpdate}
        onEngineReady={handleEngineReady}
      />

      {screen === "menu" && <MainMenu onStartGame={handleStartGame} />}

      {screen === "playing" && (
        <GameHUD
          health={gameData.health}
          maxHealth={gameData.maxHealth}
          mana={gameData.mana}
          maxMana={gameData.maxMana}
          score={gameData.score}
        />
      )}

      {screen === "paused" && (
        <PauseMenu onResume={handleResume} onQuit={handleQuitToMenu} />
      )}

      {screen === "inventory" && (
        <InventoryPanel
          inventory={gameData.inventory}
          equipment={gameData.equipment}
          onEquip={handleEquipItem}
          onUnequip={handleUnequipItem}
          onClose={handleCloseInventory}
        />
      )}

      {screen === "game_over" && (
        <GameOver
          score={gameData.score}
          onRestart={handleRestart}
          onQuit={handleQuitToMenu}
        />
      )}

      {screen === "victory" && (
        <VictoryScreen
          score={gameData.score}
          onRestart={handleRestart}
          onQuit={handleQuitToMenu}
        />
      )}
    </div>
  );
}

export default App;
