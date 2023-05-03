function getGender(gender) {
  return {
    man: ["man", "both"],
    woman: ["woman", "both"],
    both: ["man", "woman", "both"],
  }[gender];
}

module.exports = getGender;
