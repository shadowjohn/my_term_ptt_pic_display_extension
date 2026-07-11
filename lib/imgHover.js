function createHoverController(showDiv, ImageClass = global.Image) {
  return {
    hover: function (src, options) {
      // ensure a place to record the currently requested src
      if (!showDiv.dataset) showDiv.dataset = {};
      showDiv.dataset.currentSrc = src;

      var Img = new ImageClass();
      Img.onload = function () {
        // ignore stale loads from previously requested images
        if (showDiv.dataset.currentSrc !== this.src) return;
        showDiv.innerHTML = "<img src='" + this.src + "' style='pointer-events:none;width:100%;height:100%;'>";
      };

      // start loading after recording the current src
      Img.src = src;

      // immediate optimistic update
      showDiv.innerHTML = "<img src='" + src + "' style='pointer-events:none;width:100%;height:100%;'>";
    }
  };
}

module.exports = { createHoverController };
