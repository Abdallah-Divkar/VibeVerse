// Function to handle errors during requests
function handleError(req, res, next) {
    res.status(500).json({
        error: 'An unexpected error occurred, please try again later.'
    });
}

// Function to extract and log error messages
function getErrorMessage(err) {
    console.error(err); 
    return err.message || 'An error occurred, please try again later.'; // Default message if none exists
}

// Export functions to be used in other controllers
module.exports = {
    handleError: handleError,
    getErrorMessage: getErrorMessage
};
