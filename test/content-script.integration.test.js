const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const checkoutRoot = path.resolve(__dirname, '..');
const sourceRoot = process.env.CONTENT_SCRIPT_ROOT || checkoutRoot;
const extensionRoot = path.join(
    sourceRoot,
    'firefox_extension',
    'my_term_ptt_pic_display_extension'
);

function readExtensionFile(relativePath) {
    return fs.readFileSync(path.join(extensionRoot, relativePath), 'utf8');
}

function loadContentScript() {
    const dom = new JSDOM(`<!doctype html>
        <html><body>
            <a id="old-image" href="https://images.example/old.jpg">old</a>
            <a id="new-image" href="https://images.example/new.jpg">new</a>
        </body></html>`, {
        url: 'https://term.ptt.cc/bbs/test',
        runScripts: 'outside-only'
    });
    const { window } = dom;
    const intervals = [];

    window.innerWidth = 1280;
    window.innerHeight = 800;
    window.console = { log() {}, warn() {}, error() {} };
    window.chrome = {
        runtime: {
            getURL(file) { return `moz-extension://test/${file}`; }
        }
    };
    window.setInterval = function captureInterval(callback, delay) {
        intervals.push({ callback, delay });
        return intervals.length;
    };
    window.clearInterval = function clearCapturedInterval() {};

    // content.js preloads each URL with new Image().  That preload is not the
    // image displayed by myW, so keep it inert and control only the real DOM img.
    window.Image = class PreloadImage {
        set src(value) { this._src = value; }
        get src() { return this._src; }
    };

    window.eval(readExtensionFile('vendor/jquery-4.0.0.min.js'));
    const helperPath = path.join(extensionRoot, 'previewRace.js');
    if (fs.existsSync(helperPath)) {
        window.eval(fs.readFileSync(helperPath, 'utf8'));
    }
    window.eval(readExtensionFile('content.js'));

    // Keep a runtime witness for the method changed by PR #2.  The term.ptt.cc
    // scanner should not call this legacy preview path.
    const legacyPreview = window.my_3wa_func.method.img_mouseover_show;
    let legacyPreviewCalls = 0;
    window.my_3wa_func.method.img_mouseover_show = function legacyPreviewSpy() {
        legacyPreviewCalls += 1;
        return legacyPreview.apply(this, arguments);
    };

    const scanner = intervals.find((entry) => entry.delay === 300);
    assert.ok(scanner, 'content.js should register its 300ms anchor scanner');
    scanner.callback();

    return {
        dom,
        window,
        runScanner: scanner.callback,
        getLegacyPreviewCalls: () => legacyPreviewCalls
    };
}

describe('Firefox content.js hover preview integration', function () {
    it('refreshes a reused anchor before showing its new image', function () {
        const { dom, window, runScanner, getLegacyPreviewCalls } = loadContentScript();
        const link = window.document.getElementById('new-image');

        // term.ptt.cc can update an existing terminal line instead of replacing
        // its anchor node.  Reuse the node with a new href after the first scan.
        link.textContent = 'reused-link';
        link.setAttribute('href', 'https://images.example/reused-new.jpg');
        runScanner();
        link.dispatchEvent(new window.MouseEvent('mouseover', {
            bubbles: true,
            relatedTarget: window.document.body
        }));

        assert.strictEqual(
            getLegacyPreviewCalls(),
            0,
            'term.ptt.cc hover must use the anchor scanner path, not img_mouseover_show'
        );
        const image = window.document.querySelector("div[id^='myW_'] img[reqc='theimg']");
        assert.ok(image, 'reused anchor should still create a preview');
        assert.strictEqual(
            image.getAttribute('src'),
            'https://images.example/reused-new.jpg',
            'preview must follow the anchor href after the terminal reuses the node'
        );

        dom.window.close();
    });
});
