See [example.html](example.html) for working code.

## Configuration

```javascript
AvGraphics.configure({
{
	"colors": {
		// dangers
		low: 'lime',
		moderate: 'yellow',
		considerable: 'orange',
		high: 'red',
		extreme: 'black',

		// mono
		selected: 'grey',
		unselected: 'white',

		// selected segments in rose builder
		activeSelection: 'pink'
	}
});
```

Override default config. Elements not specified here will keep the default value.

## Danger pyramid

<img src="https://i.imgur.com/7pQWEdQ.png" alt="Sample output"/>

```html
<svg id="image" style="height:5em" />

<script type="text/javascript">
	var svg = document.getElementById("image");
	AvGraphics.drawPyramid(svg, {
		"data": [
			{"danger": 3},
			{"danger": 2, "pockets": true},
			{"danger": 1}
		],
		"aspect": 1/1 // optional override for aspect ratio
	});
</script>
```

Each entry in the `data` array is an elevation in the pyramid, top to bottom.
Each `danger` is on standard scale of 1-5.
Optional `pockets` flag will add a P icon to indicate pockets of higher (+1) danger at given elevation.

All images in the library can be customised with an `aspect` to make the output wider if needed to accommodate text eg `16/9`.

## Danger legend

<img src="https://i.imgur.com/KBIUDDa.png" alt="Sample output"/>

```html
<svg id="image" style="height:5em" />

<script type="text/javascript">
	var svg = document.getElementById("image");
	AvGraphics.drawDangerLegend(svg, {
		"showPockets" : true
	});
</script>
```

A vertical coloured legend for the standard danger levels.
If `showPockets` flag is on, then the "Pockets" icon will be included as well.

## Rose

<img src="https://i.imgur.com/5KoRNKc.png" alt="Sample output"/>

```html
<!-- two images, one danger coloured and one monochrome -->
<svg id="danger-rose" style="height:5em" />
<svg id="mono-rose" style="height:5em" />

<script type="text/javascript">
	AvGraphics.drawRose(document.getElementById("danger-rose"), {
		"data" : [
			{"values": {
				"nw": 3, "n": 2, "ne": 2,
				"w":  3,         "e":  2,
				"sw": 4, "s": 4, "se": 3
			}},
			{"values": {
				"nw": 2, "n": 2, "ne": 2,
				"w":  3,         "e":  3,
				"sw": 3, "s": 3, "se": 3
			}},
			{"values": {
				"nw": 2, "n": 1, "ne": 1,
				"w":  2,         "e":  1,
				"sw": 2, "s": 2, "se": 2
			}}
		]
	});
	AvGraphics.drawRose(document.getElementById("mono-rose"), {
		"type": "mono",
		"data" : [
			{"values": {
				"nw": 0, "n": 0, "ne": 0,
				"w":  0,         "e":  0,
				"sw": 1, "s": 1, "se": 1
			}},
			{"values": {
				"nw": 0, "n": 0, "ne": 0,
				"w":  1,         "e":  0,
				"sw": 1, "s": 1, "se": 0
			}},
			{"values": {
				"nw": 0, "n": 0, "ne": 0,
				"w":  0,         "e":  0,
				"sw": 0, "s": 0, "se": 0
			}}
		]
	});
</script>
```

Draw a rose.
Setting the `type` to `mono` produces a single colour rose, so the `values` are just `0` or `1` instead of `1-5`.

For a widget to build this kind of data, see interactive rose widget below.

## Elevation legend

<img src="https://i.imgur.com/9wF4XiS.png" alt="Sample output"/>

```html
<svg id="image" style="height:5em" />

<script type="text/javascript">
	AvGraphics.drawElevationLegend(document.getElementById("image"), {
		"data" : [
			{'label':"above 9,500ft"},
			{'label':"near treeline"},
			{'label':"below treeline"}
		],
		"aspect": 5/2 // you'll probably want to adjust the aspect to suit the text labels
	});
</script>
```

Used to indicate the elevation of the layers given in the diagrams.

## Vertical scale

<img src="https://i.imgur.com/MouZ2ZC.png" alt="Sample output"/>

```html
<svg id="image" style="height:5em" />

<script type="text/javascript">
	AvGraphics.drawScale(document.getElementById("image"), {
		"labels" : [
			"Large",
			"Medium",
			"Small"
		],
		"values": [1,2] // select a range (offset from zero)
	});
</script>
```

For `values`, use a single value array to select a single item or a two value array for a range.

## Trend arrow

<img src="https://i.imgur.com/37efvi9.png" alt="Sample output"/>

```html
<svg id="image" style="height:5em" />

<script type="text/javascript">
	AvGraphics.drawTrend(document.getElementById("image"), {
		"data" : {
			"angle": -30
		}
	});
</script>
```

Use positive `angle` for up tilt, negative for down. `0` for straight.

## Interactive rose builder widget

<img src="https://i.imgur.com/51Tnlnk.png" alt="Sample output"/>

```html
<svg id="builder" style="height:8em" />

<script type="text/javascript">
	AvGraphics.drawRose(document.getElementById("builder"), {
		"build": {
			onChange: function(newData) {
				// data updated by user
				console.log("New state for rose1b", newData);
			},
			// only for danger type:
			onSelection: function(activeSelection, valueCallback) {
				// Only used for danger type (not mono), get a new data value from the user
				// eg display a 1-5 button grid, or other ui element.
				// Use valueCallback(value) to pass the chosen value and update the rose
				
				// Dumb POC implementation here uses javascript prompt() to get value
				// (after a 2 sec delay to avoid blocking constantly)
				if(window.builderTimer) {
					clearTimeout(window.builderTimer);
				}
				if(activeSelection) {
					window.builderTimer = setTimeout(function() {
						var input = prompt('Set value for selected segments', '');

						if(['1','2','3','4','5'].indexOf(input) >= 0) {
							valueCallback(input);
						}
					}, 2000);
				}
			}
		}
	});
</script>
```

This option draws a rose with click handlers and callbacks to allow interactive "painting" of a rose for authoring purposes.

For `mono` type roses, the `onSelection` callback is not required since segments are not selected, simply toggled. For danger roses, the callback allows for a customised UI to be presented to the user: `activeSelection` is a boolean indicating whether any segments are selected and `valueCallback` is used to pass the user's intent back to the widget.

The `onChange` callback is fired every time the rose is altered by the user. The data given is of the correct format to use in rendering a static rose.

