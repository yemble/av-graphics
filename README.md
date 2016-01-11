# av-graphics

A small lib to render common avalanche bulletin images via JSON and SVG.

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

<img src="http://i.imgur.com/yc7ZTBl.png" alt="Sample output" style="max-width: 90%;"/>

