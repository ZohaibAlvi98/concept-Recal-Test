async function customErrorHandler(errorMessage) {
    let statusCode

    switch (true) {
      case errorMessage.includes('Access') && (errorMessage.includes('expired') || errorMessage.includes('revoked')):
        statusCode = 405; // Bad Request
        break;
        case errorMessage.includes('Refresh') && (errorMessage.includes('expired') || errorMessage.includes('revoked')):
        statusCode = 406; // Not Found
        break;
        case errorMessage.includes('block'):
        statusCode = 410;
        case errorMessage.includes('not confirmed'):
        statusCode = 401;
        case errorMessage.includes('energy low'):
        statusCode = 407;
        break;
      default:
        statusCode = 400; // Default to Internal Server Error
        break;
    }

    return statusCode
}

exports.customErrorHandler = customErrorHandler
