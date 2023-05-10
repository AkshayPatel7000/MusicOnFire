import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {observer} from 'mobx-react';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';
import Octicons from 'react-native-vector-icons/Octicons';
import {
  getSongsDetail,
  getSongsOfAlbum,
  getSongsOfPlaylist,
  getSongUrl,
  getStationData,
} from '../../Services';
import {
  getCurrentTrackList,
  initPlayer,
} from '../../Services/TrackPlayerService';
import loaderJson from '../../Utils/assets/SongLoader.json';
import {COLORS, HeaderHeight} from '../../Utils/Constants';
import CurrentTrackStores from '../../Utils/mobx/currentTrack';
import Player from './Player';
//Icons
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomPlayerCard from '../../Components/bottomPlayerCard';
import {Modalize} from 'react-native-modalize';

Octicons.loadFont();
Feather.loadFont();
Ionicons.loadFont();
AntDesign.loadFont();
Entypo.loadFont();

const SongListScreen = props => {
  const {backImage, title, id, type, station_type, typeId} = props.route.params;
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const modalScroll = useRef(new Animated.Value(0)).current;
  const [loader, setLoader] = useState(false);
  const modalizeRef = useRef();
  const [SongList, setSongList] = useState();
  const currentQueue = CurrentTrackStores.currentList;
  const currentTrack = CurrentTrackStores.currentIndex;
  const songLoading = usePlaybackState();

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HeaderHeight.HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HeaderHeight.HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [
      0,
      HeaderHeight.HEADER_SCROLL_DISTANCE / 2,
      HeaderHeight.HEADER_SCROLL_DISTANCE,
    ],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HeaderHeight.HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [
      0,
      HeaderHeight.HEADER_SCROLL_DISTANCE / 2,
      HeaderHeight.HEADER_SCROLL_DISTANCE,
    ],
    outputRange: [1, 1, 0.7],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [
      0,
      HeaderHeight.HEADER_SCROLL_DISTANCE / 2,
      HeaderHeight.HEADER_SCROLL_DISTANCE,
    ],
    outputRange: [0, 0, -9],
    extrapolate: 'clamp',
  });

  const RenderSongCard = ({songDetail, index}) => {
    let title = songDetail?.title?.replace(/&amp;/g, '&');
    let playingId = currentQueue ? currentQueue[currentTrack]?.id : '';
    let songlistId = SongList[currentTrack]?.id || '';

    return (
      <TouchableOpacity
        style={[styles.songCardStyle, styles.shadowStyle]}
        onPress={() => {
          if (playingId === songDetail?.id && songLoading === 'playing') {
            TrackPlayer.pause();
          } else if (
            playingId === songlistId &&
            playingId === songDetail?.id &&
            songLoading === 'paused'
          ) {
            TrackPlayer.play();
          } else if (playingId === songlistId && songLoading !== 'idle') {
            TrackPlayer.skip(index);
            TrackPlayer.play();
          } else {
            addSong({index: index});
          }
          // getCurrentTrackList();
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <FastImage
            source={{
              uri: songDetail?.image,
              priority: 'high',
            }}
            style={{
              height: 50,
              width: 50,
              resizeMode: 'contain',
              borderRadius: 8,
            }}
          />
          <View style={{width: '70%'}}>
            <Text
              numberOfLines={1}
              style={{color: COLORS.title, fontSize: 18, fontWeight: '600'}}>
              {title?.replace(/&quot;/g, '"')}
            </Text>
            <Text numberOfLines={1} style={{color: COLORS.subtitle}}>
              {songDetail?.subtitle}
            </Text>
          </View>
          {playingId === songDetail?.id ? (
            songLoading !== 'paused' &&
            songLoading !== 'idle' &&
            songLoading !== 'stopped' ? (
              songLoading === 'playing' ? (
                <Feather name="pause-circle" size={26} color={COLORS.primary} />
              ) : (
                <LottieView
                  source={loaderJson}
                  autoPlay={true}
                  resizeMode="cover"
                  style={{height: 26, width: 26}}
                />
              )
            ) : (
              <Octicons name="play" size={26} color={COLORS.primary} />
            )
          ) : (
            <Octicons name="play" size={26} color={COLORS.primary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getURl = async res => {
    try {
      let resp = [...res];
      await Promise.all(
        res?.map(async (singleSong, index) => {
          const resUrl = await getSongUrl({id: singleSong?.id});
          resp[index] = {
            ...resp[index],
            url: resUrl?.url,
            type: 'smoothstreaming',
            pitchAlgorithm: 'Music',
            artwork: resp[index]?.image,
            artist: resp[index]?.subtitle,
            title: resp[index]?.title
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"'),
            duration: Number(resp[index]?.more_info?.duration),
          };
        }),
      );
      setLoader(false);
      return Promise.resolve(resp);
    } catch (e) {
      console.log('Error on get url --> ', e);
      throw new Error(e);
    }
  };

  const getStationURl = async res => {
    try {
      let resp = [...res];
      await Promise.all(
        res?.map(async (singleSong, index) => {
          const resUrl = await getSongUrl({id: singleSong?.id});
          resp[index] = {
            ...resp[index],
            url: resUrl?.url,
            type: 'smoothstreaming',
            pitchAlgorithm: 'Music',
            artwork: resp[index]?.image,
            artist: resp[index]?.subtitle,
            title: resp[index]?.title
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"'),
            duration: Number(resp[index]?.more_info?.duration),
          };
        }),
      );
      setLoader(false);
      return Promise.resolve(resp);
    } catch (e) {
      console.log('Error on get url --> ', e);
      throw new Error(e);
    }
  };

  const getSongList = async () => {
    try {
      if (type === 'playlist') {
        console.log('Playlist Id -->  ', typeId);
        const res = await getSongsOfPlaylist({id: typeId, type: type});
        // console.log("Playlist response -->  ", JSON.stringify(res))
        let resp = res?.list;
        res?.list?.map(async (singleSong, index) => {
          resp[index] = {
            ...resp[index],
            url: singleSong?.songUrl,
            type: 'smoothstreaming',
            pitchAlgorithm: 'Music',
            artwork: resp[index]?.image,
            artist: resp[index]?.subtitle,
            title: resp[index]?.title
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"'),
            duration: Number(resp[index]?.more_info?.duration),
          };
        });
        setSongList(resp);
        setLoader(false);
      } else if (type === 'album') {
        const res = await getSongsOfAlbum({id: typeId, type: type});
        let resp = res?.list;
        res?.list?.map(async (singleSong, index) => {
          resp[index] = {
            ...resp[index],
            url: singleSong?.songUrl,
            type: 'smoothstreaming',
            pitchAlgorithm: 'Music',
            artwork: resp[index]?.image,
            artist: resp[index]?.subtitle,
            title: resp[index]?.title
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"'),
            duration: Number(resp[index]?.more_info?.duration),
          };
        });
        setSongList(resp);
        setLoader(false);
      } else if (type === 'radio_station') {
        const res = await getStationData({name: title, type: station_type});
        const resp = await getStationURl(res);
        setSongList(resp);
      } else {
        const res = await getSongsDetail({id: id, type: type});
        const resp = await getURl(res?.songs);
        setSongList(resp);
      }
    } catch (e) {
      console.log('Error on get Song List data --> ', e);
    }
  };

  useEffect(() => {
    if (songLoading !== 'idle') {
      getCurrentTrackList();
    }
  }, [songLoading]);

  useEffect(() => {
    setLoader(true);
    getSongList();
  }, []);

  const addSong = async ({index}) => {
    try {
      if (
        SongList[index]?.title === CurrentTrackStores?.currentList[index]?.title
      ) {
        CurrentTrackStores.updateIndex(index);
        await TrackPlayer.skip(index);
        TrackPlayer.play();
      } else {
        CurrentTrackStores.updateList(SongList);
        CurrentTrackStores.updateIndex(index);
        await TrackPlayer.reset();
        await TrackPlayer.add(SongList);
        await TrackPlayer.skip(index);
        TrackPlayer.play();
      }
    } catch (e) {
      console.log('error --> ', e);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {loader && (
        <View style={styles.loaderStyle}>
          <LottieView
            source={loaderJson}
            autoPlay={true}
            resizeMode="cover"
            style={{height: 80, width: 80}}
          />
        </View>
      )}

      {!loader && SongList?.length > 0 && (
        <SafeAreaView style={{flex: 1, backgroundColor: '#2F2F2F'}}>
          <Animated.ScrollView
            contentContainerStyle={{
              paddingTop: HeaderHeight.HEADER_MAX_HEIGHT,
            }}
            scrollEventThrottle={16}
            style={{backgroundColor: COLORS.bg}}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {useNativeDriver: true},
            )}>
            {SongList?.map((singleSong, index) => {
              return (
                <RenderSongCard
                  key={index}
                  songDetail={singleSong}
                  index={index}
                />
              );
            })}
          </Animated.ScrollView>

          {/*Animated Header image & title */}
          <Animated.View
            style={[
              styles.header,
              {transform: [{translateY: headerTranslateY}]},
            ]}>
            <Animated.Image
              style={[
                styles.headerBackground,
                {
                  opacity: imageOpacity,
                  transform: [{translateY: imageTranslateY}],
                },
              ]}
              source={{
                uri: backImage,
              }}
            />
            <Animated.Text
              style={[
                styles.albumTitleStyle,
                {
                  opacity: imageOpacity,
                  transform: [{scale: titleScale}],
                },
              ]}
              numberOfLines={1}>
              {title}
            </Animated.Text>
          </Animated.View>

          {/*Animated Header Icons */}
          <Animated.View
            style={[
              styles.topBar,
              {
                transform: [{translateY: titleTranslateY}],
              },
            ]}>
            <Animated.View style={{alignSelf: 'center', width: '90%'}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{height: 32, width: 32}}>
                <Octicons name="arrow-left" size={32} color={COLORS.primary} />
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {!loader && songLoading !== 'idle' && songLoading !== 'stopped' && (
            <BottomPlayerCard onPress={() => modalizeRef?.current.open()} />
          )}

          <Modalize
            ref={modalizeRef}
            modalHeight={Dimensions.get('window').height}
            withHandle={false}>
            <Player onClose={() => modalizeRef?.current.close()} />
          </Modalize>
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bg,
    overflow: 'hidden',
    height: HeaderHeight.HEADER_MAX_HEIGHT,
  },
  headerBackground: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    width: '75%',
    alignSelf: 'center',
    height: HeaderHeight.HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  topBar: {
    marginTop: 7,
    height: HeaderHeight.HEADER_MIN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: 'white',
    fontSize: 20,
  },
  avatar: {
    height: 54,
    width: 54,
    resizeMode: 'contain',
    borderRadius: 54 / 2,
  },
  fullNameText: {
    fontSize: 16,
    marginLeft: 24,
  },
  albumTitleStyle: {
    position: 'absolute',
    bottom: 0,
    color: COLORS.primary,
    borderRadius: 7,
    padding: 10,
    backgroundColor: COLORS.bgTR,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  songCardStyle: {
    height: 60,
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: COLORS.primary,
    backgroundColor: COLORS.bg,
    borderWidth: 0.3,
    borderRadius: 8,
  },
  shadowStyle: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 8,
  },
  loaderStyle: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
});

export default observer(SongListScreen);
