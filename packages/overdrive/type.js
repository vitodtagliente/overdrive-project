class Type {
    /// Check if a type is a derived one
    /// @param derived - The derived type
    /// @param parent - The parent type
    /// @return - True if the inherarchy is verified
    static isSubclassOf(derived, parent) {
        return (derived.prototype instanceof parent || derived === parent);
    }
};

module.exports = Type;