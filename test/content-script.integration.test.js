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

function installSynchronousImageLoading(window, $) {
    // The real browser can satisfy an image request from cache before content.js
    // attaches its load listener.  Make that ordering deterministic in the test:
    // an inline src in myW's HTML fires before myW invokes its callback, while a
    // src assigned after the callback fires after the listener is installed.
    const html = $.fn.html;
    $.fn.html = function patchedHtml(value) {
        const result = html.apply(this, arguments);
        if (typeof value === 'string' && value.includes('reqc="theimg"')) {
            this.find("img[reqc='theimg'][src]").each(function dispatchInlineLoad() {
                this.dispatchEvent(new window.Event('load'));
            });
        }
        return result;
    };

    const srcDescriptor = Object.getOwnPropertyDescriptor(window.HTMLImageElement.prototype, 'src');
    Object.defineProperty(window.HTMLImageElement.prototype, 'src', {
        configurable: true,
        get() {
            return srcDescriptor.get.call(this);
        },
        set(value) {
            srcDescriptor.set.call(this, value);
            if (this.matches("img[reqc='theimg']")) {
                this.dispatchEvent(new window.Event('load'));
            }
        }
    });
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
    installSynchronousImageLoading(window, window.jQuery);

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

    return { dom, window, getLegacyPreviewCalls: () => legacyPreviewCalls };
}

describe('Firefox content.js hover preview integration', function () {
    it('shows the newest image when the browser completes it synchronously', function () {
        const { dom, window, getLegacyPreviewCalls } = loadContentScript();
        const $ = window.jQuery;

        // This exercises the event handler installed by the real content.js,
        // rather than calling a copied helper or a unit-test double.
        window.document.getElementById('old-image').dispatchEvent(
            new window.MouseEvent('mouseover', { bubbles: true, relatedTarget: window.document.body })
        );
        window.document.getElementById('new-image').dispatchEvent(
            new window.MouseEvent('mouseover', { bubbles: true, relatedTarget: window.document.body })
        );

        assert.strictEqual(
            getLegacyPreviewCalls(),
            0,
            'term.ptt.cc hover must use the anchor scanner path, not img_mouseover_show'
        );
        const preview = window.document.querySelector("div[id^='myW_']");
        assert.ok(preview, 'hover should create a myW preview window');
        const image = $(preview).find("img[reqc='theimg']")[0];
        const loading = $(preview).find("img[reqc='theimgloading']")[0];
        assert.ok(image, 'preview should contain its target image');
        assert.strictEqual(image.getAttribute('src'), 'https://images.example/new.jpg');
        assert.notStrictEqual(image.style.display, 'none', 'loaded image must be visible');
        assert.strictEqual(loading.style.display, 'none', 'loading image must be hidden');

        dom.window.close();
    });
});
