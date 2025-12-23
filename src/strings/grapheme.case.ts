import { bench, summary, do_not_optimize } from 'mitata';
import { start } from '@utils';

summary(() => {
  const tests = [
    "hello",
    "world",
    "café",
    "naïve",
    "😊",
    "👩👩👧👧",
    "👍🏽",
    "résumé",
    "mañana",
    "💡",
    "über",
    "façade",
    "🍕",
    "coöperate",
    "😊😊",
    "🏳️🌈",
    "❤️",
    "🇺🇸",
    "🇫🇷",
    "👍",
    "🐍",
    "👩🏿",
    "💻",
    "🍩",
    "🎉",
    "🏀",
    "🎸",
    "👀",
    "🎶",
    "🌍",
    "🎃",
    "🥳",
    "🦄",
    "💎",
    "🎲",
    "👾",
    "🤖",
    "🧠",
    "🤡",
    "🤠",
    "🎯",
    "👻",
    "💥",
    "🚀",
    "🌟",
    "✨",
    "🔥",
    "🍎",
    "📚",
    "✈️",
    "⛄"
  ];

  const register = (name: string, fn: (str: string) => void) => {
    bench(name, function* () {
      yield {
        [0]: () => tests,
        bench: (arr: typeof tests) => {
          arr.forEach(fn);
        }
      }
    });
  }

  register('baseline (Array.from)', (str) => {
    do_not_optimize(Array.from(str).length);
  });
  register('baseline (spread)', (str) => {
    do_not_optimize([...str].length);
  });
  register('iterator (for-of)', (str) => {
    let len = 0;
    for (const _ of str) len++;
    do_not_optimize(len);
  });
  register('iterator (manual)', (str) => {
    let len = 0, iter = str[Symbol.iterator]();
    while (!iter.next().done) len++;
    do_not_optimize(len);
  });
});
