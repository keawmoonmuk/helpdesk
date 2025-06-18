const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const swaggerDocs = require('./swagger.json');
const swaggerUi = require('swagger-ui-express');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;  // ใช้ port 5000 หรือ port ที่กำหนดใน .env
const routes = require('./routes');

//use middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// console.log("JWT_SECRET app server:", process.env.JWT_SECRET);
// console.log("PORT:", process.env.PORT);
//use swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//use api routes
app.use('/api', routes);

app.listen(port, () => {
   console.log(`Server started at http://localhost:${port}`);
});
