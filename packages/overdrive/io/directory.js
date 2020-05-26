const fs = require('fs');
const path = require('path');

class Directory {
    /// Retrieve the list of files in a folder
    /// @param directory - The folder on which looking for
    /// @return - The file list
    static getFiles(directory) {
        const files = Array();
        for (const file of fs.readdirSync(directory))
        {
            if (!!path.extname(file))
            {
                files.push(path.join(directory, file));
            }
        }
        return files;
    }
}

module.exports = Directory;