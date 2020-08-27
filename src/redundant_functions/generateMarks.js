export default function generateMarks(min, max, step, suffix) {
  let marks = [];
  let steps = 0;
  for (let i = min; i <= max; i += step) {
    steps++;
  }
  for (let i = 0; i < steps; i++) {
    const result = min + step * i;
    marks.push({ value: result, label: `${result}${suffix}` });
  }
  return marks;
}
