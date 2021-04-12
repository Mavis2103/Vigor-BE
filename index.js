import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import postsRoutes from "./routes/postsRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// app.get('/', (req, res) => {
//     res.send('Hello, this is node 🎉');
// })

const CONNECTION_URL =
    "mongodb+srv://Khale:Khale123@cluster0.m08om.mongodb.net/Vigor?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
    .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>
        app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
    )
    .catch((error) => console.log(error.message));
mongoose.set("useFindAndModify", false);

// User routes
app.use("/", postsRoutes);