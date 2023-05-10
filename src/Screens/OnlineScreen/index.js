import {observer} from 'mobx-react';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  LogBox,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {Event, usePlaybackState} from 'react-native-track-player';
import AlbumComponent from '../../Components/albumComponent';
import {getDashboardSongs} from '../../Services';
import {initPlayer} from '../../Services/TrackPlayerService';
import CurrentTrackStores from '../../Utils/mobx/currentTrack';

//Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomPlayerCard from '../../Components/bottomPlayerCard';
import {COLORS} from '../../Utils/Constants';
import { Modalize } from 'react-native-modalize';
import Player from './Player';

// Octicons.loadFont();
Feather.loadFont();
Ionicons.loadFont();
AntDesign.loadFont();
Entypo.loadFont();

LogBox.ignoreAllLogs();

const events = [Event.PlaybackState, Event.PlaybackError];

const OnlineScreen = () => {
  const animated = useRef(new Animated.Value(0)).current;
  const modalizeRef = useRef();
  const [allList, setAllList] = useState(null);
  const [loading, setLoading] = useState(false);
  const songLoading = usePlaybackState();
  // const currentQueue = CurrentTrackStores.currentList;
  // const currentTrack = CurrentTrackStores.currentIndex;

  const getSongsData = async () => {
    setLoading(true);
    const res = await getDashboardSongs();
    setAllList(res);
    setLoading(false);
  };

  useEffect(() => {
    getSongsData();
    initPlayer();
  }, []);

  return (
    <>
      <StatusBar backgroundColor={'#2E2E2E'} />
      <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
        <Animated.View
          style={[
            styles.app,
            {
              borderRadius: animated.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 12],
              }),
            },
          ]}>
          <ScrollView
            style={[styles.HomeContainer]}
            scrollEnabled
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={getSongsData}
                progressViewOffset={5}
                colors={['#0057e7', '#d62d20', '#ffa700', '#008744']}
                progressBackgroundColor={COLORS.primary}
              />
            }>
            {allList && !loading && (
              <>
                <AlbumComponent
                  title={'Trending Now'}
                  data={allList?.new_trending}
                  onPress={() => {}}
                />
                <AlbumComponent
                  title={'New Release'}
                  data={allList?.new_albums}
                />
                <AlbumComponent title={'Top Charts'} data={allList?.charts} />
                <AlbumComponent
                  title={'Editorial Picks'}
                  data={allList?.top_playlists}
                />
                {/* <AlbumComponent
                  title={'Pick Your Mood'}
                  data={allList?.tag_mixes}
                /> */}
                {/* <AlbumComponent
                  title={'Radio Stations'}
                  data={allList?.radio}
                  imageBorder={100}
                /> */}
              </>
            )}
          </ScrollView>
          {songLoading !== 'idle' && <BottomPlayerCard onPress={() => modalizeRef?.current.open()} />}

          <Modalize
            ref={modalizeRef}
            modalHeight={Dimensions.get('window').height-50}
            withHandle={false}>
            <Player onClose={() => modalizeRef?.current.close()} />
          </Modalize>
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  HomeContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  app: {
    flex: 1,
    backgroundColor: '#2E2E2E',
  },
});

export default observer(OnlineScreen);
