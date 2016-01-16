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

## TODO

..
