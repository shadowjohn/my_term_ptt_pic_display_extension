const { expect } = require('chai');

// FakeImage to control when onload fires
function FakeImage() {
  this.onload = null;
  this._src = null;
  FakeImage.instances.push(this);
}
Object.defineProperty(FakeImage.prototype, 'src', {
  get: function () { return this._src; },
  set: function (v) { this._src = v; }
});
FakeImage.instances = [];

const { createHoverController } = require('../lib/imgHover');

describe('img hover race', function () {
  it('does not let a previous slow load override the current preview', function () {
    FakeImage.instances = [];
    // lightweight showDiv mock
    const showDiv = { innerHTML: '', dataset: {} };

    const ctrl = createHoverController(showDiv, FakeImage);

    // simulate hovering over img1 then quickly img2
    ctrl.hover('img1.jpg');
    ctrl.hover('img2.jpg');

    // ensure two FakeImage instances were created
    expect(FakeImage.instances.length).to.equal(2);

    // trigger the first image (slow) after the second
    FakeImage.instances[1].onload && FakeImage.instances[1].onload.call(FakeImage.instances[1]);
    // now slow first one fires
    FakeImage.instances[0].onload && FakeImage.instances[0].onload.call(FakeImage.instances[0]);

    // expectation: showDiv should reflect img2.jpg (the later hover)
    expect(showDiv.innerHTML).to.contain('img2.jpg');
  });
});
