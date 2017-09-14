
exports.dayAgo = (day) => {
  const now = new Date();
  now.setDate(now.getDate() - day);
  return now;
};
