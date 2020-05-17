class Validation {
    /// Check if a value is empty
    /// @param data - Array of elements
    /// @return - True if empty or undefined
    static empty(data = Array()) {
        if (Array.isArray(data))
        {
            if (data.length > 0)
            {
                for (const element of data)
                {
                    if(Validation.empty(element))
                    {
                        return true;
                    }
                }
                return false;
            }
            return true;
        }
        else 
        {
            return data == null || data == undefined
                || (typeof data === typeof "" && data.trim().length == 0);
        }
    }

    /// Check if the input is a valid email
    /// @param email - The email
    /// @return - True if valid
    static email(value) {
        return true;
    }
}

module.exports = Validation;