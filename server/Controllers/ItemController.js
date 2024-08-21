const User = require("../Models/UserModel");
const Item = require("../Models/ItemModel");
const Building = require("../Models/BuildingModel");
const Room = require("../Models/RoomModel")
const Shelf = require("../Models/ShelfModel")
const Deposition = require("../Models/DepositionModel")
const RentContract = require("../Models/RentContract")
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");
const path = require("path");
const multer = require('multer');
const fs = require('fs');
const { formidable } = require("formidable");

const storage = multer.diskStorage({
    destination: 'uploads/', // Set the destination folder for uploads
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg'); // Add timestamp and random suffix to filename
    }
});

const upload = multer({ storage });

module.exports.CreateItem = async (req, res, next) => {

    try {

        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            console.log('fields: ', fields);
            console.log('imageFile: ', files.image[0]);

            if(!fields.name[0]){
                return res.status(201).json({ message: "Item Name wasnt provided", success: false });
            }

            if(!fields.description[0]){
                return res.status(201).json({ message: "Item Description wasnt provided", success: false });
            }
            // Read the JPG file as a binary buffer
            await fs.readFile(files.image[0].filepath, async (err, data) => {
                if (err) throw err;

                // Write the binary buffer to a new file
                await fs.writeFile( files.image[0].newFilename + ".jpg", data, (err) => {
                    if (err) throw err;
                    console.log('JPG file has been stored successfully.');
                });
            });

            // Create the item in the database
            const newItem = await Item.create({ name: fields.name[0], description: fields.description[0], imageUrl: files.image[0].newFilename + ".jpg" });

            res.status(201).json({ message: "Item was created", success: true, item: newItem });
        });


        // Call next() if necessary, but in this case, it's not needed since the request is handled completely here
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

module.exports.PrintItem = async (req, res, next) => {

    try {
        console.log("csohcisbvizoebsvbislabvabi")
        console.log(req.body)
        const { itemId } = req.body;

        console.log(itemId)
        // Create the item in the database
        console.log("Print ENdpoint is being called")
        const item = await Item.findById(itemId);
        console.log(item)
        if(item){
            const thing = await fetch("http://10.0.0.104:5000/print/" + itemId + "/" + item.name, {
                method: "POST",
                body: "{}",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            console.log(thing)
            res.status(201).json({ message: "Item was printed", success: true });
        }

        // Call next() if necessary, but in this case, it's not needed since the request is handled completely here
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

module.exports.UpdateItem = async (req, res, next) => {

    try {

        const { itemId, name, description } = req.body;
        
        const item = await Item.findById(itemId);
        if(item){
            item.name = name
            item.description = description
            await item.save()
            res
                .status(201)
                .json({ message: "Item was being updated", success: true, item : item });

            next();
        }else {
            res
                .status(201)
                .json({ message: "Error while Item was being updated", success: false });
        }



    } catch (error) {

        console.error(error);

    }
};

module.exports.DeleteItem = async (req, res, next) => {

    try {

        const { itemId } = req.body;


        const item = await Item.findById(itemId);
        if(!item){
            return res
                .status(201)
                .json({ message: "Item not found", success: false });
        }

        const contract = await RentContract.findOne({itemId: itemId})
        console.log(contract)
        if(contract){
            return res
                .status(201)
                .json({ message: "Item has Rentcontract so it cant be deleted", success: false });
        }


        fs.unlink(item.imageUrl, async (err) => {
            if (err) {
                console.error(err);
                await Item.findByIdAndDelete(itemId);
                return res.status(200).json({ message: 'Error deleting image, item was deleted', success: true });
            }
            console.log('Image file deleted successfully.');

            // Delete the item from the database
            await Item.findByIdAndDelete(itemId);

            res.status(200).json({ message: "Item and associated image deleted successfully", success: true });
        });

    } catch (error) {

        console.error(error);

    }
};

module.exports.UpdateItemImg = async (req, res, next) => {

    try {

        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            console.log('fields: ', fields);
            console.log('imageFile: ', files.image[0]);

            if(!fields.itemId[0]){
                return res.status(201).json({ message: "ItemId wasnt provided", success: false });
            }

            const item = await Item.findOne({_id : fields.itemId[0]})

            fs.unlink(item.imageUrl, async (err) => {
                if (err) {
                    console.error(err);
                    console.log("img couldnt be deleted")
                }
                console.log('Image file deleted successfully.');

            });

            // Read the JPG file as a binary buffer
            await fs.readFile(files.image[0].filepath, async (err, data) => {
                if (err) throw err;

                // Write the binary buffer to a new file
                await fs.writeFile( files.image[0].newFilename + ".jpg", data, (err) => {
                    if (err) throw err;
                    console.log('JPG file has been stored successfully.');
                });

                item["imageUrl"] = files.image[0].newFilename + ".jpg"
                await item.save()
                return res.status(200).json({ message: "If existing old img deleted, new img saved and item imgurl updated", success: true });

            });

        });


        // Call next() if necessary, but in this case, it's not needed since the request is handled completely here
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};


module.exports.GetItems = async (req, res, next) => {

    try {

        const items = await Item.find()

        let result = []

        for(const item in items){
            let itemId = items[item]._id
            const deposition = await Deposition.findOne({itemId})
            let depositionString = ""
            if(deposition){

                let shelfId = deposition.shelfId

                const shelf = await Shelf.findById(shelfId)

                const room = await Room.findById(shelf.roomId)

                const building = await Building.findById(room.buildingId)

                depositionString = "Buidling: " + building.name + " | Room: " + room.name + " | Shelf: " + shelf.name


            }else{
                depositionString = "Not deposited"
            }

            let rentedOut = false

            const rentedOutTemp = await RentContract.findOne({itemId})
            if(rentedOutTemp){
                rentedOut = true
            }

            result.push({
                _id : items[item]._id,
                name: items[item].name,
                description : items[item].description,
                createdAt: items[item].createdAt,
                imageUrl: items[item].imageUrl,
                deposition: depositionString,
                rentedOut : rentedOut
            })
        }

        if(items){
            res
                .status(201)
                .json({ message: "Items found", success: true, items : result });
        } else{
            res
                .status(201)
                .json({ message: "Items not found", success: false });
        }
        
        next();

    } catch (error) {

        console.error(error);

    }

};
