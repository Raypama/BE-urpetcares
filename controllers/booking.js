const { where } = require("sequelize");
const { Service, Booking, User } = require("../models");

// ======================================================================================

exports.getBooking = async (req, res) => {
  try {
    const allBookings = await Booking.findAll({
      include: [
        {
          model: User, // Relasi tabel User
          as: "user", // Sesuaikan alias yang dipakai di model
          attributes: ["id", "name", "email", "phone", "address", "photo"], // property yang diambil dari tabel user
        },
        {
          model: Service,
          as: "service",
          attributes: ["id", "name", "description", "price"],
        },
      ],
      attributes: [
        "id",
        "date",
        "time",
        "status",
        "quantity",
        "totalPrice",
        "userId",
      ], // property yang diambil dari tabel booking
    });

    res.status(200).json({
      statusCode: 200,
      message: "Booking retrieved successfully",
      data: allBookings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: "500",
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getBookingByUser = async (req, res) => {
  const user = req.user;
  console.log(user);

  try {
    const allBookings = await Booking.findAll({
      where: { userId: user.id },

      include: [
        {
          model: User, // Relasi tabel User
          as: "user", // Sesuaikan alias yang dipakai di model
          attributes: ["id", "name", "email", "phone", "address", "photo"], // property yang diambil dari tabel user
        },
        {
          model: Service,
          as: "service",
          attributes: ["id", "name", "description", "price"],
        },
      ],
      attributes: [
        "id",
        "date",
        "time",
        "status",
        "quantity",
        "totalPrice",
        "userId",
      ], // property yang diambil dari tabel booking
    });

    res.status(200).json({
      statusCode: 200,
      message: "Booking retrieved successfully",
      data: allBookings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: "500",
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================================================

exports.createBooking = async (req, res) => {
  try {
    const { serviceId, date, time, quantity } = req.body;

    // Cari service berdasarkan serviceId untuk mendapatkan price
    const service = await Service.findOne({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({
        statusCode: 404,
        message: "Service not found",
      });
    }
    const checkBooking = await Booking.findOne({
      where: { date: date, time: time },
    });

    console.log(checkBooking);
    if (checkBooking) {
      return res.status(404).json({
        statusCode: 404,
        message: "Booking already exist",
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
      status: "pending",
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
        status: result.status,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: "500",
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================================================

exports.getBookingById = async (req, res) => {
  const ID = parseInt(req.params.id);
  try {
    const allBookings = await Booking.findOne({
      where: { id: ID },
      include: [
        {
          model: User, // Relasi tabel User
          as: "user", // Sesuaikan alias yang dipakai di model
          attributes: ["id", "name", "email", "phone", "address", "photo"], // property yang diambil dari tabel user
        },
        {
          model: Service,
          as: "service",
          attributes: ["id", "name", "description", "price"],
        },
      ],
      attributes: ["id", "date", "time", "status", "quantity", "totalPrice"], // property yang diambil dari tabel booking
    });

    if (allBookings) {
      res.status(200).json({
        statusCode: 200,
        message: "booking get successfully",
        data: allBookings,
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
      error: error.message,
    });
  }
};

// ======================================================================================

exports.updateBooking = async (req, res) => {
  const ID = parseInt(req.params.id);

  try {
    const { status, quantity, serviceId, date, time } = req.body;

    // Cari booking berdasarkan ID
    const findBooking = await Booking.findOne({ where: { id: ID } });
    if (!findBooking) {
      return res.status(404).json({
        statusCode: 404,
        message: `Booking id = ${ID} is not found (unsuccessfully)`,
      });
    }

    // Cari service untuk mendapatkan harga
    const service = await Service.findOne({ where: { id: serviceId } });
    if (!service) {
      return res.status(404).json({
        statusCode: 404,
        message: `Service id = ${serviceId} is not found`,
      });
    }

    // Hitung totalPrice
    const totalPrice = parseInt(quantity) * service.price;

    // Update data di database
    await Booking.update(
      { status, quantity, date, time, totalPrice, serviceId },
      { where: { id: ID } }
    );

    // Mengambil data booking yang di-update
    const updatedBooking = await Booking.findOne({ where: { id: ID } });

    res.status(200).json({
      statusCode: 200,
      message: "Booking updated successfully",
      data: {
        id: updatedBooking.id,
        date: updatedBooking.date,
        time: updatedBooking.time,
        status: updatedBooking.status,
        quantity: updatedBooking.quantity,
        totalPrice: updatedBooking.totalPrice,
        userId: updatedBooking.userId,
        serviceId: updatedBooking.serviceId,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: "500",
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================================================

exports.deleteBooking = async (req, res) => {
  const ID = parseInt(req.params.id);
  try {
    const result = await Booking.findOne({ where: { id: ID } });
    // console.log(result);

    if (!result) {
      return res.status(404).json({
        statusCode: 404,
        message: `id ${ID} not found`,
      });
    }

    await Booking.destroy({
      where: {
        id: ID,
      },
    });

    return res.status(200).json({
      statusCode: 200,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: "500",
      message: "Server error/ unsuccesfully",
      error: error.message,
    });
  }
};

// transaction.status === 'pending'
// ? booking.status = upcoming
// : transaction.status === 'ongoing'
// ? booking.status = 'ongoing'
// : transaction.status === 'success'
// ? booking.status = 'complete'
// : transaction.status === 'failed'
// ? booking.status = 'cancelled'
// : console.log('status null')
