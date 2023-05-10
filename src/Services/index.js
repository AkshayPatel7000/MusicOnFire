import axios from 'axios';

const URL = 'https://music-on-fire.vercel.app';

export const getDashboardSongs = async () => {
  try {
    const response = await axios.get(URL + '/api/v1/getlaunchdata');
    if (response.data) {
      // console.log('Response Dashboard --> ', JSON.stringify(response.data.data));
      return response.data.data;
    } else {
      console.log('Response Error --> ', JSON.stringify(response));
    }
  } catch (e) {
    console.log('Error on get Dashboard Data --> ', e);
    return e;
  }
};

export const getSongsOfPlaylist = async ({id, type}) => {
  try {
    console.log(id, type);
    const response = await axios.get(
      URL + `/api/v1/getPlaylistDetails?pid=${id}`,
    );
    if (response.data) {
      return response.data?.data;
    } else {
      console.log('Response Error --> ', JSON.stringify(response));
    }
  } catch (e) {
    console.log('Error on get Songs of album --> ', e);
    return e;
  }
};

export const getSongsOfAlbum = async ({id, type}) => {
  try {
    console.log(id, type);
    const response = await axios.get(
      URL + `/api/v1/getAlbumDetails?aid=${id}`,
    );
    console.log(response);
    if (response.data) {
      return response.data.data;
    } else {
      console.log('Response Error --> ', JSON.stringify(response));
    }
  } catch (e) {
    console.log('Error on get Songs of album --> ', e);
    return e;
  }
};

export const getSongsDetail = async ({id, type}) => {
  try {
    console.log(id, type);
    const response = await axios.get(
      URL + `/api/v1/getdetails?id=${id}&type=${type}`,
    );
    if (response.data) {
      return response.data.data;
    } else {
      console.log('Response Error --> ', JSON.stringify(response));
    }
  } catch (e) {
    console.log('Error on get Songs of album --> ', e);
    return e;
  }
};

export const getStationData = async ({name, type}) => {
  try {
    console.log(name, type);
    const response = await axios.get(
      URL + `/api/v1/getsongs?type=radio&name=${name}&radio_type=${type}`,
    );
    if (response.data) {
      return response.data.data;
    } else {
      console.log('Response Error --> ', JSON.stringify(response));
    }
  } catch (e) {
    console.log('Error on get Station Data --> ', e);
    return e;
  }
};

export const getSongUrl = async ({id}) => {
  try {
    const response = await axios.get(
      URL + `/api/v1/getsongurl?id=${id}&bitrate=128`,
    );
    if (response.data) {
      return response.data;
    } else {
      console.log('Response Error --> ', JSON.stringify(response));
    }
  } catch (e) {
    console.log('Error on get SongURL --> ', e);
    return e;
  }
};