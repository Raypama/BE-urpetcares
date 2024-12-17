exports.verifyToken = (req, res) => {
  const user = req.user;
  try {
    res.status(200).json({
      data: user,
      message: "success verify token",
    });
  } catch (error) {
    console.log(error);
  }
};
