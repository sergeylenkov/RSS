export function combineStyles(...arg: any[]) {
  const newStyles: { [key: string]: string } = {};

  Array.from(arg).forEach(argument => {
    Object.keys(argument).forEach(key => {
      if (newStyles[key]) {
        newStyles[key] = `${newStyles[key]} ${argument[key]}`;
      } else {
        newStyles[key] = argument[key];
      }
    })
  });

  return newStyles;
}