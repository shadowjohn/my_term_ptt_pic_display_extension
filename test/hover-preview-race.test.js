const assert = require('assert');
const createPreviewRace = require('../my_term_ptt_pic_display_extension/previewRace.js');

class CachedImage {
  constructor() {
    this._src = '';
    this.onload = null;
    this.onerror = null;
  }

  set src(value) {
    this._src = value;
    // A cached image can finish while src is assigned. If content.js attaches
    // onload afterwards, this event is lost and the preview stays on loading.
    if (this.onload) this.onload();
  }

  get src() {
    return this._src;
  }
}

describe('term.ptt.cc hover preview race', function () {
  it('shows a cached new image even when load fires during src assignment', function () {
    const shown = [];
    const race = createPreviewRace({ imageFactory: () => new CachedImage() });
    race.createImage('new-image.jpg', loaded => shown.push(loaded.src));

    assert.deepStrictEqual(shown, ['new-image.jpg']);
  });

  it('ignores a slow old image after the pointer moves to a new link', function () {
    const shown = [];
    const race = createPreviewRace();
    const oldImage = { src: 'old-image.jpg', onload: null, onerror: null };
    const newImage = { src: 'new-image.jpg', onload: null, onerror: null };

    race.load(oldImage, oldImage.src, loaded => shown.push(loaded.src));
    race.load(newImage, newImage.src, loaded => shown.push(loaded.src));
    oldImage.onload();
    newImage.onload();

    assert.deepStrictEqual(shown, ['new-image.jpg']);
  });
});
