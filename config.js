require('dotenv').config()
const JWT_USER_PASSWORD =process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD =process.env.JWT_ADMIN_PASSWORD;
const PORT=process.env.PORT;


module.exports={
    JWT_USER_PASSWORD,
    JWT_ADMIN_PASSWORD,
    PORT
}