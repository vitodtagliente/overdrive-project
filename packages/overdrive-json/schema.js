function Schema(data = {}, schema = {}) {
    const obj = Object.create(schema);
    const keys = Object.keys(data || {});
    for (const key of Object.keys(schema))
    {
        if (keys.includes(key))
        {
            obj[key] = data[key];
        }
    }
    return obj;
}

Schema.ref = function (data = {}, schema = {}) {
    const keys = Object.keys(data || {});
    for (const key of Object.keys(schema))
    {
        if (keys.includes(key) == false)
        {
            data[key] = schema[key];
        }
    }
    return data;
}

module.exports = Schema;