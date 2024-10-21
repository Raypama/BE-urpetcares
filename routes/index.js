const express = require ("express"); //import same as on react
//=====export dari controllers=======
const { getUser, getUserById, editUser, register, login, deleteUser } = require("../controllers/user");
const { insertService, getServiceById, getService, updateService, deleteService } = require("../controllers/service");
//-----------------------------------------------------------------------------------
const fileUpload = require("../middlewares/uploadFile");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router();


//Users
router.get('/users' ,getUser )
router.get('/users/:id' ,checkAuth,getUserById )
router.patch('/users/:id' ,checkAuth,fileUpload("image"),editUser )
router.delete('/users/:id',checkAuth ,deleteUser )
router.post('/register',fileUpload("image") ,register )
router.post('/login' ,login )

//Services
router.get('/service' , getService )
router.get('/service/:id' ,checkAuth, getServiceById )
router.post('/service' ,checkAuth, insertService )
router.patch('/service/:id' ,checkAuth, updateService )
router.delete('/service/:id',checkAuth ,deleteService )






module.exports = router