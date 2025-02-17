const express = require("express"); //import same as on react
//=====export dari controllers=======
const {
  getUser,
  getUserById,
  editUser,
  register,
  login,
  deleteUser,
  handleEmail,
} = require("../controllers/user");
const {
  insertService,
  getServiceById,
  getService,
  updateService,
  deleteService,
} = require("../controllers/service");
const {
  getBooking,
  createBooking,
  getBookingById,
  deleteBooking,
  updateBooking,
  getBookingByUser,
} = require("../controllers/booking");
const {
  createTransaction,
  getTransaction,
  getTransactionById,
  updateTransaction,
} = require("../controllers/transaction");
//-----------------------------------------------------------------------------------
const fileUpload = require("../middlewares/uploadFile");
const checkAuth = require("../middlewares/checkAuth");
const { verifyToken } = require("../controllers/verifyToken");
const { default: axios } = require("axios");
const router = express.Router();

//===============================================================================

//Users
router.get("/users", getUser);
router.get("/users/:id", checkAuth, getUserById);
router.patch("/users/:id", checkAuth, fileUpload("photo"), editUser);
router.delete("/users/:id", checkAuth, deleteUser);
router.post("/register", fileUpload("photo"), register);
router.post("/login", login);
//===============================================================================

//Services
router.get("/service", getService);
router.get("/service/:id", checkAuth, getServiceById);
router.post("/service", checkAuth, insertService);
router.patch("/service/:id", checkAuth, updateService);
router.delete("/service/:id", checkAuth, deleteService);
//===============================================================================

//Booking
router.get("/booking", getBooking);
router.get("/booking-user", checkAuth, getBookingByUser);
router.get("/booking/:id", checkAuth, getBookingById);
router.post("/booking", checkAuth, createBooking);
router.patch("/booking/:id", checkAuth, updateBooking);
router.delete("/booking/:id", checkAuth, deleteBooking);
//===============================================================================

// //Transactions
router.get("/transaction", getTransaction);
router.post(
  "/transaction",
  checkAuth,
  fileUpload("receipt"),
  createTransaction
);
router.get("/transaction/:id", checkAuth, getTransactionById);
router.patch("/transaction/:id", checkAuth, updateTransaction);

//add front-end
router.get("/verify-token", checkAuth, verifyToken);
router.get("/check-email", handleEmail);

const API_KEY =
  "31f0b4445cfd64e9373f943837fd32a8283fc961cb62964c8a7f28052fb0beec";
router.get("/news", async (req, res) => {
  try {
    const response = await axios.get(
      `https://serpapi.com/search.json?hl=en&gl=us&engine=google_news&q=pets%20lovers&api_key=${API_KEY}`
    );
    res.json(response.data.news_results);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

module.exports = router;
