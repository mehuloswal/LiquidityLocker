const parser = {
  number: (value) => (value?.toNumber ? value.toNumber() : null),
  address: (value) => value || null,
  date: (value) => (value?.toNumber ? new Date(value.toNumber() * 1000) : null),
  misc: (value) => value || null,
};

export function parse(data, mapping) {
  return data.map((i) => {
    const parsedData = i.reduce((acc, cur, idx) => {
      const { key, type } = mapping[idx];
      const value = parser[type || 'misc']?.(cur);

      return {
        ...acc,
        [key]: value,
      };
    }, {});

    return parsedData;
  });
}
