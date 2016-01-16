# av-graphics

Render common avalanche bulletin images in the browser via SVG from JSON data.

**Static**

* pyramid & legend
* danger rose & legend
* monochrome rose for indicating a region
* vertical scales (single and range)
* trend arrow

**Interactive**

* SVG based interactive rose builder widget, generating valid data suitable for rendering

## Code

See [EXAMPLES.md](EXAMPLES.md) for detailed sample code and usage.

See [example.html](example.html) for functional demo.

**eg:**

```html
<svg id="pyramid"/>

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
</script>
```
## Example output

<img src="http://i.imgur.com/HflTd85.png" alt="Sample output" style="max-width: 80%;"/>

## Contact

Zach Bagnall <zach@y3m.net>
