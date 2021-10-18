type LookupPart =
  | {
      type: 'object';
      value: string;
    }
  | {
      type: 'array';
      value: number;
    };

export const parseLookupString = (lookupString: string): LookupPart[] => {
  const cleanLookupString = lookupString
    .replace(/^\.*/, '')
    .replace(/\.*$/, '')
    .replaceAll('.[', '[')
    .replaceAll('.]', ']');

  if (/\[[^0-9]*\]/.test(cleanLookupString)) throw new Error('Array index must be an integer');

  const lookupParts = cleanLookupString
    .split('[')
    .flatMap((a) => a.split(']'))
    .flatMap((a) => a.split('.'))
    .filter((a) => a.length > 0);

  const parsedLookup = lookupParts.map((d) => {
    if (isNaN(parseInt(d, 10))) return { type: 'object' as const, value: d };
    return { type: 'array' as const, value: parseInt(d, 10) };
  });

  return parsedLookup;
};

export const lookupValue = (source: any, lookup: string): any => {
  const parsedLookup = parseLookupString(lookup);

  return parsedLookup.reduce((acc, cur) => {
    if (cur.type === 'object') {
      if (typeof acc !== 'object') throw new Error();
      if (!(cur.value in acc)) throw new Error();
      return acc[cur.value];
    }
    if (cur.type === 'array') {
      if (!Array.isArray(acc)) throw new Error();
      if (cur.value >= acc.length) throw new Error();
      return acc[cur.value];
    }
    return acc;
  }, source);
};
