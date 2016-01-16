var AvGraphics = (function() {

	// Utility function: DOM empty wrapper
	function removeChildren(parent) {
		parent.innerHTML = '';
	}

	// Utility function: DOM append wrapper
	function appendChild(parent, child) {
		parent.appendChild(child);
	}

	// Utility function: resize the given svg element to match aspect. if 0x0, use default height as basis for size.
	function setContainerSize(svg, aspectRatio, defaultHeightStyle) {
		var rect = svg.getBoundingClientRect();

		if(rect.width > rect.height) {
			// set height by aspect

			var height = rect.width / aspectRatio;
			svg.style.height = height+'px';
		}
		else {
			if(rect.height === 0) {
				// set height to default
				svg.style.height = defaultHeightStyle;
			}

			// set width by aspect
			var width = rect.height * aspectRatio;
			svg.style.width = width+'px';
		}
	}

	// Utility function: Initialcap
	function initialCap(x) {
		return x[0].toUpperCase() + x.substring(1);
	}

	// Utility function: build an svg element with given name, attributes and data
	function makeSVG(tag, attrs, data) {
		var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
		for (var k in attrs) {
			el.setAttribute(k, attrs[k]);
		}
		if(data) {
			el.appendChild( document.createTextNode(data) );
		}
		return el;
	}

	
	return {
		// shared config for the whole class; if updating this config, also update EXAMPLES.md
		config: {
			colors: {
				low: 'lime',
				moderate: 'yellow',
				considerable: 'orange',
				high: 'red',
				extreme: 'black',

				selected: 'grey',
				unselected: 'white',

				activeSelection: 'pink'
			}
		},

		// apply new config settings
		configure: function(newConfig) {
			if(newConfig.colors) {
				for(var x in newConfig.colors) {
					this.config.colors[x] = newConfig.colors[x];
				}
			}
		},


		// expand a {danger: 3} object into useful attributes
		getDangerInfo: function(data) {
			var CONVENTION = [
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

			var info = CONVENTION[ data.danger - 1 ];

			info.pockets = (data.danger < 5 && data.pockets) ? CONVENTION[ data.danger ] : false;

			return info;
		},


		/******************************************************************
			DANGER PYRAMID
		 ******************************************************************/

		drawPyramid: function(svg, options) {
			//console.log(['drawPyramid', svg, options]);

			var data = options.data;

			var nLayers = data.length;

			if(nLayers < 1) {
				return;
			}

			var polys = [];

			var aspect = options.aspect || 1/1;			

			var xmax = 100*aspect, ymax = 100, margin = 10;

			setContainerSize(svg, aspect, '10em');
			svg.setAttribute('viewBox', '0 0 '+xmax+' '+ymax);

			var fullHeight = ymax - margin*2;
			var fullWidth = xmax - margin*2;
			var layerHeight = fullHeight / nLayers;
			var layerWidthUnit = fullWidth / nLayers / 2;

			var midx = fullWidth / 2;

			for(var i = 0; i < data.length; i++) {
				var danger = this.getDangerInfo(data[i]);

				var top = (i === 0);

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
			}

			removeChildren(svg);

			for(var j in polys) {
				var poly = polys[j];

				var points = poly.points
					.map(function(x) {
						return x.join(',');
					})
					.join(' ');

				appendChild(svg,
					makeSVG('polygon', {
						'points': points,
						'style': 'fill:' + poly.fill + '; stroke:black; stroke-width:1'
					})
				);

				appendChild(svg,
					makeSVG('text', {
						'x': poly.centre[0],
						'y': poly.centre[1] + layerHeight/15,
						'text-anchor': 'middle',
						'style': 'dominant-baseline:middle; font-size: 60%; stroke-width:0.6; stroke: ' + poly.textFore + '; fill: ' + poly.textFore
					}, poly.text)
				);

				// for pockets indicator
				if(poly.overlay) {
					var circ = poly.overlay.circ;

					appendChild(svg,
						makeSVG('circle', {
							'cx': circ.x, 'cy': circ.y,
							'r': circ.radius,
							'style': 'fill:' + circ.fill + '; opacity: 1.0; stroke:black; stroke-width:0.4'
						})
					);

					appendChild(svg,
						makeSVG('text', {
							'x': circ.x,
							'y': circ.y,
							'text-anchor': 'middle',
							'style': 'dominant-baseline:middle; font-size: 40%; stroke-width:0.5; stroke: ' + poly.overlay.textFore + '; fill: ' + poly.overlay.textFore
						}, String(poly.overlay.text))
					);
				}
			}
		},


		/******************************************************************
			DANGER LEGEND
		 ******************************************************************/

		drawDangerLegend: function(svg, options) {
			//console.log(['drawDangerLegend', svg, options]);

			var nItems = 5 + (options.showPockets ? 1 : 0);

			var rects = [];

			var aspect = options.aspect || 3/2;

			var xmax = 100*aspect, ymax = 100, margin = 10;

			setContainerSize(svg, aspect, '10em');
			svg.setAttribute('viewBox', '0 0 '+xmax+' '+ymax);

			var fullHeight = ymax - margin*2;
			var itemSize = fullHeight * 0.8 / nItems;
			var itemGap = fullHeight * 0.2 / (nItems-1);

			for(var i = 1; i <= nItems; i++) {
				var key = {danger: 6-i};
				var danger = i < 6 ? this.getDangerInfo(key) : {};

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

			for(var j in rects) {
				var rect = rects[j];

				appendChild(svg,
					makeSVG('rect', {
						'x': rect.x, 'y': rect.y,
						'width': rect.width, 'height': rect.height,
						'style': 'fill:' + rect.fill + '; stroke:black; stroke-width:1'
					})
				);

				appendChild(svg,
					makeSVG('text', {
						'x': rect.x + rect.width / 2,
						'y': rect.y + rect.height / 2,
						'text-anchor': 'middle',
						'style': 'dominant-baseline:middle; font-size: 40%; stroke-width:0.5; stroke: ' + rect.textFore + '; fill: ' + rect.textFore
					}, String(rect.text))
				);

				appendChild(svg,
					makeSVG('text', {
						'x': rect.labelPos[0],
						'y': rect.labelPos[1] + rect.height/15,
						//'text-anchor': 'middle',
						'style': 'dominant-baseline:middle; font-size: 50%;'
					}, initialCap(rect.labelText))
				);
			}
		},


		/******************************************************************
			ROSE
		 ******************************************************************/

		drawRose: function(svg, options) {
			//console.log(['drawRose', svg, options]);

			var emptyDefault = (options.type && options.type == 'mono') ? 0 : 1;
			var emptyLevel = {
				"values": {
					"nw": emptyDefault, "n": emptyDefault, "ne": emptyDefault,
					"w":  emptyDefault,                    "e":  emptyDefault,
					"sw": emptyDefault, "s": emptyDefault, "se": emptyDefault
				}
			};
			var emptyData = [emptyLevel, emptyLevel, emptyLevel];

			if(typeof(options.type) === 'undefined') { options.type = 'danger'; }

			var data = options.data || emptyData;

			var nLayers = data.length;

			if(nLayers < 1) {
				return;
			}

			var polys = [], texts = [], rects = [];

			var aspect = options.aspect || 1/1;

			var xmax = 100*aspect, ymax = 100, margin = 10, textMargin = 10;

			setContainerSize(svg, aspect, '10em');
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


			for(var i = 0; i < data.length; i++) {
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

					var points = [
						toc(outer0, h0),
						toc(outer1, h1),
						toc(outer0, h2)
					];

					if(i === 0) {
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

					if(options.type && options.type == 'mono') {
						polys.push({
							points: points,
							fill: (level.values[heading] ? this.config.colors.selected : this.config.colors.unselected),

							number: level.values[heading] ? 1 : 0,
							elevation: i, heading: heading
						});
					}
					else {
						var danger = this.getDangerInfo({danger: level.values[heading]});

						polys.push({
							points: points,
							fill: danger.fill,

							number: danger.number,
							elevation: i, heading: heading
						});
					}
				}
			}

			for(var j in headings) {
				var heading = headings[j];

				var h1 = j * arc;
				if(h1 >= 360) h1 -= 360;

				texts.push({
					centre: toc(maxRadius + depth*2/3, h1),
					text: heading
				});
			}

			var elex = margin + roseSize + margin, eley = margin + textMargin;
			var eleWidth = maxRadius*3/2;
			var eleHeight = maxRadius;
			var eleMid = elex + eleWidth/2;

			removeChildren(svg);

			for(var i in polys) {
				var poly = polys[i];

				var points = poly.points.map(function(x) {
						return x
							.map(function(q) { return parseInt(q); })
							.join(',');
					})
					.join(' ');

				var element = makeSVG('polygon', {
					'points': points,
					'style': 'fill:' + poly.fill + '; stroke:black; stroke-width:1',
					'data-selected': 'false',
					'data-rose-type': (options.type == 'mono' ? 'mono' : 'default'),
					'data-current-value': poly.number,
					'data-elevation': poly.elevation,
					'data-heading': poly.heading
				});

				if(typeof(options.build) !== 'undefined') {
					var $this = this;
	
					element.addEventListener("click", function(event) {
						var poly = event.target;

						var roseType = poly.getAttribute('data-rose-type');
						var currentValue = poly.getAttribute('data-current-value');

						if(options.type === 'mono') {
							// toggle process (no selection) for mono rose

							if(currentValue == 0) {
								poly.setAttribute('data-current-value', '1');
								poly.style.fill = $this.config.colors.selected;
							}
							else {
								poly.setAttribute('data-current-value', '0');
								poly.style.fill = $this.config.colors.unselected;
							}

							// obtain complete rose data & notify
							var data = $this.getRoseData(poly.parentNode);
							options.build.onChange(data);
						}
						else {
							// selection process for danger rose

							var selected = poly.getAttribute('data-selected') == 'true';
							selected = !selected;

							poly.setAttribute('data-selected', (selected ? 'true' : 'false'));

							if(selected) {
								poly.style.fill = $this.config.colors.activeSelection;
							}
							else {
								var danger = $this.getDangerInfo({'danger': currentValue});
								var col = danger.fill;
								poly.style.fill = col;
							}

							var peers = $this.getRoseSelectedChildren(poly.parentNode);

							options.build.onSelection(peers.length > 0, options.type, function(valueToApply) {
								if(valueToApply < 1 || valueToApply > 5) {
									return;
								}

								var info = $this.getDangerInfo({danger: valueToApply});

								for(var pi = 0; pi < peers.length; pi++) {
									var peer = peers[pi];

									// set new value & fill colour
									peer.setAttribute('data-current-value', valueToApply);
									peer.style.fill = info.fill;

									// clear selection
									peer.setAttribute('data-selected', 'false');
								}

								// obtain complete rose data & notify
								var data = $this.getRoseData(poly.parentNode);
								options.build.onChange(data);
							});
						}
					});
				}

				appendChild(svg, element);
			}

			for(var i in texts) {
				var text = texts[i];

				appendChild(svg,
					makeSVG('text', {
						'x': text.centre[0],
						'y': text.centre[1],
						'text-anchor': 'middle',
						'style': 'dominant-baseline: middle; font-size: 40%; text-transform: uppercase;'
					}, text.text)
				);
			}
		},

		getRoseSelectedChildren: function(parent) {
			var peers = [];

			for(var i = 0; i < parent.childNodes.length; i++) {
				var peer = parent.childNodes[i];
				var sel = peer.getAttribute('data-selected');
				if(sel == 'true') {
					peers.push(peer);
				}
			}

			return peers;
		},

		getRoseData: function(parent) {
			var data = [];

			for(var i = 0; i < parent.childNodes.length; i++) {
				var node = parent.childNodes[i];

				var elevation = parseInt( node.getAttribute('data-elevation') );
				var heading = node.getAttribute('data-heading');
				var value = parseInt( node.getAttribute('data-current-value') );

				if(heading && heading.length > 0 && elevation >= 0 && value >= 0) {
					while(data.length < elevation + 1) {
						data[data.length] = {"values": {}};
					}

					data[parseInt(elevation)].values[heading] = parseInt(value);
				}
			}

			return data;
		},


		/******************************************************************
			ELEVATION LEGEND
		 ******************************************************************/

		drawElevationLegend: function(svg, options) {
			//console.log(['drawElevationLegend', svg, options]);

			var data = options.data;

			var nLayers = data.length;

			if(nLayers < 1) {
				return;
			}

			var rects = [];

			var aspect = options.aspect || 2/1;

			var xmax = 100*aspect, ymax = 100, margin = 20;

			setContainerSize(svg, aspect, '5em');
			svg.setAttribute('viewBox', '0 0 '+xmax+' '+ymax);

			var fullHeight = ymax - margin*2;
			var fullWidth = xmax - margin*2;
			var depth = fullHeight / nLayers;
			var textRight = xmax - margin;

			var eleWidth = fullWidth/2;
			var eleHeight = fullHeight;
			var eleMid = margin + eleWidth/2;

			for(var i = 0; i < data.length; i++) {
				var title = data[i].label;

				var width = eleWidth * (i+1)/nLayers;
				var height = eleHeight / nLayers;
				var offx = eleMid - width/2;
				var offy = margin + i*height;

				rects.push({
					x: offx, y: offy,
					width: width, height: height,
					fill: 'white',
					labelY: offy+height/2,
					labelText: title
				});
			}

			removeChildren(svg);

			for(var i in rects) {
				var rect = rects[i];

				appendChild(svg,
					makeSVG('rect', {
						'x': rect.x, 'y': rect.y,
						'width': rect.width, 'height': rect.height,
						'style': 'fill:' + rect.fill + '; stroke:black; stroke-width:1'
					})
				);

				appendChild(svg,
					makeSVG('text', {
						'y': rect.labelY,
						'x': textRight,
						'text-anchor': 'end',
						'style': 'dominant-baseline: middle; font-size: 80%;'
					}, initialCap(rect.labelText))
				);
			}
		},


		/******************************************************************
			VERTICAL SCALE
		 ******************************************************************/

		drawScale: function(svg, options) {
			//console.log(['drawScale', svg, options]);

			var nLayers = options.labels.length;

			if(nLayers < 1) {
				return;
			}

			var texts = [], polys = [];

			var aspect = options.aspect || 1/1;

			var xmax = 100*aspect, ymax = 100, margin = 10, textMargin = 5;

			setContainerSize(svg, aspect, '10em');
			svg.setAttribute('viewBox', '0 0 '+xmax+' '+ymax);

			var fullHeight = ymax - margin*2;
			var fullWidth = xmax - margin*2;
			var layerHeight = fullHeight / nLayers;
			var markerWidth = 10;

			var sel = options.values;

			if(sel.length > 1 && sel[0] == sel[1]) {
				sel = [sel[0]];
			}

			for(var i = 0; i < options.labels.length; i++) {
				var label = options.labels[i];

				var offx = margin + markerWidth + textMargin;
				var offy = margin + (i+0.5) * layerHeight;

				var highlighted = sel.length > 1 ? (sel[0] <= i && sel[1] >= i) : (i === sel[0]);

				texts.push({
					x: offx, y: offy,
					highlighted: highlighted,
					text: label
				});
			}

			if(sel.length === 1) {
				var top = margin + sel[0] * layerHeight;

				var pad = layerHeight * 0.2;

				polys.push({
					points: [
						[margin, top + pad],
						[margin, top + layerHeight - pad],
						[margin + markerWidth, top + layerHeight/2]
					],
					fill: this.config.colors.selected
				});
			}
			else if(sel.length === 2) {
				var top = margin + sel[0] * layerHeight;
				var bot = margin + (sel[1]+1) * layerHeight;
				var lineWidth = 2;

				var markerHeight = Math.min(Math.max(layerHeight, 5), 10);
				var pad = (layerHeight - markerHeight)/2;

				polys.push({
					points: [
						[margin, top + pad],
						[margin + markerWidth, top + pad],
						[margin + lineWidth, top + layerHeight - pad],
						[margin + lineWidth, bot - layerHeight + pad],
						[margin + markerWidth, bot - pad],
						[margin, bot - pad]
					],
					fill: this.config.colors.selected
				});
			}

			removeChildren(svg);

			for(var i in texts) {
				var txt = texts[i];

				var weight = txt.highlighted ? 0.6 : 0;

				appendChild(svg,
					makeSVG('text', {
						'x': txt.x,
						'y': txt.y,
						'style': 'dominant-baseline:middle; font-size: 60%; stroke-width: ' + weight + '; stroke: black'
					}, txt.text)
				);
			}

			for(var i in polys) {
				var poly = polys[i];

				var points = poly.points
					.map(function(x) {
						return x.join(',');
					})
					.join(' ');

				appendChild(svg,
					makeSVG('polygon', {
						'points': points,
						'style': 'fill:' + poly.fill //+ '; stroke:black; stroke-width:1'
					})
				);
			}
		},


		/******************************************************************
			TREND ARROW
		 ******************************************************************/

		drawTrend: function(svg, options) {
			//console.log(['drawTrend', svg, options]);

			var aspect = options.aspect || 1/1;

			var xmax = 100*aspect, ymax = 100, margin = 10;

			setContainerSize(svg, aspect, '10em');
			svg.setAttribute('viewBox', '0 0 '+xmax+' '+ymax);

			var middle = ymax / 2;
			var width = xmax - margin*2;
			var thick = 2, headLength = width * 0.2, headWidth = thick * 4;
			var angle = options.data.angle;


			var circ = {
				x: margin,
				y: middle,
				radius: 2 * thick
			};

			var arrow = {
				points: [
					[margin, middle - thick/2],
					[margin + width - headLength, middle - thick/2],
					[margin + width - headLength, middle - headWidth/2],
					[margin + width, middle],
					[margin + width - headLength, middle + headWidth/2],
					[margin + width - headLength, middle + thick/2],
					[margin, middle + thick/2]
				],
				rotate: -angle
			};


			removeChildren(svg);

			// arrow:

			var points = arrow.points
				.map(function(x) {
					return x.join(',');
				})
				.join(' ');

			appendChild(svg,
				makeSVG('polygon', {
					'points': points,
					'style': 'fill:' + this.config.colors.selected,
					'transform': 'rotate(' + arrow.rotate + ' ' + margin + ' ' + middle + ')'
				})
			);

			// dot:

			appendChild(svg,
				makeSVG('circle', {
					'cx': circ.x, 'cy': circ.y,
					'r': circ.radius,
					'style': 'fill:' + circ.fill + '; opacity: 1.0;'// stroke:black; stroke-width:0.4'
				})
			);
		},

	};
})();