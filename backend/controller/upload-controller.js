exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  return res.status(200).json({
    message: "File uploaded successfully",
    filePath: `/${req.body.folderName}/${req.file.filename}`,
  });
};
