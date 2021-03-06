/*
 * @class AnimatedSector
 * @aka L.AnimatedSector
 * @inherits L.Circle
 *
 * A class for drawing animated sector on map. Extends `Circle`.
 *
 * @example
 *
 * ```js

 * L.AnimatedSector([50.5, 30.5], {radius: 500}).addTo(map);
 * ```
 */

L.AnimatedSector = L.Circle.extend({

	options: {
		pixelRadius: true,
		fill: true,
		fillColor: '#004CB3',
		fillOpacity: 0.2,
		fillGradient: true,
		border: 0,
		borderColor: '#dddddd',
		borderDashLine: false,
		directionAngle: 0,
		viewAngleRange: 140,
	},
	
	initialize: function(latlng, options, legacyOptions) {
		L.Circle.prototype.initialize.call(this, latlng, options, legacyOptions);
		options = L.Util.setOptions(this, options);
		this._timer_pendulum = null;
	},

	_updatePath: function () {
		this._renderer._updateSector(this);
	},

	pendulum: function(step, minAngle, maxAngle, interval) {
		if ( this._timer_pendulum !== null ) {
			clearInterval(this._timer_pendulum);
		}

		var angle = this.options.directionAngle;
		var trend = 1;
		var self = this;
		this._timer_pendulum = setInterval(function() {
			if (angle >= maxAngle) trend = -1;
			if (angle <= minAngle) trend = 1;
			angle +=  trend * step;
			self.setStyle({
				directionAngle: angle
			});
		}, (interval || 200));
	},

	stopPendulum: function() {
		if (this._timer_pendulum) {
			clearInterval(this._timer_pendulum);
		}
	},

	spin: function(step, interval) {
		this.pendulum(step, this.options.directionAngle, Number.MAX_VALUE, interval);
	},

	stopSpin: function() {
		this.stopPendulum();	
	},
});

L.Canvas.prototype._updateSector = function(layer) {
	if (!this._drawing || layer._empty()) { return; }
	
	// if using this project _point, the center of circle would change according with the value of radius,
	// the minor offset of center is unobservable for circle, but is obvious when serveral sectors overlap with same latlng center.
	// so, we use the original center without project
	// var p = layer._point;
	var p = layer._map.latLngToLayerPoint(layer._latlng);
	var ctx = this._ctx;
	var ops = layer.options;
	var r = Math.max(Math.round(layer._radius), 1);
	var s = (Math.max(Math.round(layer._radiusY), 1) || r) / r;

	// new version leaflet change _drawnLayers to _layers
	//this._drawnLayers[layer._leaflet_id] = layer;
	if (this._drawnLayers) {
		this._drawnLayers[layer._leaflet_id] = layer;
	} else {
		this._layers[layer._leaflet_id] = layer;
	}

	ctx.save();
	if (s !== 1) ctx.scale(1, s);	// must take the Projection into account

	ctx.beginPath();
	ctx.translate(p.x, p.y / s);
	ctx.moveTo(0, 0);
	ctx.arc(0, 0, r,
		-(ops.directionAngle - ops.viewAngleRange / 2.0) * Math.PI / 180,
		-(ops.directionAngle + ops.viewAngleRange / 2.0) * Math.PI / 180, true);
	ctx.closePath();

	if (ops.fill) {
		if (ops.fillGradient) {
			var fs = ctx.createRadialGradient(0, 0, Math.floor(r/20.0), 0, 0, r);
			fs.addColorStop(0, ops.fillColor);
			fs.addColorStop(1, '#ffffff');
			ctx.fillStyle = fs;
		} else {
			ctx.fillStyle = ops.fillColor;
		}
		ctx.globalAlpha = ops.fillOpacity;
		ctx.fill();
	} 

	if (ops.fillPattern && this._fillPattern) {
		this._fillPattern(ctx, layer);
	}

	if (ops.border > 0) {
		ctx.lineWidth = ops.border;
		ctx.strokeStyle = ops.borderColor;
		if (ops.borderDashLine) {	
			ctx.setLineDash( L.Util.isArray(ops.borderDashLine) ? ops.borderDashLine : [8,4]);
		}
		ctx.stroke();
	}

	ctx.restore();
	return ctx;
}

L.animatedSector = function (latlng, options, legacyOptions){
	return new L.AnimatedSector(latlng, options, legacyOptions);
};

L.sector = function (latlng, options, legacyOptions){
	return new L.AnimatedSector(latlng, options, legacyOptions);
};

