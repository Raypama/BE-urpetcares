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
const { getNewsBlog } = require("../controllers/news");
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

//add third party be berita news
router.get("/news", getNewsBlog);
 

module.exports = router;
