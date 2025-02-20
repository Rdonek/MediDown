export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleError = (error, res) => {
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            error: error.message
        });
    }

    console.error('ERROR 💥', error);
    return res.status(500).json({
        status: 'error',
        error: 'Bir şeyler yanlış gitti!'
    });
}; 