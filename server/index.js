const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const userRoute = require("./Routes/UserRoute");
const roomRoute = require("./Routes/RoomRoute")
const shelfRoute = require("./Routes/ShelfRoute")
const itemRoute = require("./Routes/ItemRoute")
const projectRoute = require("./Routes/ProjectRoute")
const depositionRoute = require("./Routes/DepositionRoute")
const rentContractRoute = require("./Routes/RentContractRoute")
const historyContractRoute = require("./Routes/HistoryContractRoute")
const buildingRoute = require("./Routes/BuildingRoute")
const multer = require('multer');
const path = require('path'),
    bodyParser = require("body-parser"),
    swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUi = require("swagger-ui-express");
const config = require('config');


const { MONGO_URL, PORT, IMS_PORT, IMS_HOST } = process.env;

const port = IMS_PORT || config.get('server.port')
const host = IMS_HOST || config.get('server.host')
const dbConnectionString = MONGO_URL || config.get('server.dbConnectionString')

mongoose
    .connect(dbConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB is  connected successfully"))
    .catch((err) => console.error(err));

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "LogRocket Express API with Swagger",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "LogRocket",
                url: "https://logrocket.com",
                email: "info@email.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3050",
            },
        ],
    },
    apis: ["./Routes/*.js"],
};




const specs = swaggerJsdoc(options);
app.use(
    "/inventory-management-server/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

app.listen(port, host, (err) => {
    console.log(`Server is listening on ip: ${host} port ${port}`);

});

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(cookieParser());

app.use(express.json());

app.use("/inventory-management-server/", authRoute);

app.use("/inventory-management-server/user", userRoute)

app.use("/inventory-management-server/room", roomRoute)

app.use("/inventory-management-server/building", buildingRoute)

app.use("/inventory-management-server/shelf", shelfRoute)

app.use("/inventory-management-server/item", itemRoute)

app.use("/inventory-management-server/rentContract", rentContractRoute)

app.use("/inventory-management-server/deposition", depositionRoute)

app.use("/inventory-management-server/historyContract", historyContractRoute)

app.use("/inventory-management-server/project", projectRoute)
// Serve a single uploaded image based on ID
app.get('/inventory-management-server/image/:imgUrl', (req, res) => {
    const imgUrl = req.params.imgUrl; // Get the ID from the URL parameter
    console.log(imgUrl)
    res.sendFile(__dirname + "/" + imgUrl);
});

