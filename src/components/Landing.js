import React from 'react';
import './Landing.css';

const Landing = () => (
  <section className="landing">

    <h1 className="hero-title">Turn the music up!</h1>
    <section className="selling-points row">
      <div className="point col-md-4">
        <h2 className="point-title">Choose Your Music</h2>
        <p className="point-description">The world is full of music; why should you have to listen to music that someone else chose?</p>
        <span className="icon ion-ios-musical-notes custom-icon"></span>
      </div>
      <div className="point col-md-4">
        <h2 className="point-title">Unlimited, Streaming, Ad-free</h2>
        <p className="point-description">No arbitrary limits. No distractions.</p>
        <span className="icon ion-thumbsup custom-icon"></span>
      </div>
      <div className="point col-md-4">
        <h2 className="point-title">Mobile Enabled</h2>
        <p className="point-description">Listen to your music on the go. This streaming service is available on all mobile platforms.</p>
        <span className="icon ion-earth custom-icon"></span>
      </div>
    </section>
  </section>


);

export default Landing;
