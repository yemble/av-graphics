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

## TODO

..
