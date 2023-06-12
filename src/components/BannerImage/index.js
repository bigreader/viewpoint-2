import React from 'react';
import MD5 from 'md5.js';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './BannerImage.css';

const hexTop = ['8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
function randomPattern(str) {
  let digit = new MD5().update(str).digest('hex')[0];
  if (digit > '7') {
    digit = hexTop.indexOf(digit);
  }
  return parseInt(digit) + 1;
}

export default props => (
  <div className={'banner-image bg-' + props.bg} >
    <img className="pattern" src={`/img/pattern-${randomPattern(props.title)}.svg`} alt="" />
    <h3>{props.title}</h3>
    <h4>{props.summary}</h4>
    {props.value > 0 &&
      <CircularProgressbar value={props.value * 25 - 25} text={Math.round(props.value * 10) / 10}
        strokeWidth={12} circleRatio={0.66} styles={buildStyles({
          rotation: 1 / 2 + 1 / 6,
          pathTransitionDuration: 0.1,
          pathColor: '#fff',
          trailColor: '#fff4',
          textColor: '#fff',
          textSize: '34px'
        })} />};
  </div>
);
