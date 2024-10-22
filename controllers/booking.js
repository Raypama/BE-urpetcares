const { Service, Booking, User } = require('../models')


exports.getBooking = async (req, res) => {

    try {
        const allBookings = await Booking.findAll({
            include: [
                {
                    model: User, // Relasi tabel User
                    as: 'user', // Sesuaikan alias yang dipakai di model
                    attributes: ['id', 'name', 'email', 'phone', 'address', 'photo'] // property yang diambil dari tabel user
                },
                {
                    model: Service,
                    as: 'service',
                    attributes: ['id', 'name', 'description', 'price']
                }
            ],
            attributes: ['id', 'date', 'time', 'status', 'quantity', 'totalPrice'] // property yang diambil dari tabel booking
        });

        res.status(200).json({
            statusCode: 200,
            message: "Booking retrieved successfully",
            data: allBookings
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: "500",
            message: "Server error",
            error: error.message
        });
    }
}


exports.createBooking = async (req, res) => {

    try {
        const { serviceId, date, time, quantity } = req.body;

        // Cari service berdasarkan serviceId untuk mendapatkan price
        const service = await Service.findOne({
            where: { id: serviceId }
        });

        if (!service) {
            return res.status(404).json({
                statusCode: 404,
                message: "Service not found",
            });
        }

        // Hitung totalPrice
        const totalPrice = quantity * service.price;

        // Membuat booking baru dengan format tanggal 'DD-MM-YYYY' tanpa mengubahnya
        const createBooking = {
            userId: req.user.id,
            serviceId,
            date, // Tanggal tetap dalam format 'DD-MM-YYYY'
            time, // Waktu dalam format 'HH:mm'
            quantity,
            totalPrice,
            status: "pending"
        };

        // Simpan booking
        const result = await Booking.create(createBooking);

        // Kirim respons dengan tanggal tetap dalam format 'DD-MM-YYYY'
        res.status(200).json({
            statusCode: 200,
            message: "Booking retrieved successfully",
            data: {
                id: result.id,
                userId: result.userId,
                serviceId: result.serviceId,
                date: result.date,
                time: result.time,
                quantity: result.quantity,
                totalPrice: result.totalPrice,
                status: result.status
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: "500",
            message: "Server error",
            error: error.message
        });
    }
}



exports.getBookingById = async (req, res) => {
    const ID = parseInt(req.params.id)
    try {


        const allBookings = await Booking.findOne({
            where: { id: ID },
            include: [
                {
                    model: User, // Relasi tabel User
                    as: 'user', // Sesuaikan alias yang dipakai di model
                    attributes: ['id', 'name', 'email', 'phone', 'address', 'photo'] // property yang diambil dari tabel user
                },
                {
                    model: Service,
                    as: 'service',
                    attributes: ['id', 'name', 'description', 'price']
                }
            ],
            attributes: ['id', 'date', 'time', 'status', 'quantity', 'totalPrice'] // property yang diambil dari tabel booking
        });

        if (allBookings) {

            res.status(200).json({
                statusCode: 200,
                message: "booking get successfully",
                data: allBookings
            });
        } else {
            res.status(404).json({
                statusCode: 404,
                message: `booking id = ${ID} is not found (unsuccesfully)`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: "500",
            message: "Server error",
            error: error.message
        });
    }
}






