/**
 * Trả về response thành công
 */
function success(res, message = 'Thành công', data = null) {
    return res.status(200).json({
        status: 200,
        code: 'SUCCESS',
        message,
        data
    });
}

/**
 * Trả về response lỗi
 */
function error(res, {
    message = 'Có lỗi xảy ra',
    code,
    status = 400,
    data = null,
    ...extra
}) {
    return res.status(status).json({
        status,
        code,
        message,
        data,
        ...extra
    });
}

module.exports = {
    success,
    error
};
