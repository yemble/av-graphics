See [example.html](example.html) for working code.

## Configuration

```html
AvGraphics.configure({});
```

Override default config. Elements not specified here will keep the default value.

See AvGraphcs.config object for defaults.

## Danger pyramid

```html
<svg id="rose" style="height:5em" />
<script type="text/javascript">
	AvGraphics.drawPyramid({
		"data": [
			{"danger": 3},
			{"danger": 2, "pockets": true},
			{"danger": 1}
		],
		"aspect": 1/1 // optional override for aspect ratio
</script>
```

Danger is on standard scale of 1-5. Pockets will add a P icon to indicate pockets of higher (+1) danger at given elevation.

All images can be customised with an aspect setting to make the output wider if needed to accommodate text.

## TODO

..
