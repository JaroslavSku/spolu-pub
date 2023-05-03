function shiftLocation() {
  adverts.forEach((item, index) => {
    adverts2.splice(index, 1);
    if (adverts2.some((o) => o.longitude == item.longitude)) {
      item.longitude = item.longitude - 0.000003;
    }
  });
}

export default shiftLocation;
