/**
 * JavaScript code to detect available availability of a
 * particular font in a browser using JavaScript and CSS.
 *
 * Author : Lalit Patel
 * Website: http://www.lalit.org/lab/javascript-css-font-detect/
 * License: Apache Software License 2.0
 *          http://www.apache.org/licenses/LICENSE-2.0
 * Version: 0.15 (21 Sep 2009)
 *          Changed comparision font to default from sans-default-default,
 *          as in FF3.0 font of child element didn't fallback
 *          to parent element if the font is missing.
 * Version: 0.2 (04 Mar 2012)
 *          Comparing font against all the 3 generic font families ie,
 *          'monospace', 'sans-serif' and 'sans'. If it doesn't match all 3
 *          then that font is 100% not available in the system
 * Version: 0.3 (24 Mar 2012)
 *          Replaced sans with serif in the list of baseFonts
 */

/**
 * Usage: d = new Detector();
 *        d.detect('font name');
 */
var Detector = function() {
    // a font will be compared against all the three default fonts.
    // and if it doesn't match all 3 then that font is not available.
    var baseFonts = ['monospace', 'sans-serif', 'serif'];

    //we use m or w because these two characters take up the maximum width.
    // And we use a LLi so that the same matching fonts can get separated
    var testString = "mmmmmmmmmmlli";

    //we test using 72px font size, we may use any size. I guess larger the better.
    var testSize = '72px';

    var h = document.getElementsByTagName("body")[0];

    // create a SPAN in the document to get the width of the text we use to test
    var s = document.createElement("span");
    s.style.fontSize = testSize;
    s.innerHTML = testString;
    var defaultWidth = {};
    var defaultHeight = {};
    for (var index in baseFonts) {
        //get the default width for the three base fonts
        s.style.fontFamily = baseFonts[index];
        h.appendChild(s);
        defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font
        defaultHeight[baseFonts[index]] = s.offsetHeight; //height for the defualt font
        h.removeChild(s);
    }

    function detect(font) {
        var detected = false;
        for (var index in baseFonts) {
            s.style.fontFamily = font + ',' + baseFonts[index]; // name of the font along with the base font for fallback.
            h.appendChild(s);
            var matched = (s.offsetWidth != defaultWidth[baseFonts[index]] || s.offsetHeight != defaultHeight[baseFonts[index]]);
            h.removeChild(s);
            detected = detected || matched;
        }
        return detected;
    }

    this.detect = detect;
};

var d = new Detector();

// Set up our wrapper
function testAndShow(fontName) {
  var result = d.detect(fontName);
  var tbody = document.getElementById('font-table');
  tbody.innerHTML = tbody.innerHTML + '<tr><td><span class="' + (result ? 'name-match' : 'name-no-match') + '" style="font-family: \'' + fontName.replace(/"'/g,'') + '\', monospace">' + fontName.replace(/</g,'&lt;') + '</span></td><td>' + (result ? '<span class="yes">Yes</span>' : '<span class="no">No</span>') + '</td>';
}
'use strict';

function testAll(fonts) {
  var tbody = document.getElementById('font-table');
  tbody.innerHTML = '';
  fonts.forEach(function (font) {
    return testAndShow(font);
  });
}

function guessFont() {
  var body = document.getElementsByTagName('body')[0];
  var stack = body ? window.getComputedStyle(body).fontFamily : '';

  try {
    var selectedEl = window.getSelection().anchorNode.parentElement
    stack = window.getComputedStyle(selectedEl).fontFamily;
  } catch (err) {
    // console.error(err);
  }

  var fonts = stack.split(/\s*,\s*/).map(function (font) {
    return font.replace(/^['"]\s*(.+\S)\s*['"]$/, '$1');
  });
  console.log(fonts);

  var probableFont = false;
  fonts.forEach(function (font) {
    if (d.detect(font)) {
      probableFont = probableFont || font;
    }
  });

  // display
  testAll(fonts);

  if (probableFont) {
    document.getElementById('probable-font').innerText = 'Probably using font family or keyword: ' + probableFont;
  } else {
    document.getElementById('probable-font').innerText = 'Did not detect a font set for body';
  }
}

// Now test

// const fonts = ['Times', 'Times New Roman', 'Helvetica', 'Helvetica Neue', 'Arial', 'Roboto', 'Cantarell', 'Oxygen-Sans', 'Oxygen', '-apple-system', 'BlinkMacSystemFont', 'system-font', 'Segoe UI'];

// testAll(fonts);

guessFont();
