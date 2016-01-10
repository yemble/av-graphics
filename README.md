# av-graphics

A small lib to render common avalanche bulletin images via JSON and SVG.

```html
<svg id="pyramid1"/>

<script src="avgraphics.js"></script>
<script type="text/javascript">
    AvGraphics.drawPyramid(document.getElementById('pyramid1'), {
        data : {
            "alp": "5:extreme",
            "tl": "4:high:pockets",
            "btl": "2:moderate"
        }
    });
</script>
```

![Example output](http://i.imgur.com/WH5zlmA.png)
