const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const chromeDir = path.join(root, 'my_term_ptt_pic_display_extension');
const firefoxDir = path.join(root, 'firefox_extension', 'my_term_ptt_pic_display_extension');
const assetNames = ['3wa_logo.png', 'loading.gif', 'x_close.png', 'settings.png', 'link64.png'];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

describe('extension package structure', function () {
  it('keeps third-party code and images out of the business source', function () {
    const content = read('my_term_ptt_pic_display_extension/content.js');
    const jquery = read('my_term_ptt_pic_display_extension/vendor/jquery-4.0.0.min.js');

    expect(jquery).to.include('jQuery v4.0.0');
    expect(content).not.to.include('data:image/');
    expect(content).not.to.include('jQuery v4.0.0');
    expect(content).not.to.match(/\.unbind\(|\.bind\("/);
    expect(content).not.to.match(/\.off\(\)\.(?:click|mouseleave)/);
    expect(content).not.to.include("attr('onerror'");
    expect(content).not.to.match(/\son(?:load|error)=/i);
    expect(content).not.to.match(/<script\b/i);
    expect(content).to.include("window['my_3wa_func'] = appClass;");
    expect(content).to.include('appVersion: "0.3.7"');
    assetNames.forEach(name => {
      expect(fs.existsSync(path.join(chromeDir, 'assets', name)), name).to.equal(true);
    });
  });

  it('injects local jQuery before the Chrome content script', function () {
    const background = read('my_term_ptt_pic_display_extension/background.js');
    const manifest = JSON.parse(read('my_term_ptt_pic_display_extension/manifest.json'));
    expect(background).to.include("files: ['vendor/jquery-4.0.0.min.js', 'content.js']");
    expect(background.length).to.be.lessThan(3000);
    expect(manifest.web_accessible_resources[0].resources).to.include('assets/*');
  });

  it('generates a self-contained Firefox package with the same sources', function () {
    const manifest = JSON.parse(read('firefox_extension/my_term_ptt_pic_display_extension/manifest.json'));
    expect(manifest.content_scripts[0].js).to.deep.equal([
      'vendor/jquery-4.0.0.min.js',
      'content.js'
    ]);
    expect(manifest.web_accessible_resources).to.include('assets/*');
    expect(read('firefox_extension/my_term_ptt_pic_display_extension/content.js'))
      .to.equal(read('my_term_ptt_pic_display_extension/content.js'));
    expect(read('firefox_extension/my_term_ptt_pic_display_extension/vendor/jquery-4.0.0.min.js'))
      .to.equal(read('my_term_ptt_pic_display_extension/vendor/jquery-4.0.0.min.js'));
    assetNames.forEach(name => {
      expect(fs.existsSync(path.join(firefoxDir, 'assets', name)), name).to.equal(true);
    });
  });
});
