const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv").config();
const cookieparser = require("cookie-parser");

const connectMongoDb = require("./db/connectMongodb");

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(
  cors({
    origin: "http://localhost:5173", // İstemci kökeni
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use((req, res, next) => {
  console.log("Request Headers:", req.headers);
  next();
});

const userRoutes = require("./routes/userRoutes");
app.use("/api/User", userRoutes);

const userOrganisationRoutes = require("./routes/userOrganisationRoutes");
app.use("/api/UserOrganisation", userOrganisationRoutes);

const organisationRoutes = require("./routes/organisationRoutes");
app.use("/api/Organisation", organisationRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/Auth", authRoutes);

const relayRoutes = require("./routes/relayRoutes");
app.use("/api/Relay", relayRoutes);

const sensorRoutes = require("./routes/sensorRoutes");
app.use("/api/Sensor", sensorRoutes);

const deviceTypeRoutes = require("./routes/deviceTypeRoutes");
app.use("/api/DeviceType", deviceTypeRoutes);

const boxRoutes = require("./routes/boxRoutes");
app.use("/api/Box", boxRoutes);

const userDeviceRoutes = require("./routes/userDeviceRoutes");
app.use("/api/UserDevice", userDeviceRoutes);

const deviceRoutes = require("./routes/deviceRoutes");
app.use("/api/Device", deviceRoutes);

const userOperationClaimRoutes = require("./routes/userOperationClaimRoutes");
app.use("/api/UserOperationClaim", userOperationClaimRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is running on ${port}`);
  connectMongoDb();
});
