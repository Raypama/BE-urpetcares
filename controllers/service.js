const { Service } = require('../models')




exports.insertService = async (req, res) => {


    try {
        const { name, description, price } = req.body

        const addService = {
            name,
            description,
            price
        }
        // console.log(photo);

        const result = await Service.create(addService)


        // console.log(result.parameters);

        res.status(201).json({ //status insert biasanya 201
            statusCode: 201,
            massage: "Service created successfully",
            users: result
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

exports.getService = async (req, res) => {
    try {
        //buat ambil semua data kita tetep pake find all
        const allServices = await Service.findAll();

        if (allServices.length > 0) {
            res.status(200).json({
                statusCode: 200,
                message: "Service get successfully",
                data: allServices
            });
        } else { //cmn tambahan aja kl ini kl semisal data ny kosong
            res.status(404).json({
                statusCode: 404,
                message: "No services found/ maintenance service",
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



exports.getServiceById = async (req, res) => {
    const ID = parseInt(req.params.id)

    try {
        // const { name, description, price } = req.body
        const findService = await Service.findOne({ where: { id: ID } });
        if (!findService) {
            return res.status(404).json({
                statusCode: 404,
                message: `user id = ${ID} is not found (unsuccesfully)`,
            });
        } else {

            res.status(201).json({ //status insert biasanya 201
                statusCode: 201,
                massage: "Service retrieved successfully",
                users: findService
            })
        }


        // const addService = {
        //     name,
        //     description,
        //     price
        // }
        // console.log(photo);

        // const result = await Service.create(addService)


        // console.log(result.parameters);


    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: "500",
            message: "Server error",
            error: error.message
        });
    }
}

exports.updateService = async (req, res) => {
    const ID = parseInt(req.params.id);

    try {
        const { name, description, price } = req.body;

        // Cari service berdasarkan ID
        const findService = await Service.findOne({ where: { id: ID } });
        if (!findService) {
            return res.status(404).json({
                statusCode: 404,
                message: `Service id = ${ID} is not found (unsuccessfully)`,
            });
        }

        // Update data di database
        await Service.update(
            { name, description, price },
            { where: { id: ID } }
        );

        // Mengembalikan data yang di-update
        const updatedService = await Service.findOne({ where: { id: ID } });

        res.status(200).json({
            statusCode: 200, // Status untuk update adalah 200
            message: "Service updated successfully",
            data: updatedService
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


exports.deleteService = async (req, res) => {

    const ID = parseInt(req.params.id)
    try {
        const result = await Service.findOne({ where: { id: ID } })
        // console.log(result);

        if (!result) {
            return res.status(404).json({
                statusCode: 404,
                message: `id ${ID} not found`
            })
        }

        await Service.destroy({
            where: {
                id: ID,
            },
        });


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