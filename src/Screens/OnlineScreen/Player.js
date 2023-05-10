import Slider from '@react-native-community/slider';
import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TrackPlayer, {
  RepeatMode,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {nextSong, pauseSong, playSong} from '../../Services/TrackPlayerService';
import {COLORS} from '../../Utils/Constants';
import CurrentTrackStores from '../../Utils/mobx/currentTrack';

Feather.loadFont();
Ionicons.loadFont();
AntDesign.loadFont();
Entypo.loadFont();

const Dev_Height = Dimensions.get('window').height;
const Dev_Width = Dimensions.get('window').width;

const Player = ({onClose}) => {
  const {currentList, currentIndex} = CurrentTrackStores;
  const songLoading = usePlaybackState();
  const [repeatModeData, setRepeatModeData] = useState(RepeatMode.Off);
  const {buffered, duration, position} = useProgress();

  useEffect(() => {
    const getRMode = async () => {
      const d = await TrackPlayer.getRepeatMode();
      setRepeatModeData(d);
    };
    getRMode();
  }, []);

  return (
    <SafeAreaView style={styles.contanier}>
      <View style={styles.mainbar}>
        <AntDesign
          onPress={() => onClose()}
          name="left"
          size={24}
          style={{marginLeft: '5%'}}
        />
        <Text style={styles.now_playing_text}> Now Playing </Text>
        <Entypo
          name="dots-three-horizontal"
          size={24}
          style={{marginLeft: '20%'}}
        />
      </View>

      <View style={styles.music_logo_view}>
        <Image
          source={{uri: currentList[currentIndex]?.image}}
          style={styles.image_view}
        />
      </View>

      <View style={styles.name_of_song_View}>
        <Text style={styles.name_of_song_Text1} numberOfLines={1}>
          {currentList[currentIndex]?.title}
        </Text>
        <Text style={styles.name_of_song_Text2}>
          {currentList[currentIndex]?.subtitle}
        </Text>
      </View>

      <View style={styles.slider_view}>
        <Text style={styles.slider_time_start}>
        {`${Math.floor(position / 60)}.${Math.floor(position % 60)}`}
          {/* {(position / 60).toFixed(2)} */}
        </Text>
        <Slider
          style={styles.slider_style}
          minimumValue={0}
          maximumValue={duration}
          minimumTrackTintColor={COLORS.primary}
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor={COLORS.primary}
          value={position}
          onValueChange={val => {
            TrackPlayer.seekTo(val);
          }}
        />
        <Text style={styles.slider_time_end}>{`${Math.floor(duration / 60)}.${Math.floor(duration % 60)}`}</Text>
      </View>

      <View style={styles.functions_view}>
        <Entypo name="shuffle" size={24} color={COLORS.bg} />
        <AntDesign
          name="stepbackward"
          size={24}
          color={COLORS.primary}
          onPress={() => TrackPlayer.skipToPrevious()}
        />
        {songLoading === 'playing' ? (
          <AntDesign
            name="pausecircleo"
            size={30}
            color={COLORS.primary}
            onPress={() => TrackPlayer.pause()}
          />
        ) : (
          <AntDesign
            name="playcircleo"
            size={30}
            color={COLORS.primary}
            onPress={() => TrackPlayer.play()}
          />
        )}
        <AntDesign
          name="stepforward"
          size={24}
          color={COLORS.primary}
          onPress={() => {
            nextSong();
          }}
        />
        <Feather
          name="repeat"
          size={20}
          color={repeatModeData === 0 ? COLORS.subtitle : COLORS.primary}
          onPress={() => {
            if (repeatModeData === 0) {
              setRepeatModeData(RepeatMode.Track);
              TrackPlayer.setRepeatMode(RepeatMode.Track);
            } else {
              setRepeatModeData(RepeatMode.Off);
              TrackPlayer.setRepeatMode(RepeatMode.Off);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default observer(Player);

const styles = StyleSheet.create({
  contanier: {
    height: Dev_Height,
    width: Dev_Width,
    backgroundColor: COLORS.bg,
  },
  mainbar: {
    height: '10%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  now_playing_text: {
    fontSize: 19,
    marginLeft: '24%',
  },
  music_logo_view: {
    height: '30%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image_view: {
    height: '100%',
    width: '70%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  name_of_song_View: {
    height: '15%',
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name_of_song_Text1: {
    fontSize: 19,
    fontWeight: '500',
    textAlign: 'center',
  },
  name_of_song_Text2: {
    color: '#808080',
    marginTop: '4%',
    textAlign: 'center',
  },
  slider_view: {
    height: '10%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  slider_style: {
    height: '70%',
    width: '60%',
  },
  slider_time_start: {
    fontSize: 15,
    // marginLeft: '6%',
    color: '#808080',
  },
  slider_time_end: {
    fontSize: 15,
    // marginRight: '6%',
    color: '#808080',
  },
  functions_view: {
    flexDirection: 'row',
    height: '10%',
    width: '80%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
  },
  recently_played_view: {
    height: '25%',
    width: '100%',
  },
  recently_played_text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#808080',
    marginLeft: '5%',
    marginTop: '6%',
  },
  recently_played_list: {
    backgroundColor: '#FFE3E3',
    height: '50%',
    width: '90%',
    borderRadius: 10,
    marginLeft: '5%',
    marginTop: '5%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  recently_played_image: {
    height: '80%',
    width: '20%',
    borderRadius: 10,
  },
  recently_played_list_text: {
    height: '100%',
    width: '60%',
    justifyContent: 'center',
  },
  recently_played_list_text1: {
    fontSize: 15,
    marginLeft: '8%',
  },
  recently_played_list_text2: {
    fontSize: 16,
    color: '#808080',
    marginLeft: '8%',
  },
});
