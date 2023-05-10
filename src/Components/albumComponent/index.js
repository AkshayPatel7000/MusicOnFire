import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet, Text, FlatList, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS } from '../../Utils/Constants';

const AlbumComponent = ({title, data, imageBorder = 7, onPress = () => {}}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.ListStyle}>
      <Text style={styles.titleStyle}>{title}</Text>
      {data && (
        <FlatList
          data={data}
          horizontal={true}
          decelerationRate={'fast'}
          showsHorizontalScrollIndicator={false}
          style={{marginTop: 15}}
          renderItem={itemData => {
            const {index, item} = itemData;
            let title = item?.title.replace(/&amp;/g, '&');
            let imageURl = item?.image.replace(/150x150/g, '250x250');
            let id = item?.perma_url?.split('/');
            return (
              <TouchableOpacity
                key={index}
                style={styles.albumCard}
                onPress={() => {
                  onPress();
                  navigation.navigate('SongList', {
                    backImage: item?.image.replace(/150x150/g, '500x500'),
                    title: title?.replace(/&quot;/g, '"'),
                    id: id[id?.length - 1],
                    typeId: item?.id,
                    station_type: item?.more_info?.featured_station_type,
                    type: item?.type,
                  });
                }}>
                <FastImage
                  source={{uri: imageURl, priority: 'high'}}
                  style={{
                    height: 150,
                    width: 150,
                    borderRadius: imageBorder,
                  }}
                  resizeMode={'cover'}
                />
                <Text style={styles.SongTitleStyle} numberOfLines={1}>
                  {title.replace(/&quot;/g, '"')}
                </Text>
                {item?.subtitle && (
                  <Text style={styles.SongTitleStyle} numberOfLines={1}>
                    {item?.subtitle}
                  </Text>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ListStyle: {
    flex: 1,
    marginTop: 20,
    marginLeft: 10,
    alignSelf: 'center',
  },
  titleStyle: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '700',
  },
  albumCard: {
    // height: 180,
    width: 150,
    marginHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'column',
  },
  SongTitleStyle: {
    color: '#d9d9d9',
    textAlign: 'center',
    width: '95%',
    marginTop: 4,
  },
});

export default AlbumComponent;
