const convertDocToObject = (documentArray) => {
  return documentArray.map((i) => i.toObject({ getters: true }));
};
module.exports = convertDocToObject;
