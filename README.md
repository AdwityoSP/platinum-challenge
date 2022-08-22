# platinum-challenge
Langkah penggunaan :
1. inisialisasi ENV
daftar ENV : 

port=NUM

(di config)
DB_USER=String
DB_PASS=String
DB_NAME=String
DB_HOST=String
DB_DIALECT=String

CLOUDINARY_CLOUD_NAME=String
CLOUDINARY_API_KEY=NUM
CLOUDINARY_API_SECRET=String

SECRET_JWT=String

SMTP_USER=Gmail(String)
SMTP_PASS=Password(String)

2. instalasi =
npm install express bcrypt cloudinary dotenv ejs jest jsonwebtoken multer passport passport-jwt pg sequelize supertest socket.io nodemailer nodemailer-express-handlebars nodemon 
nodemon->(optional)

3. buat database
sequelize db:create
sequelize db:migrate
npm:start 
masukan collection dalam postman,
tambah data melalui postman

4. daftar API :
a. User=
-register
-login
-auth (restrict)
-showall
-getbyID
-update (restrict)
-delete (restrict)
-add (restrict)

b.Item=
-create (restrict), image
-showall (restrict)
-getbyID (restrict)
-update (restrict)
-deletebyID (restrict)

c. Order=
-showall (restrict)
-getbyID (restrict)
-update (restrict)
-deletebyID (restrict)

d. Transcation=
-create (restrict)
-showall (restrict)
-getbyID (restrict)
-deletebyID (restrict)
