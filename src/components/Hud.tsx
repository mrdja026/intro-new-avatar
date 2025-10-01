import { useSceneStore } from '../store';

export function Hud() {
  const { sceneIndex, sceneNames, nextScene, prevScene } = useSceneStore();

  return (
    <div className="hud">
      <div className="hud__title">Scene: {sceneNames[sceneIndex]}</div>
      <div className="hud__buttons">
        <button type="button" className="hud__button" onClick={prevScene}>
          Prev
        </button>
        <button type="button" className="hud__button" onClick={nextScene}>
          Next
        </button>
      </div>
      <div className="hud__hint">
        <span>
          <code>Space</code> Next
        </span>
        <span>
          <code>Shift + Space</code> Prev
        </span>
      </div>
    </div>
  );
}
