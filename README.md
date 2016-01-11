# av-graphics

A small lib to render common avalanche bulletin images (elevation pyramid, rose, legends) via JSON and SVG.

```html
<svg id="pyramid1"/>

<script src="avgraphics.js"></script>
<script type="text/javascript">
    AvGraphics.drawPyramid(document.getElementById('pyramid1'), {
        data : {
            "alp": "4:high",
            "tl": "3:considerable:pockets",
            "btl": "1:low:pockets"
        }
    });
</script>
```

<img src="http://i.imgur.com/Q57gME0.png" alt="Sample output" style="max-width: 90%;"/>

