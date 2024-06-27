export function preconditionFailedError(errorString, response, errorCode) {
    response.status(errorCode)
        .json({
            message: errorString
        })
}

