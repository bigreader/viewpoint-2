import Calc from './calc';

function listOut(arr, conj = 'and', bold = false) {
  if (bold) arr = arr.map(str => `<b>${str}</b>`);
  switch (arr.length) {
    case 0:
      return '';
    case 1:
      return `${arr[0]}`;
    case 2:
      return `${arr[0]} ${conj} ${arr[1]}`;
    case 3:
      return `${arr[0]}, ${arr[1]} ${conj} ${arr[2]}`;
    default:
      if (!bold) arr = arr.slice();
      const last = arr.pop();
      return `${arr.join(', ')}, ${conj} ${last}`;
  }
}

export default [
  decision => {
    if (decision.options.length <= 1) {
      return {
        title: 'Add some options',
        body: "Add a few of the options you're deciding between.",
        bg: 'subtle',
        stop: true
      }
    }
    if (decision.factors.length === 0) {
      return {
        title: 'Add some factors',
        body: 'Enter some factors that might influence your decision.',
        bg: 'subtle',
        stop: true
      }
    }
    if (decision.moods.filter(mood => mood.set).length === 0) {
      return {
        title: 'Add some feelings',
        body: 'Select an option or factor, then select how you feel about each aspect of your decision.',
        bg: 'subtle',
        stop: true
      }
    }
    if (decision.moods.filter(mood => mood.set).length < decision.moods.length * 0.8) {
      return {
        title: 'Keep adding feelings',
        body: 'Continue adding feelings to see more insights into your decision.',
        bg: 'subtle',
        stop: true
      }
    }
    return false;
  },


  decision => {
    if (!decision.moods.find(mood => !mood.set)) return false;

    const moods = decision.moods.filter(mood => !mood.set);
    // const options = [...new Set(moods.map(mood => mood.option))];
    // const factors = [...new Set(moods.map(mood => mood.factor))];
    const { options, factors } = moods.reduce((acc, mood) => {
      if (!acc.options.find(opt => opt._id === mood.option._id)) acc.options.push(mood.option);
      if (!acc.factors.find(opt => opt._id === mood.factor._id)) acc.factors.push(mood.factor);
      return acc;
    }, {
        options: [],
        factors: []
      });

    console.log(options, factors);

    if (options.length === 1) {
      return {
        title: options[0].name,
        body: `You haven't added feelings on ${listOut(factors.map(s => s.name))} yet.`,
        bg: 'unknown'
      }
    } else if (factors.length === 1) {
      return {
        title: factors[0].name,
        body: `You haven't added feelings on ${listOut(options.map(s => s.name))} yet.`,
        bg: 'unknown'
      }
    } else if (options.length === 2) {
      return {
        title: options[0].name + ' & ' + options[1].name,
        body: `You haven't added feelings on ${listOut(factors.map(s => s.name))} yet.`,
        bg: 'unknown'
      }
    } else if (factors.length === 2) {
      return {
        title: factors[0].name + ' & ' + factors[1].name,
        body: `You haven't added feelings on ${listOut(options.map(s => s.name))} yet.`,
        bg: 'unknown'
      }
    } else if (options.length <= factors.length) {
      return {
        title: 'Add more feelings',
        body: `You haven't added all your feelings on ${listOut(options.map(s => s.name))}.`,
        bg: 'unknown'
      }
    } else {
      return {
        title: 'Add more feelings',
        body: `You haven't added all your feelings on ${listOut(factors.map(s => s.name))}.`,
        bg: 'unknown'
      }
    }
  },


  decision => {
    const { results, score } = Calc.slices.best(decision, 'options');
    if (results.length === 0) return false; // no slices with scores

    const sorted = Calc.slices.sort(decision, 'options');
    sorted.splice(0, results.length);
    if (sorted.length === 0) return {
      title: 'No Best',
      body: 'All options look about the same. Try adding more factors or revisiting how you feel.',
      bg: 'grad-2'
    }

    const gap = score - decision.average(sorted[0]);
    const insight = {};

    const gapPick = (arr) => {
      if (gap >= 1) return arr[0];
      if (gap >= 0.5) return arr[1];
      if (gap >= 0.25) return arr[2];
      return arr[3];
    }

    insight.bg = gapPick(['grad-5', 'grad-5', 'grad-5', 'mostly-p']);

    if (results.length === 1) {
      insight.title = results[0].name;
      insight.body = gapPick([
        `This is your best option by far.`,
        `This looks like your best option overall.`,
        `This is probably your best option overall.`,
        `It's close, but this seems like your best option overall.`
      ]);

    } else if (results.length === 2) {
      insight.title = `${results[0].name} & ${results[1].name}`;
      insight.body = gapPick([
        `These two are your best options by far.`,
        `These two look like your best options overall.`,
        `These two are probably your best options overall.`,
        `It's close, but these two seem like your best options overall.`
      ]);

    } else if (results.length > 2) {
      insight.title = `${results.length} Options`;
      const last = results.pop();
      const optionsStr = `${results.map(o => `<b>${o.name}</b>`).join(', ')}, and <b>${last.name}</b>`;
      insight.body = gapPick([
        `${optionsStr} are your best options by far.`,
        `${optionsStr} look like your best options overall.`,
        `${optionsStr} are probably your best options overall.`,
        `It's close, but ${optionsStr} seem like your best options overall.`
      ]);
    }

    return insight;
  },


  decision => {
    if (decision.factors.length <= 3) return false;

    let insights = [];

    const best = Calc.slices.best(decision, 'options');
    const nameFactors = arr => arr.map(diff => decision.factors[diff.i].name);

    decision.options.forEach(option => {
      const moods = decision.slice(option);
      const total = Calc.moods.average(moods);

      const diffs = moods.map((_, i) => {
        const trimmed = moods.slice();
        trimmed.splice(i, 1);
        return { i, val: Calc.moods.average(trimmed) - total };
      });

      const kingbreakers = diffs.filter(d => total + d.val >= best.score)
      if (kingbreakers.length && !best.results.includes(option)) {
        insights.unshift({
          title: option.name,
          body: `If it wasn't for ${listOut(nameFactors(kingbreakers), 'or')}, this could be your best option.`,
          bg: 'prob-p'
        })
      } else {
        const good = diffs.filter(d => d.val > (2 / decision.factors.length));
        if (good.length) {
          insights.push({
            title: option.name,
            body: `${listOut(nameFactors(good))} ${good.length > 1 ? 'are' : 'is'} holding this option back.`,
            bg: 'grad-3'
          })
        }

        const bad = diffs.filter(d => d.val < (-2 / decision.factors.length));
        if (bad.length) {
          const plural = bad.length > 1;
          insights.push({
            title: option.name,
            body: `${listOut(nameFactors(bad))} ${plural ? 'are' : 'is'} the only good ${plural ? 'things' : 'thing'} about this option.`,
            bg: 'grad-2'
          })
        }
      }

    });

    return insights;
  },


  decision => {
    let insights = [];

    decision.options.forEach(option => { // potential insight for each option

      const winningFactor = decision.factors.find(factor => { // find factor with no better options
        const factorMoods = decision.slice(factor); // get all moods from this factor
        const targetMood = decision.intersect(option, factor); // get the mood from this option
        const betterMood = factorMoods.find(mood => mood.val > targetMood.val) // find better mood, if any
        return !betterMood; // if no better mood found, we have a winning factor
      });

      if (!winningFactor) {
        insights.push({
          title: option.name,
          body: "You've got better options than this one in each of your factors.",
          bg: 'mostly-n'
        });
      }

    });

    return insights;
  },


  decision => {
    let insights = [];

    decision.factors.forEach(factor => {
      const moods = decision.slice(factor);

      if (!moods.find(mood => mood.val > 2)) {
        insights.push({
          title: factor.name,
          body: 'All your options look pretty bad for this factor.',
          bg: 'grad-1'
        })
      } else if (!moods.find(mood => mood.val > 3)) {
        insights.push({
          title: factor.name,
          body: 'None of your options look good for this factor.',
          bg: 'mostly-n'
        })
      } else if (!moods.find(mood => mood.val < 4)) {
        insights.push({
          title: factor.name,
          body: 'All of your options look great for this factor.',
          bg: 'grad-4'
        })
      }
      //  else if (!moods.find(mood => mood.val < 3)) {
      //   insights.push({
      //     title: factor.name,
      //     body: 'All of your options look good for this factor.',
      //     bg: 'mostly-p'
      //   })
      // }

    });

    return insights;
  },


  decision => {
    let insights = [];

    decision.options.forEach((option, i) => {
      const moods = decision.slice(option).map(mood => mood.val);

      decision.options.slice(i + 1).forEach(matchOpt => {
        const matchMoods = decision.slice(matchOpt).map(mood => mood.val);

        const diff = moods.reduce((acc, mood, i) => {
          const match = matchMoods[i];
          return acc + Math.abs(mood - match);
        }, 0);

        if (diff <= decision.factors.length / 3) {
          insights.push({
            title: option.name + ' & ' + matchOpt.name,
            body: 'You feel similar ways about both of these options. Adding more factors might help you decide.',
            bg: (decision.average(option) > 3) ? 'prob-p' : 'prob-n'
          });
        }
      });
    });

    return insights;
  },


  decision => {
    let insights = [];

    decision.options.forEach(option => {
      const moods = decision.slice(option);

      if (!moods.find(mood => mood.val > 2)) {
        insights.push({
          title: option.name,
          body: "This option doesn't look good at all.",
          bg: 'grad-1'
        })
      } else if (!moods.find(mood => mood.val > 3)) {
        insights.push({
          title: option.name,
          body: "This option doesn't have many good qualities.",
          bg: 'mostly-n'
        })
      } else if (!moods.find(mood => mood.val < 4)) {
        insights.push({
          title: option.name,
          body: 'Everything looks great with this option.',
          bg: 'grad-4'
        })
      } else if (!moods.find(mood => mood.val < 3)) {
        if (moods.filter(mood => mood.val < 4).length <= decision.factors.length / 3) {
          insights.push({
            title: option.name,
            body: 'Everything looks good with this option.',
            bg: 'grad-4'
          })
        } else {
          insights.push({
            title: option.name,
            body: "There's no major downsides to this option.",
            bg: 'mostly-p'
          })
        }
      }

    });

    return insights;
  }
];
