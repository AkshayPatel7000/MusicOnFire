import { makeAutoObservable } from 'mobx';

class CurrentTrackStore {
  currentList = [];
  currentIndex = 0;
  songState = 'idle';

  constructor() {
    makeAutoObservable(this);
  }

  updateList = (data) => {
    this.currentList = data;
  };
  updateIndex = (data) =>{
    this.currentIndex = data;
  };
  updateOnNext = () =>{
    this.currentIndex = this.currentIndex++;
  };
  updateState = (data) =>{
    this.currentIndex = data;
  };
}

const CurrentTrackStores = new CurrentTrackStore();
export default CurrentTrackStores;
