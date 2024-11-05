const { User, Booking, Service, Transaction } = require('../models')


// ======================================================================================

exports.createTransaction = async (req, res) => {


    try {
        const { bookingId, payment } = req.body
        const receipts = req.file ? req.file.filename : null;        
       console.log(receipts);
       
        
       const newTransaction = {
        bookingId,
        payment,
        receipt: receipts,
        transactionDate: new Date(),
        status: "pending"
    };

        const result = await Transaction.create(newTransaction)

        const response = {
            id : result.id,
            bookingId: result.bookingId,
            payment: result.payment,
            receipt: process.env.PATH_URL_IMG + result.receipt,
            transactionDate: result.transactionDate,
            status: result.status
        };
        // console.log(result.parameters);

        res.status(201).json({ //status insert biasanya 201
            statusCode: 201,
            data: response
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


const pathFile = process.env.PATH_URL_IMG

// ======================================================================================
exports.getTransaction = async (req, res) => {

    try {
        const result = await Transaction.findAll({
            include: [
                {
                    model: Booking,
                    as: 'booking',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'name', 'email', 'phone', 'address', 'photo'],
                        },
                        {
                            model: Service,
                            as: 'service',
                            attributes: ['id', 'name', 'description', 'price'],
                        }
                    ],
                    attributes: ['id', 'date', 'status', 'quantity', 'totalPrice'],
                }
            ],
            attributes: ['id', 'payment', 'receipt', 'transactionDate', 'status'],
        });

        const dataTransaction = result.map((item) => {
            const plainItem = item.get({ plain: true }); // Dapatkan objek biasa
            const total = plainItem.booking ? plainItem.booking.totalPrice : 0    
            const response = {
                id : plainItem.id,
                payment : plainItem.payment,
                receipt : plainItem.receipt,
                transactionDate : plainItem.transactionDate,
                status : plainItem.status,
                total : total,
                booking : plainItem.booking,
            }
            // return { ...plainItem, receipt: pathFile + plainItem.receipt , total  }; // Pastikan untuk mengakses plainItem.image
            return response
        });
        
        res.status(200).json({
            statusCode: 200,
            massage: "Transactions get successfully",
            data: dataTransaction
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

exports.getTransactionById = async (req, res) => {
    const ID = parseInt(req.params.id)
        try {
        const result = await Transaction.findOne({
            where: { id: ID },
            include: [
                {
                    model: Booking,
                    as: 'booking',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'name', 'email', 'phone', 'address', 'photo'],
                        },
                        {
                            model: Service,
                            as: 'service',
                            attributes: ['id', 'name', 'description', 'price'],
                        }
                    ],
                    attributes: ['id', 'date', 'status', 'quantity', 'totalPrice'],
                }
            ],
            attributes: ['id', 'payment', 'receipt', 'transactionDate', 'status'],
        });

        if (!result) {
            return res.status(404).json({
                statusCode: 404,
                message: "Transaction not found",
            });
        }

        const plainItem = result.get({ plain: true }); // Dapatkan objek biasa
        const total = plainItem.booking ? plainItem.booking.totalPrice : 0;
        const response = {
            id: plainItem.id,
            payment: plainItem.payment,
            receipt: plainItem.receipt,
            transactionDate: plainItem.transactionDate,
            status: plainItem.status,
            total: total,
            booking: plainItem.booking,
        };
        
        res.status(200).json({
            statusCode: 200,
            massage: "Transactions get successfully",
            data: response
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

exports.updateTransaction = async (req, res) => {
    
    const ID = parseInt(req.params.id);
    try {
        const findTransaction = await Transaction.findOne({ where: { id: ID } });
        if (!findTransaction) {
            return res.status(404).json({
                statusCode: 404,
                message: `Transaction id = ${ID} is not found (unsuccessfully)`,
            });
        }

        // Jika ada file baru (receipt baru di-upload), hapus receipt lama terlebih dahulu
        if (req.file) {
            if (findTransaction.receipt) {
                console.log("Deleting old file:", findTransaction.receipt);  // Tambahkan log untuk pengecekan
                deleteFile(findTransaction.receipt);  // Hapus receipt lama
            }
            editTransaction.receipt = req.file.filename;
        }

        // Update data transaksi dengan receipt baru (atau tetap gunakan receipt lama jika tidak ada file baru)
        const editTransaction = {
            bookingId: req.body.bookingId,
            payment: req.body.payment,
            receipt: req.file ? req.file.filename : findTransaction.receipt,  // Gunakan nama file saja
            transactionDate: req.body.transactionDate,
            status: req.body.status
        };

        // Lakukan update ke database
        await Transaction.update(editTransaction, { where: { id: ID } });

        const updatedTransaction = await Transaction.findOne({ where: { id: ID } });

        if (editTransaction.status === "success") {
            const bookingId = updatedTransaction.bookingId;
            const findBooking = await Booking.findOne({ where: { id: bookingId } });
            if (findBooking) {
                await Booking.update({ status: "upcoming" }, { where: { id: bookingId } });
            }
        }
        
        if (editTransaction.status === "failed") {
            const bookingId = updatedTransaction.bookingId;
            const findBooking = await Booking.findOne({ where: { id: bookingId } });
            if (findBooking) {
                await Booking.update({ status: "cancelled" }, { where: { id: bookingId } });
            }
        }

        res.status(200).json({
            statusCode: 200,
            message: "Transactions updated successfully",
            bookingId: updatedTransaction.bookingId,
            payment: updatedTransaction.payment,
            receipt: updatedTransaction.receipt,  // Sudah termasuk receipt yang baru jika ada
            transactionDate: updatedTransaction.transactionDate,
            status: updatedTransaction.status
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            message: "An error occurred while updating the transaction",
        });
    }
};
  


// update Transaction 
// and update Booking by id yah jangan lupa dari bookinId