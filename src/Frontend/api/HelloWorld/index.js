module.exports = async function (context, req) {

    try {
        // Construct response
        const responseJSON = {
            "message": "Hello there!"
        }

        context.res = {
            status: 200,
            body: responseJSON,
            contentType: 'application/json'
        };

        context.log('Yo');
    } catch(err) {
        context.res = {
            status: 500
        };
    }
}