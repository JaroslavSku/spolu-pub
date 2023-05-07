## Description

This repository was created as a test backend for the website https://registr-dl.vercel.app/ .

## Installation

You need to have a mongodb service running on the port: mongodb://localhost:27017/.

You need to create an .env file with all variables used in this app.

RECAPTCHA_SECRET="" # recaptcha secret
JWT_SECRET="1234" # jwt secret
FE_URL_SPOLUBYDLENI="https://www.something.cz/" # FE address
EMAIL_USER="info@gmail.com" # email
EMAIL_PASS="somepassword" # password

Email user and password needs to with 2 step authentication and preferably on google.

```bash
$ npm install
```

## Running the app

Creating user and login requires email confirmation first.

```bash
# dev or production
$ npm start
```

## Support

Nest is an MIT-licensed open source project.
