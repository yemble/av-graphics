var AvGraphics = (function() {

	// number of key/value pairs in an object
	function sizeOfObject(x) {
		var size = 0, key;
	    for (key in x) {
	        if (x.hasOwnProperty(key)) size++;
	    }
	    return size;
	}

	// DOM empty wrapper
	function removeChildren(parent) {
		parent.innerHTML = '';
	};
	// DOM append wrapper
	function appendChild(parent, child) {
		parent.appendChild(child);
	};

	// Initialcap
	function initialCap(x) {
		return x[0].toUpperCase() + x.substring(1);
	};

	// build an svg element with given name, attributes and data
	function makeSVG(tag, attrs, data) {
		var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
		for (var k in attrs) {
			el.setAttribute(k, attrs[k]);
		}
		if(data) {
			el.appendChild( document.createTextNode(data) );
		}
		return el;
	};

	
	return {
		// expand a "3:considerable" string into useful attributes
		decodeDanger: function(str) {
			return [
				{
					'number' : 1,
					'title' : 'low',
					'fill' : 'green'
				},
				{
					'number' : 2,
					'title' : 'moderate',
					'fill' : 'yellow'
				},
				{
					'number' : 3,
					'title' : 'considerable',
					'fill' : 'orange'
				},
				{
					'number' : 4,
					'title' : 'high',
					'fill' : 'red'
				},
				{
					'number' : 5,
					'title' : 'extreme',
					'fill' : 'black'
				}
			][ String(str).split(':')[0]-1 ];
		},

		drawPyramid: function(svg, config) {
			console.log(['drawPyramid', svg, config]);

			var data = config.data;

			var nLayers = sizeOfObject(data);

			if(nLayers < 1) {
				return;
			}

			var polys = [];

			var xmax = 100, ymax = 100, margin = 10;

			svg.setAttribute('width', '200px');
			svg.setAttribute('height', '200px');
			svg.setAttribute('viewBox', '0 0 '+xmax+' '+ymax);

			var fullHeight = ymax - margin*2;
			var fullWidth = fullHeight;
			var layerHeight = fullHeight / nLayers;
			var layerWidthUnit = fullWidth / nLayers / 2;

			var midx = fullWidth / 2;

			var i = 0;
			for(var name in data) {
				var danger = this.decodeDanger(data[name]);

				if(i == 0) {
					polys.push({
						points: [
							[midx+margin,margin],
							[midx+margin+layerWidthUnit,layerHeight+margin],
							[midx+margin-layerWidthUnit,layerHeight+margin]],
						fill: danger.fill,
						centre: [midx+margin, margin+layerHeight*(i+0.5)],
						text: String(danger.number),
						textFore: danger.number == 5 ? 'white' : 'black'
					});
				}
				else {
					polys.push({
						points: [
							[midx+margin-layerWidthUnit*i,margin+layerHeight*i],
							[midx+margin+layerWidthUnit*i,margin+layerHeight*i],
							[midx+margin+layerWidthUnit*(i+1),margin+layerHeight*(i+1)],
							[midx+margin-layerWidthUnit*(i+1),margin+layerHeight*(i+1)],
						],
						fill: danger.fill,
						centre: [midx+margin, margin+layerHeight*(i+0.5)],
						text: String(danger.number),
						textFore: danger.number == 5 ? 'white' : 'black'
					});
				}

				i++;
			}

			removeChildren(svg);

			for(var i in polys) {
				var poly = polys[i];

				var points = poly.points
					.map(function(x) {
						return x.join(',');
					})
					.join(' ');

				var style = 'fill:' + poly.fill + '; stroke:black; stroke-width:1';

				appendChild(svg,
					makeSVG('polygon', {
						'points': points,
						'style': style
					})
				);

				appendChild(svg,
					makeSVG('text', {
						'x': poly.centre[0],
						'y': poly.centre[1] + layerHeight/15,
						'text-anchor': 'middle',
						'style': 'dominant-baseline:central; font-size: 60%; stroke-width:1; stroke: ' + poly.textFore + '; fill: ' + poly.textFore
					}, poly.text)
				);
			}

			// TODO: support pockets

			// TODO: support elevation indications?
		},

		drawLegend: function(svg, config) {
			console.log(['drawLegend', svg, config]);

			var nItems = 5 + (config.showPockets ? 1 : 0);

			var rects = [];

			var xmax = 150, ymax = 100, margin = 10;

			svg.setAttribute('width', '300px');
			svg.setAttribute('height', '200px');
			svg.setAttribute('viewBox', '0 0 '+xmax+' '+ymax);

			var fullHeight = ymax - margin*2;
			var itemSize = fullHeight * 0.8 / nItems;
			var itemGap = fullHeight * 0.2 / (nItems-1);

			for(var i = 1; i <= nItems; i++) {
				var danger = i < 6 ? this.decodeDanger(String(6-i)) : {};

				var fill = danger.fill || 'white';
				var text = danger.title || 'Pockets of higher danger';

				var topy = (i - 1) * (itemGap + itemSize) + margin;

				rects.push({
					x: margin, y: topy,
					width: itemSize, height: itemSize,
					fill: fill,
					labelPos: [margin + itemSize*1.4, topy + itemSize/2],
					labelText: text,
					text: danger.number || 'P',
					textFore: danger && danger.number == 5 ? 'white' : 'black'
				});
			}

			removeChildren(svg);

			for(var i in rects) {
				var rect = rects[i];

				var style = 'fill:' + rect.fill + '; stroke:black; stroke-width:1';

				appendChild(svg,
					makeSVG('rect', {
						'x': rect.x, 'y': rect.y,
						'width': rect.width, 'height': rect.height,
						'style': style
					})
				);

				appendChild(svg,
					makeSVG('text', {
						'x': rect.x + rect.width / 2,
						'y': rect.y + rect.height / 2,
						'text-anchor': 'middle',
						'style': 'dominant-baseline:central; font-size: 40%; stroke-width:0.6; stroke: ' + rect.textFore + '; fill: ' + rect.textFore
					}, String(rect.text))
				);

				appendChild(svg,
					makeSVG('text', {
						'x': rect.labelPos[0],
						'y': rect.labelPos[1] + rect.height/15,
						//'text-anchor': 'middle',
						'style': 'dominant-baseline:central; font-size: 50%;'
					}, initialCap(rect.labelText))
				);
			}
		},

		drawRose: function(svg, config) {
			console.log(['drawRose', svg, config]);

			var data = config.data;

			var nLayers = sizeOfObject(data);

			if(nLayers < 1) {
				return;
			}

			var polys = [], texts = [], rects = [];

			var xmax = 200, ymax = 100, margin = 10, textMargin = 10;

			svg.setAttribute('width', '400px');
			svg.setAttribute('height', '200px');
			svg.setAttribute('viewBox', '0 0 '+xmax+' '+ymax);

			var maxRadius = (ymax - textMargin*2 - margin*2) / 2;
			var depth = maxRadius / nLayers;
			var indent = function(x) { return x * 0.85 };
			var roseSize = maxRadius*2 + textMargin*2; 

			var arc = 360 / 8;
			var headings = ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'];

			var toc = function(r,a) {
				return [
					+r * Math.cos(a*Math.PI/180) + maxRadius+textMargin+margin,
					-r * Math.sin(a*Math.PI/180) + maxRadius+textMargin+margin
				];
			};

			for(var i in data) {
				i = parseInt(i);
				var level = data[i];

				var outer1 = (i+1) * depth;
				var outer0 = indent(outer1);
				var inner1 = (i) * depth;
				var inner0 = (i > 0) ? indent(inner1) : 0;

				for(var j in headings) {
					var heading = headings[j];

					var h0 = j * arc - arc/2;
					var h1 = h0 + arc/2;
					var h2 = h0 + arc;
					if(h0 >= 360) h0 -= 360;
					if(h1 >= 360) h1 -= 360;
					if(h2 >= 360) h2 -= 360;

					//console.log(['poly', i, outer0, outer1, h1]);

					var points = [
						toc(outer0, h0),
						toc(outer1, h1),
						toc(outer0, h2)
					];

					if(i == 0) {
						points.push(
							toc(0, 0)
						);
					}
					else {
						points.push(
							toc(inner0, h2),
							toc(inner1, h1),
							toc(inner0, h0)
						);
					}

					var danger = this.decodeDanger(level.dangers[heading]);

					polys.push({
						points: points,
						fill: danger.fill
					});
				}
			}

			for(var j in headings) {
				var heading = headings[j];

				var h1 = j * arc;
				if(h1 >= 360) h1 -= 360;

				//console.log(['text', h1, heading]);

				texts.push({
					centre: toc(maxRadius + depth*2/3, h1),
					text: heading
				});
			}

			var elex = margin + roseSize + margin, eley = margin + textMargin;
			var eleWidth = maxRadius*3/2;
			var eleHeight = maxRadius;
			var eleMid = elex + eleWidth/2;

			for(var i in data) {
				i = parseInt(i);
				var level = data[i];

				var width = eleWidth * (i+1)/nLayers;
				var height = eleHeight / nLayers;
				var offx = eleMid - width/2;
				var offy = eley + i*height;

				rects.push({
					x: offx, y: offy,
					width: width, height: height,
					fill: 'white',
					labelPos: [offx+width+margin/2, offy+height/2],
					labelText: level.title
				});
			}

			removeChildren(svg);

			for(var i in polys) {
				var poly = polys[i];

				var points = poly.points.map(function(x) {
						return x
							.map(function(q) { return parseInt(q); })
							.join(',');
					})
					.join(' ');

				var style = 'fill:' + poly.fill + '; stroke:black; stroke-width:1';

				appendChild(svg,
					makeSVG('polygon', {
						'points': points,
						'style': style
					})
				);
			}

			for(var i in rects) {
				var rect = rects[i];

				var style = 'fill:' + rect.fill + '; stroke:black; stroke-width:1';

				appendChild(svg,
					makeSVG('rect', {
						'x': rect.x, 'y': rect.y,
						'width': rect.width, 'height': rect.height,
						'style': style
					})
				);

				appendChild(svg,
					makeSVG('text', {
						'x': rect.labelPos[0],
						'y': rect.labelPos[1],
						//'text-anchor': 'middle',
						'style': 'dominant-baseline:central; font-size: 40%;'
					}, initialCap(rect.labelText))
				);
			}

			for(var i in texts) {
				var text = texts[i];

				appendChild(svg,
					makeSVG('text', {
						'x': text.centre[0],
						'y': text.centre[1],
						'text-anchor': 'middle',
						'style': 'dominant-baseline:central; font-size: 30%; text-transform: uppercase;'
					}, text.text)
				);
			}

			// TODO: elevation diagram
		}

	};
})();