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

	function setContainerSize(svg, aspectWidth, aspectHeight, defaultHeightStyle) {
		var rect = svg.getBoundingClientRect();

		if(rect.width > rect.height) {
			// set height by aspect

			var height = rect.width * aspectHeight / aspectWidth;
			svg.style.height = height+'px';
		}
		else {
			if(rect.height == 0) {
				// set height to default
				svg.style.height = defaultHeight;
			}

			// set width by aspect
			var width = rect.height * aspectWidth / aspectHeight;
			svg.style.width = width+'px';
		}
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
		config: {
			colors: {
				low: 'lime',
				moderate: 'yellow',
				considerable: 'orange',
				high: 'red',
				extreme: 'black'
			}
		},

		configure: function(newConfig) {
			if(newConfig.colors) {
				for(var x in newConfig.colors) {
					this.config.colors[x] = newConfig.colors[x];
				}
			}
		},

		// expand a "3:considerable" string into useful attributes
		decodeDanger: function(str) {
			var DANGERS = [
				{
					'number' : 1,
					'title' : 'low',
					'fill' : this.config.colors.low
				},
				{
					'number' : 2,
					'title' : 'moderate',
					'fill' : this.config.colors.moderate
				},
				{
					'number' : 3,
					'title' : 'considerable',
					'fill' : this.config.colors.considerable
				},
				{
					'number' : 4,
					'title' : 'high',
					'fill' : this.config.colors.high
				},
				{
					'number' : 5,
					'title' : 'extreme',
					'fill' : this.config.colors.extreme
				}
			];

			var parts = String(str).split(':');

			var danger = DANGERS[ parts[0]-1 ];

			danger.pockets = (danger.number < 5 && parts.length > 2 && parts[2] == 'pockets') ? DANGERS[ danger.number ] : false;

			return danger;
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

			setContainerSize(svg, 1, 1, '10em');
			svg.setAttribute('viewBox', '0 0 '+xmax+' '+ymax);

			var fullHeight = ymax - margin*2;
			var fullWidth = fullHeight;
			var layerHeight = fullHeight / nLayers;
			var layerWidthUnit = fullWidth / nLayers / 2;

			var midx = fullWidth / 2;

			var i = 0;
			for(var name in data) {
				var danger = this.decodeDanger(data[name]);

				var top = (i == 0);

				var overlay = false;
				if(danger.pockets) {
					var itemSize = fullHeight * 0.8 / nLayers * 0.5;

					overlay = {
						circ: {
							x: midx+margin + itemSize/2 + itemSize/3,
							y: margin+layerHeight*(i+0.5) + itemSize/2,
							radius: itemSize/2,
							fill: danger.pockets.fill
						},
						textFore: danger.pockets.number == 5 ? 'white' : 'black',
						text: "P"
					};
				}

				if(top) {
					polys.push({
						points: [
							[midx+margin,margin],
							[midx+margin+layerWidthUnit,layerHeight+margin],
							[midx+margin-layerWidthUnit,layerHeight+margin]
						],
						fill: danger.fill,
						centre: [midx+margin, margin+layerHeight*(i+0.5)],
						text: String(danger.number),
						textFore: danger.number == 5 ? 'white' : 'black',
						overlay: overlay
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
						textFore: danger.number == 5 ? 'white' : 'black',
						overlay: overlay
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

				// for pockets indicator
				if(poly.overlay) {
					var circ = poly.overlay.circ;

					var style = 'fill:' + circ.fill + '; opacity: 1.0; stroke:black; stroke-width:0.4';

					appendChild(svg,
						/*makeSVG('rect', {
							'x': rect.x, 'y': rect.y,
							'width': rect.width, 'height': rect.height,
							'style': style
						})*/
						makeSVG('circle', {
							'cx': circ.x, 'cy': circ.y,
							'r': circ.radius,
							'style': style
						})
					);

					appendChild(svg,
						makeSVG('text', {
							'x': circ.x,
							'y': circ.y,
							'text-anchor': 'middle',
							'style': 'dominant-baseline:central; font-size: 40%; stroke-width:0.6; stroke: ' + poly.overlay.textFore + '; fill: ' + poly.overlay.textFore
						}, String(poly.overlay.text))
					);
				}

			}


			// TODO: support elevation indications?
		},

		drawLegend: function(svg, config) {
			console.log(['drawLegend', svg, config]);

			var nItems = 5 + (config.showPockets ? 1 : 0);

			var rects = [];

			var xmax = 150, ymax = 100, margin = 10;

			setContainerSize(svg, 3, 2, '10em');
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

			setContainerSize(svg, 2, 1, '10em');
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