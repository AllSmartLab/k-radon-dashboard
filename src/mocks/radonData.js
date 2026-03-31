export const generateRadonData = () => {
  const data = [];
  for (let i = 0; i < 3500; i += 10) {
    // Generate some sine wave like dummy data
    const value = Math.sin(i * 0.01) * 50 + 100 + (Math.random() * 10 - 5);
    data.push({
      count: i,
      level: Math.max(0, parseFloat(value.toFixed(1))), // ensure positive
    });
  }
  return data;
};

export const calculateAverage = (data) => {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, curr) => acc + curr.level, 0);
  return (sum / data.length).toFixed(1);
};

export const calculateMax = (data) => {
  if (data.length === 0) return 0;
  return Math.max(...data.map(d => d.level)).toFixed(1);
};

export const evaluateStatus = (average) => {
  return parseFloat(average) < 148 ? '정상' : '개선권고';
};
