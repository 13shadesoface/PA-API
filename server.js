var express = require('express');
var server = express();

var bodyParser = require('body-parser');
server.use(bodyParser.json());

var userManagement = require('./routes/userManagement');

const {internalError,badRequestError} = require('./errorHandler/errors');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Fair Repack API',
    version: '1.0.0',
  }
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * GET and POST, see ./routes/userManagement
 */
server.use('/userManagement', userManagement);

/**
 * Route used to check server health, answers with a 'ok' message
 */
server.get('/health', (req, res) => {
    res.status(200).send('ok')
})

/**
 * Error handling: 400 bad request ; 500 server error
 * other errors are passed on to express
 */
server.use((err,req,res,next) => {
    console.error(err);
    if (err instanceof badRequestError) {
        res.status(err.httpCode).json({'errorTypeCode':err.specificCode,'message':err.message});
    }else if (err instanceof internalError) { 
        res.status(err.httpCode).json({'errorTypeCode':err.httpCode,'message':err.message});
    }else{
        next(err);
    }
})

/**
 * Uncaught exceptions are fatal programming errors
 * logs the error, closes the server after 1s leaving time for other client requests to be handled
 */
process.on('uncaughtException', err => {
    console.log(`Uncaught Exception: ${err.message}`)
    server.close(() => {
        setTimeout(() => {
            process.exit(1)
          }, 1000).unref()
    })
})

/**
 * Unhandled Promise 
 */
process.on('unhandledRejection', err => {
    console.log(`Unhandled Rejection: ${err.message}`)
    server.close(() => {
        setTimeout(() => {
            process.exit(1)
        }, 1000).unref()
    })
})

process.on('SIGTERM', signal => {
    console.log(`Process ${process.pid} has been terminated`)
    process.exit(0)
  })

process.on('SIGINT', signal => {
    console.log(`Process ${process.pid} has been interrupted`)
    process.exit(0)
})

const PORT = process.env.PORT || 5000;
server = server.listen(PORT, () => console.log(`Server running on port ${PORT}`));