# av-graphics

A small client-side Javascript lib to render common avalanche bulletin images (elevation pyramid, rose, legends) from raw data.

See example.html for detailed usage code.

### Code snippets

Hardcoded data.. could be from JSON back-end instead.

```html
<svg id="pyramid"/>
<svg id="rose"/>

<script src="avgraphics.js"></script>
<script type="text/javascript">
    // draw an elevation pyramid
    AvGraphics.drawPyramid(document.getElementById('pyramid'), {
        data : [
            {'danger':4},
            {'danger':3, 'pockets': true},
            {'danger':1, 'pockets': true}
        ]
    });

    // draw a rose
	AvGraphics.drawRose(document.getElementById('rose'), {
		data : [
			{"dangers": {
				"nw": 3, "n": 2, "ne": 2,
				"w":  3,         "e":  2,
				"sw": 4, "s": 4, "se": 3
			}},
			{"dangers": {
				"nw": 2, "n": 2, "ne": 2,
				"w":  3,         "e":  3,
				"sw": 3, "s": 3, "se": 3
			}},
			{"dangers": {
				"nw": 2, "n": 1, "ne": 1,
				"w":  2,         "e":  1,
				"sw": 2, "s": 2, "se": 2
			}},
		]
	});   
```
### Sample output

<img src="http://i.imgur.com/cOKA39C.png" alt="Sample output" style="max-width: 90%;"/>

