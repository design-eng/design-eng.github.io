import * as Tooltip from '@radix-ui/react-tooltip';
import disc from '../../assets/disc.png';
import playIcon from '../../assets/play.png';
import playingMutedIcon from '../../assets/playing-muted.png';
import stopIcon from '../../assets/stop.png';
import stoppedMutedIcon from '../../assets/stopped-muted.png';
import toneArm from '../../assets/arm.png';
import toneRoot from '../../assets/tone-root.png';
import { useLandingStore } from '../../state/useLandingStore';
import vinyl from '../../assets/vinyl.png';
import volumeMuteIcon from '../../assets/stopped-sound-on.png';

type VinylPlayerProps = {
  compact?: boolean;
};

export function VinylPlayer({ compact = false }: VinylPlayerProps) {
  const audioStatus = useLandingStore((state) => state.audioStatus);
  const muted = useLandingStore((state) => state.muted);
  const controller = useLandingStore((state) => state.audioController);

  const isPlaying = audioStatus === 'playing';
  const canControl = controller !== null;
  const muteButtonIcon = muted
    ? isPlaying
      ? playingMutedIcon
      : stoppedMutedIcon
    : volumeMuteIcon;

  return (
    <Tooltip.Provider delayDuration={150}>
      <section
        className={`vinyl-player${compact ? ' vinyl-player--compact' : ''}`}
        aria-label="Audio player"
      >
        <div className="vinyl-player__stage">
          <img className="vinyl-player__base" src={vinyl} alt="" />

          <div
            className={`vinyl-player__disc-wrap${isPlaying ? ' vinyl-player__disc-wrap--spinning' : ''}`}
            aria-hidden="true"
          >
            <img className="vinyl-player__disc" src={disc} alt="" />
          </div>

          <div className="vinyl-player__tonearm-pivot" aria-hidden="true">
            <div
              className={`vinyl-player__tonearm${isPlaying ? ' vinyl-player__tonearm--playing' : ''}`}
            >
              <img className="vinyl-player__tonearm-arm" src={toneArm} alt="" />
            </div>

            <img
              className="vinyl-player__tonearm-root"
              src={toneRoot}
              alt=""
            />
          </div>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                className="vinyl-player__play-button"
                onClick={() =>
                  isPlaying ? controller?.stop() : controller?.play()
                }
                disabled={!canControl}
                aria-label={isPlaying ? 'Stop audio' : 'Play audio'}
              >
                <img src={isPlaying ? stopIcon : playIcon} alt="" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="tooltip-content"
                side="bottom"
                sideOffset={10}
              >
                Play / Stop
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                className={`vinyl-player__mute-button${muted ? ' is-active' : ''}`}
                onClick={() => controller?.setMuted(!muted)}
                disabled={!canControl}
                aria-label={muted ? 'Unmute audio' : 'Mute audio'}
                aria-pressed={muted}
              >
                <img src={muteButtonIcon} alt="" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="tooltip-content"
                side="bottom"
                sideOffset={10}
              >
                {muted ? 'Unmute' : 'Mute'}
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        <p
          className={`vinyl-player__hint${compact ? ' vinyl-player__hint--compact' : ''}`}
        >
          Audio source: <code>src/assets/bird-audio.wav</code>
        </p>
      </section>
    </Tooltip.Provider>
  );
}
