import React from 'react';
// import EditHead from '../EditHead';
import MoodList from '../MoodList';
import Placeholder from '../Placeholder';
import BannerImage from '../BannerImage';
import Calc from '../../utils/calc';

export default ({ decision, selected, ...props }) => {
  if (!decision || !selected.id) {
    return (
      <Placeholder>
        Select an option or factor to start.
      </Placeholder>
    )
  }

  const slice = decision[selected.from].find(slice => slice._id === selected.id);
  const searchKey = selected.from.replace(/s$/, ''); //depluralize collection key, eww
  const moods = decision.moods.filter(mood => mood[searchKey]._id === selected.id);

  return (
    <>
      <BannerImage title={slice.name} summary={Calc.moods.summary(moods)} value={Calc.moods.average(moods)} bg={Calc.moods.bg(moods, decision)} />
      {slice.img && <img className="img-fluid rounded my-3" src={slice.img} alt={decision.title} />}
      <MoodList decision={decision} side={searchKey} moods={moods} onMoodChange={props.onMoodChange} />
    </>
  )
}
