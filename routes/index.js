const express = require ("express"); //import same as on react
const { getUser, getUserById, editUser, register, login, deleteUser } = require("../controllers/user");
const fileUpload = require("../middlewares/uploadFile");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router();

router.get('/users' ,getUser )
router.get('/users/:id' ,checkAuth,getUserById )
router.patch('/users' ,checkAuth,editUser )
router.delete('/users/:id',checkAuth ,deleteUser )
router.post('/register',fileUpload("image") ,register )
router.post('/login' ,login )







module.exports = router