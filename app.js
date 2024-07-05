const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const path = require('path');

const app = express();


const colors = require("colors");
const morgan = require("morgan");
const cors = require('cors')
const userRouter = require("./routes/user-routes");
const postRouter = require("./routes/post-routes");
require("./connection/db");
require('dotenv').config();
app.use(cors())




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));   

// app.get('/', (req, res) => {
//   res.render('verificationPage');
// });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"));
const PORT = process.env.PORT || 9000;


app.use("/user", userRouter);
app.use("/post", postRouter);




app.get("/", (req, res) => {
  console.log(`Server is running at :${PORT} `.bgBlue);
});
app.listen(PORT, () => {
  console.log(` Server Connected !!! PORT:${PORT} `.black.bold.underline.bgRed);
});




