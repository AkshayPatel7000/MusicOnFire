import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
} from 'react-native-track-player';
import Octicons from 'react-native-vector-icons/Octicons';
import CurrentTrackStores from '../Utils/mobx/currentTrack';

Octicons.loadFont();

export const PlaybackService = async () => {
  try {
    TrackPlayer.setupPlayer({
      backBuffer: 10,
      autoUpdateMetadata: true,
    }).then(() => {
      TrackPlayer.updateOptions({
        alwaysPauseOnInterruption: true,
        color: 0x57b2ab,
        progressUpdateEventInterval: 100,
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
      });
      TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

      TrackPlayer.addEventListener(Event.RemotePause, () =>
        TrackPlayer.pause(),
      );

      TrackPlayer.addEventListener(Event.RemoteNext, () =>
        TrackPlayer.skipToNext(),
      );

      TrackPlayer.addEventListener(Event.RemotePrevious, () =>
        TrackPlayer.skipToPrevious(),
      );

      TrackPlayer.addEventListener(Event.RemoteDuck, async event => {
        if (event.paused === true || event.permanent === true) {
          TrackPlayer.pause();
        } else if (!event.paused === true && !event.permanent === true) {
          TrackPlayer.play();
        }
      });

      TrackPlayer.addEventListener(Event.PlaybackTrackChanged, event => {
        getCurrentTrackList();
      });

      TrackPlayer.addEventListener(Event.PlaybackState, async event => {
        console.log('Player state event --> ', JSON.stringify(event));
      });
    });
  } catch (e) {
    console.log('Error on Player Service --> ', e);
  }
};

export const initPlayer = async () => {
  try {
    TrackPlayer.setupPlayer({
      backBuffer: 10,
      autoUpdateMetadata: true,
    }).then(() => {
      TrackPlayer.updateOptions({
        alwaysPauseOnInterruption: true,
        color: 0x57b2ab,
        progressUpdateEventInterval: 100,
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
      });
    });
  } catch (e) {}
};

export const playSong = async () => {
  try {
    await TrackPlayer.play();
  } catch (e) {}
};

export const pauseSong = async () => {
  try {
    await TrackPlayer.pause();
  } catch (e) {}
};

export const nextSong = async () => {
  try {
    CurrentTrackStores.updateOnNext();
    await TrackPlayer.skipToNext();
    TrackPlayer.play();
  } catch (e) {}
};

export const stopSong = async () => {
  try {
    await TrackPlayer.reset();
  } catch (e) {}
};

export const getCurrentTrackList = async () => {
  try {
    const queue = await TrackPlayer.getQueue();
    const track = await TrackPlayer.getCurrentTrack();
    CurrentTrackStores.updateList(queue);
    CurrentTrackStores.updateIndex(track);
    // console.log('Get Track List ---> ',JSON.stringify(queue));
  } catch (e) {
    console.log('Error on getting Track list --> ', e.message);
  }
};
