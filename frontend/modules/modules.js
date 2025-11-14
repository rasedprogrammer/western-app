export const trimData = (obj) => {
  const finalData = {};
  for (let key in obj) {
    finalData[key] = obj[key]?.trim().toLowerCase();
  }
  return finalData;
};
