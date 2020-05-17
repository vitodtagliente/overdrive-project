module.exports = {
    Code: {
        Continue: 100,
        SwitchingProtocols: 101,
        EarlyHints: 103,
        OK: 200,
        Created: 201,
        Accepted: 202,
        NonAuthoritativeInformation: 203,
        NoContent: 204,
        ResetContent: 205,
        PartialContent: 206,
        MultipleChoices: 300,
        MovedPermanently: 301,
        Found: 302,
        SeeOther: 303,
        NotModified: 304,
        TemporaryRedirect: 307,
        PermanentRedirect: 308,
        BadRequest: 400,
        Unauthorized: 401,
        PaymentRequired: 402,
        Forbidden: 403,
        NotFound: 404,
        MethodNotAllowed: 405,
        NotAcceptable: 406,
        ProxyAuthenticationRequired: 407,
        RequestTimeout: 408,
        Conflict: 409,
        Gone: 410,
        LengthRequired: 411,
        PreconditionFailed: 412,
        PayloadTooLarge: 413,
        URITooLong: 414,
        UnsupportedMediaType: 415,
        RangeNotSatisfiable: 416,
        ExpectationFailed: 417,
        ImAteaPot: 418,
        UnprocessableEntity: 422,
        TooEarly: 425,
        UpgradeRequired: 426,
        PreconditionRequired: 428,
        TooManyRequests: 429,
        RequestHeaderFieldsTooLarge: 431,
        UnavailableForLegalReasons: 451,
        InternalServerError: 500,
        NotImplemented: 501,
        BadGateway: 502,
        ServiceUnavailable: 503,
        GatewayTimeout: 504,
        HTTPVersionNotSupported: 505,
        VariantAlsoNegotiates: 506,
        InsufficientStorage: 507,
        LoopDetected: 508,
        NotExtended: 510,
        NetworkAuthenticationRequired: 511
    },
    /// Convert the status code to its message
    toString: function (Code) {
        switch (code)
        {
            case this.Code.Continue: return 'Continue';
            case this.Code.SwitchingProtocols: return 'Switching Protocols';
            case this.Code.EarlyHints: return 'Early Hints';
            case this.Code.OK: return 'OK';
            case this.Code.Created: return 'Created';
            case this.Code.Accepted: return 'Accepted';
            case this.Code.NonAuthoritativeInformation: return 'Non-Authoritative Information';
            case this.Code.NoContent: return 'No Content';
            case this.Code.ResetContent: return 'Reset Content';
            case this.Code.PartialContent: return 'Partial Content';
            case this.Code.MultipleChoices: return 'Multiple Choices';
            case this.Code.MovedPermanently: return 'Moved Permanently';
            case this.Code.Found: return 'Found';
            case this.Code.SeeOther: return 'See Other';
            case this.Code.NotModified: return 'Not Modified';
            case this.Code.TemporaryRedirect: return 'Temporary Redirect';
            case this.Code.PermanentRedirect: return 'Permanent Redirect';
            case this.Code.BadRequest: return 'Bad Request';
            case this.Code.Unauthorized: return 'Unauthorized';
            case this.Code.PaymentRequired: return 'Payment Required';
            case this.Code.Forbidden: return 'Forbidden';
            case this.Code.NotFound: return 'Not Found';
            case this.Code.MethodNotAllowed: return 'Method Not Allowed';
            case this.Code.NotAcceptable: return 'Not Acceptable';
            case this.Code.ProxyAuthenticationRequired: return 'Proxy Authentication Required';
            case this.Code.RequestTimeout: return 'Request Timeout';
            case this.Code.Conflict: return 'Conflict';
            case this.Code.Gone: return 'Gone';
            case this.Code.LengthRequired: return 'Length Required';
            case this.Code.PreconditionFailed: return 'Precondition Failed';
            case this.Code.PayloadTooLarge: return 'Payload Too Large';
            case this.Code.URITooLong: return 'URI Too Long';
            case this.Code.UnsupportedMediaType: return 'Unsupported Media Type';
            case this.Code.RangeNotSatisfiable: return 'Range Not Satisfiable';
            case this.Code.ExpectationFailed: return 'Expectation Failed';
            case this.Code.ImATeaPot: return "I'm a tea pot";
            case this.Code.UnprocessableEntity: return 'Unprocessable Entity';
            case this.Code.TooEarly: return 'Too Early';
            case this.Code.UpgradeRequired: return 'Upgrade Required';
            case this.Code.PreconditionRequired: return 'Precondition Required';
            case this.Code.TooManyRequests: return 'Too Many Requests';
            case this.Code.RequestHeaderFieldsTooLarge: return 'Request Header Fields Too Large';
            case this.Code.UnavailableForLegalReasons: return 'Unavailable For Legal Reasons';
            case this.Code.InternalServerError: return 'Internal Server Error';
            case this.Code.NotImplemented: return 'Not Implemented';
            case this.Code.BadGateway: return 'Bad Gateway';
            case this.Code.ServiceUnavailable: return 'Service Unavailable';
            case this.Code.GatewayTimeout: return 'Gateway Timeout';
            case this.Code.HTTPVersionNotSupported: return 'HTTP Version Not Supported';
            case this.Code.VariantAlsoNegotiates: return 'Variant Also Negotiates';
            case this.Code.InsufficientStorage: return 'Insufficient Storage';
            case this.Code.LoopDetected: return 'Loop Detected';
            case this.Code.NotExtended: return 'Not Extended';
            case this.Code.NetworkAuthenticationRequired: return 'Network Authentication Required';
        }
    }
};