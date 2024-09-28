const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const router = express.Router();
const cors = require("cors");
const PORT = process.env.PORT || 4300; 
 
const { default: mongoose } = require("mongoose");
require("dotenv").config();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const documentation = router.get("/", (req, res) => {
  res.send("API Documentation page");
});

app.use("/", documentation); 

const URI = process.env.MONGODB_URL;  

mongoose.connect( 
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  },
  (err) => {
    if (err) throw err;
    console.log("Database Connected");
  }
);

app.listen(PORT, () => {
  console.log(`Running on   http://localhost:${PORT}`);
});
