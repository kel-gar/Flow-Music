import React, { Component } from 'react';
// import { Link } from 'react-router-dom'; this was needed at one point but came up in DevTools as error
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import './Album.css';


class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      currentVolume: 0.7,
      isPlaying: false,
      isHovered: false,
      dynamicClass: 'song-number',
      targetId: 0
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
    this.audioElement.volume = this.state.currentVolume;
  }
    componentDidMount() {
      this.eventListeners = {
       timeupdate: e => {
         this.setState({ currentTime: this.audioElement.currentTime });
       },
       durationchange: e => {
         this.setState({ duration: this.audioElement.duration });
       },
       volumechange: e => {
         this.setState({ currentVolume: this.audioElement.volume });
       }
     };
      this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
      this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
      this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
    }

    componentWillUnmount() {
      this.audioElement.src = null;
      this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
      this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
      this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
    }

    play() {
      this.audioElement.play();
      this.setState({ isPlaying: true });
    }

    pause() {
      this.audioElement.pause();
      this.setState({ isPlaying: false });
    }

    setSong(song) {
      this.audioElement.src = song.audioSrc;
      this.setState({ currentSong: song });
    }

    handleSongClick(song) {
      const isSameSong = this.state.currentSong === song;
      if (this.state.isPlaying && isSameSong) {
        this.pause();
      } else {
        if (!isSameSong) { this.setSong(song); }
        this.play();
      }
    }

    handlePrevClick() {
      const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.max(0, currentIndex - 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
    }

    handleNextClick() {
      const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
    }

    handleTimeChange(e) {
      const newTime = this.audioElement.duration * e.target.value;
      this.audioElement.currentTime = newTime;
      this.setState({ currentTime: newTime });
    }

    handleVolumeChange(e) {
      const newVolume = e.target.value;
      this.audioElement.volume = newVolume;
      this.setState({ currentVolume: newVolume });
    }

    formatTime(time) {
      if (isNaN(time) === true || time === undefined ) {
        return '--:--';
      }
      var minutes = Math.floor(time / 60);
      var seconds = time - minutes * 60;
      minutes = minutes.toString();
      if (seconds < 10) {
        seconds = Math.floor(seconds.toString());
        return minutes + ":0" + seconds;
      } else {
        seconds = Math.floor(seconds.toString());
        return minutes + ":" + seconds;
      }
    }

    mouseEnter(e) {
      console.log(e.target.id);
      if (e.target !== this.state.currentSong && !this.state.isPlaying) {
        this.setState({
          dynamicClass: 'icon ion-ios-play',
          targetId: e.target.id
        });
      }
    }

    mouseLeave(e) {
      console.log(e.target);
      if (!this.state.currentSong || !this.state.isPlaying) {
        this.setState({
          dynamicClass: 'song-number',
          targetId: e.target.id
        });
      }
      else if (this.state.currentSong) {
        this.setState({
          dynamicClass: 'icon ion-ios-pause',
          targetId: e.target.id
        })
      }
    }


   render() {
     return (
       <section className="album">
         <section id="album-info">
           <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title} />
           <div className="album-details">
             <h1 id="album-title">{this.state.album.title}</h1>
             <h2 className="artist">{this.state.album.artist}</h2>
             <div id="release-info">{this.state.album.releaseInfo}</div>
           </div>
         </section>
         <table id="song-list" align="center">
           <colgroup>
             <col id="song-number-column" />
             <col id="song-title-column" />
             <col id="song-duration-column" />
           </colgroup>
           <tbody>
              {this.state.album.songs.map(( song, index ) =>
                <tr className="song" key={index} onClick={() => this.handleSongClick(song)} >
                  <td className="song-actions">
                   <button>
                     <span className={(this.state.isPlaying && (this.state.currentSong === song)) ?'hidden-number' : 'song-number'}>{index + 1}</span>
                     <span className={(this.state.isPlaying && (this.state.currentSong === song)) ? 'icon ion-ios-pause' : ''}></span>
                     <span className={(this.state.isPlaying && (this.state.currentSong === song)) ? '' : 'icon ion-ios-play'}></span>
                   </button>
                 </td>
                  <td className="song-title">{song.title}</td>
                  <td className="song-duration">{this.formatTime(song.duration)}</td>
                </tr>
                  )
                }
           </tbody>
         </table>
         <PlayerBar
           isPlaying={this.state.isPlaying}
           currentSong={this.state.currentSong}
           currentTime={this.audioElement.currentTime}
           duration={this.audioElement.duration}
           currentVolume={this.audioElement.volume}
           handleSongClick={() => this.handleSongClick(this.state.currentSong)}
           handlePrevClick={() => this.handlePrevClick()}
           handleNextClick={() => this.handleNextClick()}
           handleTimeChange={(e) => this.handleTimeChange(e)}
           handleVolumeChange={(e) => this.handleVolumeChange(e)}
           formatTime={(time) => this.formatTime(time)}
         />
       </section>
     );
   }
 }

 export default Album;
