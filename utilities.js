const utf8 = require('utf8');
function encodeBase64Object(data){
    if (!data) {
        //eslint-disable-next-line
        return data;
    }
    data = JSON.parse(JSON.stringify(data));
    if (typeof data !== 'object') {
        //eslint-disable-next-line
        return data;
    }
    const result = {};
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (typeof data[key] === 'object') {
            result[key] = encodeBase64Object(data[key]);
        }
        else {
            //eslint-disable-next-line
            const text = Buffer.from(utf8.encode('' + data[key])).toString('base64');
            result[key] = text;
        }
    }
    return result;
};

module.exports = {
    encodeBase64Object
}