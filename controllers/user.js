const { User, Booking, Service } = require('../models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const deleteFile = require('../middlewares/deleteFile');
const fs = require('fs');


// ======================================================================================
exports.register = async (req, res) => {


    try {
        const { name, email, password, phone, address } = req.body
        const saltRound = 10 //waktu hash/encrypt password perdetik -10 hash perdetik
        const encryptPassword = bcrypt.hashSync(password, saltRound)
        const photo = req.file.filename //? req.file.filename : null;        
        // console.log(password, 'without encrypt');
        // console.log(encryptPassword, 'with encrypt');
        // console.log(req.file.filename);

        const newUser = {
            name,
            email,
            password: encryptPassword,
            phone,
            address,
            photo: photo,
        }
        // console.log(photo);

        const result = await User.create(newUser)

        const responseUser = {
            id: result.id,
            name: result.name,
            email: result.email,
            password: result.password,
            phone: result.phone,
            address: result.address,
            photo: result.photo,
            role: result.role,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        };
        // console.log(result.parameters);

        res.status(201).json({ //status insert biasanya 201
            statusCode: 201,
            users: responseUser,
            massage: "User registered successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: "500",
            message: "Server error",
            error: error.message
        });
    }
}


// ======================================================================================
exports.login = async (req, res) => {

    try {
        const { email, password } = req.body
        const users = await User.findOne({ where: { email } })

        //untuk kondisi database tabel user- email ada atau engga
        if (!users) {
            return res.status(404).json({
                statusCode: 404,
                massage: 'email atau password false',
                testing: 'mail false'
            })
        }

        const isMatch = bcrypt.compareSync(password, users.password)

        //buat compare password di tabel user database sama/ada atau engga
        if (!isMatch) {
            return res.status(400).json({
                statusCode: 400,
                massage: `email atau password false`,
                testing: 'password false'
            })
        }


        const secretKey = process.env.SECRET_KEY /* || 'defaultSecretKey'; */
        const accessToken = jwt.sign({
            id: users.id,
            name: users.name,
            email: users.email,
            phone: users.phone
        }, secretKey, { expiresIn: '2h' })

        console.log("SECRET_KEY saat verifikasi token:", process.env.SECRET_KEY);


        res.status(201).json({ //status insert biasanya 201
            statusCode: 201,
            massage: "User login successfully",
            data: {
                id: users.id,
                name: users.name,
                email: users.email,
                phone: users.phone,
                token: accessToken
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: "500",
            message: "Server error",
            error: error.message
        });
    }

}


// ======================================================================================
const pathFile = 'http://localhost:8000/uploads/'


exports.getUser = async (req, res) => {

    try {
        const result = await User.findAll({
            attributes: {
                exclude: ['password']
            }
        })
        // console.log(result);


        const dataUser = result.map((item) => {
            const plainItem = item.get({ plain: true }); // Dapatkan objek biasa
            return { ...plainItem, photo: pathFile + plainItem.photo }; // Pastikan untuk mengakses plainItem.image
        });

        res.status(200).json({
            statusCode: 200,
            massage: "user get successfully",
            data: dataUser
        })

        // console.log(result);


    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: "500",
            message: "Server error",
            error: error.message
        });
    }
}


// ======================================================================================

exports.getUserById = async (req, res) => {
    const ID = parseInt(req.params.id)
    // const findMoviesById = movie.find((item) => item.id == ID)//output  object
    try {

        // const findId = await movies.findByPk(ID);
        // const findIdd = await User.findOne({ where: { id: ID } });

        const findUser = await User.findOne({
            where: { id: ID },
            include: [
                {
                    model: Booking, // Relasi dengan tabel Booking
                    as: 'bookings', // Sesuaikan dengan alias yang digunakan di model
                    include: [
                        {
                            model: Service, // Relasi dengan tabel Service di dalam Booking
                            as: 'service', // Alias untuk data service
                            attributes: ['id', 'name', 'description', 'price'] // Field yang diambil dari tabel service
                        }
                    ],
                    attributes: ['id', 'date', 'time', 'status', 'quantity', 'totalPrice'] // Field yang diambil dari tabel booking
                }
            ],
            attributes: ['id', 'name', 'email', 'phone', 'address', 'photo', 'role'] // Field yang diambil dari tabel user
        });

        if (findUser) {

            findUser.photo = pathFile + findUser.photo

            res.status(200).json({
                statusCode: 200,
                message: "Users get successfully",
                data: findUser
            });
        } else {
            res.status(404).json({
                statusCode: 404,
                message: `user id = ${ID} is not found (unsuccesfully)`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: "500",
            message: "Server error/ unsuccesfully",
            error: error.message
        });
    }
}


// ======================================================================================

exports.editUser = async (req, res) => {
    const ID = parseInt(req.params.id)
    try {
        const findUser = await User.findOne({ where: { id: ID } });
        if (!findUser) {
            res.status(404).json({
                statusCode: 404,
                message: `user id = ${ID} is not found (unsuccesfully)`,
            });
        }

        // update si data
        const editUser = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            photo: pathFile + req.file.filename,
            role: req.body.role
        }


        // Jika ada file baru (foto baru di-upload)
        if (req.file) {
            // Hapus foto lama jika ada
            if (findUser.photo) {
                const oldPhoto = findUser.photo.replace(pathFile, ''); // Menghapus path URL dari nama file
                const oldPhotoPath = `./uploads/${oldPhoto}`; // Lokasi file foto lama

                if (fs.existsSync(oldPhotoPath)) {
                    fs.unlinkSync(oldPhotoPath); // Hapus foto lama dari folder uploads
                }
            }

            // Update dengan foto baru
            editUser.photo = pathFile + req.file.filename;
        }

        // Lakukan update ke database
        const result = await User.update(editUser, { where: { id: ID } })
// console.log(result);

const updatedUser = await User.findOne({ where: { id: ID } });

if (updatedUser) {
    res.status(200).json({
        statusCode: 200,
        message: "Users updated successfully",
        data: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            photo: updatedUser.photo, // Sudah termasuk photo yang baru jika ada
            role: updatedUser.role
        }
    });
} else {
    res.status(404).json({
        statusCode: 404,
        message: `user id = ${ID} is not found (unsuccesfully)`,
    });
}
        // if (findUser) {

        //     findUser.photo = pathFile + findUser.photo

        //     res.status(200).json({
        //         statusCode: 200,
        //         message: "Users updated successfully",
        //         data: result
        //     });
        // } 


    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: "500",
            message: "Server error/ unsuccesfully",
            error: error.message
        });
    }
}


// ===================================================================================

exports.deleteUser = async (req, res) => {

    try {

        const ID = parseInt(req.params.id)
        const result = await User.findOne({ where: { id: ID } })
        // console.log(result);

        if (!result) {
            return res.status(404).json({
                statusCode: 404,
                message: `id ${ID} not found`
            })
        }

        await User.destroy({
            where: {
                id: ID,
            },
        });



        deleteFile(result.photo) // fungsi untuk delete file
        // console.log(result.photo , "result - photo");

        return res.status(200).json({
            statusCode: 200,
            message: "Users deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: "500",
            message: "Server error/ unsuccesfully",
            error: error.message
        });
    }
}

//pemgecekam jam booking sama kaya pengecekkan email.