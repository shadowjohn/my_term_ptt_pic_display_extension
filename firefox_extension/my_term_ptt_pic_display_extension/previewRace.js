(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        module.exports = factory;
    }
    else {
        root.myTermPttPreviewRace = factory;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function (options) {
    options = options || {};
    var imageFactory = options.imageFactory || function () {
        return new Image();
    };
    var currentToken = 0;

    return {
        load: function (image, url, onload, onerror) {
            var token = ++currentToken;

            image.onload = function () {
                if (token !== currentToken) return;
                if (onload) onload(image);
            };
            image.onerror = function () {
                if (token !== currentToken) return;
                if (onerror) onerror(image);
            };

            // Attach handlers before src. A cached image can complete synchronously
            // during src assignment, so attaching them afterwards loses the event.
            image.src = url;

            return token;
        },
        createImage: function (url, onload, onerror) {
            var image = imageFactory();
            this.load(image, url, onload, onerror);
            return image;
        },
        invalidate: function () {
            currentToken++;
        }
    };
}));
