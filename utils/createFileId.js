async function createFileId(file) {
  const id = file.uid.slice(0, 4);
  return id;
}

module.exports = createFileId;
