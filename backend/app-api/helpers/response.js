module.exports = (res, data, message = '') => {
    res.status(200).json({
        error: false,
        code: 200,
        message: message,
        data: data
    });
};
