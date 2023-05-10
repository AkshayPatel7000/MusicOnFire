//import liraries
import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';

//Icons
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';
import {
  usePlaybackState,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  getCurrentTrackList,
  pauseSong,
  playSong,
  stopSong,
} from '../../Services/TrackPlayerService';
import CurrentTrackStores from '../../Utils/mobx/currentTrack';
import {COLORS} from '../../Utils/Constants';

// Octicons.loadFont();
Feather.loadFont();
Ionicons.loadFont();
AntDesign.loadFont();
Entypo.loadFont();

const events = [Event.PlaybackState, Event.PlaybackError];

// create a component
const BottomPlayCard = ({onPress}) => {
  const songLoading = usePlaybackState();
  const currentQueue = CurrentTrackStores?.currentList;
  const currentTrack = CurrentTrackStores?.currentIndex;

  useTrackPlayerEvents(events, event => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.');
    }
    if (event.type === Event.PlaybackState) {
      if (event.state === 'buffering') {
        getCurrentTrackList();
      }
    }
  });

  return (
    <View
      style={{
        height: 80,
        width: '100%',
        backgroundColor: '#2E2E2E',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderWidth: 0.5,
        borderColor: '#FFF',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}>
      <TouchableOpacity
        onPress={() => {
          onPress();
        }}>
        <FastImage
          source={{
            uri: currentQueue[currentTrack]?.artwork,
            priority: 'high',
          }}
          style={{
            height: 60,
            width: 60,
            resizeMode: 'contain',
            borderRadius: 8,
          }}
        />
      </TouchableOpacity>

      <View
        onTouchEnd={() => {
          onPress();
        }}
        style={{width: '50%'}}>
        <Text style={{color: '#FFF'}} numberOfLines={1}>
          {currentQueue[currentTrack]?.title}
        </Text>
        <Text style={{color: '#FFFFFF6a'}} numberOfLines={1}>
          {currentQueue[currentTrack]?.subtitle}
        </Text>
      </View>

      {songLoading === 'paused' ? (
        <AntDesign
          onPress={() => {
            playSong();
          }}
          name="playcircleo"
          size={35}
          color={COLORS.primary}
        />
      ) : (
        <Feather
          onPress={() => {
            pauseSong();
          }}
          name="pause-circle"
          size={37}
          color={COLORS.primary}
        />
      )}
      <Feather
        onPress={() => {
          stopSong();
        }}
        name="x-circle"
        size={37}
        color={COLORS.primary}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default observer(BottomPlayCard);
