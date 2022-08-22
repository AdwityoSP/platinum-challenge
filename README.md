# platinum-challenge
Langkah penggunaan :

1. inisialisasi ENV

daftar ENV : 

	<!-- PORT_SERVER -->
  	PORT=3000
	
    <!-- DATABASE_CONFIG -->
    DB_USER=your_db_user
    DB_PASS=your_db_pass
    DB_NAME=your_db_name
    DB_HOST=your_db_host
    DB_DIALECT=your_db_dialect

    <!-- CLOUDINARY_CONFIG -->
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_cloud_api_key
    CLOUDINARY_API_SECRET=your_cloud_api_secret

    <!-- SECRETKET_JWT -->
    SECRETKEY_JWT=your_secretJwt_password

    <!-- SMTP_GMAIL -->
    SMTP_USER=your_email
    SMTP_PASS=your_password_app

2. instalasi :

    - npm install express bcrypt cloudinary dotenv ejs jest jsonwebtoken multer passport passport-jwt pg sequelize supertest socket.io nodemailer nodemailer-express-handlebars nodemon 

    - nodemon->(optional)

3. buat database :

    - sequelize db:create
    - sequelize db:migrate
    - npm:start 
    - masukan collection dalam postman,
    - tambah data melalui postman

4. daftar API :

a. User:

    -register
    -login
    -auth (restrict)
    -showall
    -getbyID
    -update (restrict)
    -delete (restrict)
    -add (restrict)

b.Item:

    -create (restrict, restricAdmin), image
    -showall (restrict)
    -getbyID (restrict)
    -update (restrict, restricAdmin)
    -deletebyID (restrict, restricAdmin)


c. Order:

    -showall (restrict, restricAdmin)
    -getbyID (restrict)
    -update (restrict, restricAdmin)
    -deletebyID (restrict)


d. Transcation:

    -create (restrict)
    -showall (restrict, restricAdmin)
    -getbyID (restrict)
    -deletebyID (restrict, restricAdmin)