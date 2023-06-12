
const moodSummaries = [
  'Masochistic',
  'Abysmal',
  'Abominable',
  'Terrible',
  'Dire',
  'Awful',
  'Yikes',
  'Grim',
  'Bad',
  'Oof',
  'Unfortunate',
  'Poor',
  'Lacking',
  'Mediocre',
  'Passable',
  'Fair',
  'Reasonable',
  'Okay',
  'Alright',
  'Acceptable',
  'Middling',
  'Decent',
  'Satisfactory',
  'Good',
  'Respectable',
  'Great',
  'Admirable',
  'Awesome',
  'Remarkable',
  'Superb',
  'Impressive',
  'Excellent',
  'Brilliant',
  'Outstanding',
  'Fantastic',
  'Wonderful',
  'Astonishing',
  'Fabulous',
  'Incredible',
  'Miraculous',
  'Perfect'
];

const Calc = {
  slices: {
    sort: function(decision, side) {
      return decision[side].slice().sort((a, b) => decision.average(b) - decision.average(a));
    },

    best: function(decision, side) {
      const best = decision[side].reduce((acc, slice) => {
        const score = decision.average(slice);
        if (score > acc.score) return { score, results: [slice] };
        if (score === acc.score) acc.results.push(slice);
        return acc;
      }, { score: 0, results: [] });
      return best;
    },

    worst: function (decision, side) {
      const worst = decision[side].reduce((acc, slice) => {
        const score = decision.average(slice);
        if (score === -1) return acc;
        if (score < acc.score) return { score, results: [slice] };
        if (score === acc.score) acc.results.push(slice);
        return acc;
      }, { score: 6, results: [] });
      return worst;
    }
  },

  moods: {
    average: function (moods = [], decision, weighted = false) {
      const validMoods = moods.filter(mood => mood.set);
      if (!moods || validMoods.length === 0) return -1;
      const sumVals = validMoods.reduce((acc, mood) => acc + mood.val, 0);
      let avg = sumVals / validMoods.length;

      if (weighted) {
        console.log(avg);
        const reverseMoods = moods.slice().reverse();
        const weight = 0.2;
        reverseMoods.forEach((mood, i) => {
          if (!mood.set) return;
          // const weight = (moods.length + 5 - i) * 0.05;
          avg = (avg * (1 - weight)) + mood.val * weight;
          console.log(mood.val, weight, avg);
        });
        console.log(avg);
      }

      if (!decision) return avg;
      
      const best = Calc.slices.best(decision, 'options').score;
      const worst = Calc.slices.worst(decision, 'options').score * 0.95;

      return Math.max(1, Math.min(5, (avg - worst) / (best - worst) * 4 + 1));
    },

    averageRound: function (moods, decision) {
      return Math.round(this.average(moods, decision));
    },

    summary: function (moods) {
      const avg = this.average(moods, null, true);
      if (avg < 0) return 'Undecided';
      if (moods.filter(mood => mood.set).length < Math.min(moods.length, 3)) return 'Undecided';
      return moodSummaries[Math.round((avg - 1) / 4 * (moodSummaries.length - 1))] || 'Unknown';
    },

    bg: function (moods, decision) {
      const avg = this.averageRound(moods, decision);
      return (avg >= 1? 'grad-' + avg : 'unknown');
    }
  }
}

export default Calc;