# Leaflet Animated Sector

This is a Leaflet plugin for drawing sector and animating it. Feedback appreciated !

## How can I use it?

The following code will create an sector on map, assuming a `Leaflet.Map` called `map`.

	var sector = L.animatedSector([30.661057, 104.081757], {
        radius: 500000,			// meters
        fillColor: '#ff0000',
        fillOpacity: 0.6,
        directionAngle: 90,		// the direction sector point to
        viewAngleRange: 90,		// the angle of sector
    })

	sector.addTo(_map); 


## How do I animate the sector ?

	/**
     * AnimatedSector.pendulum(angleStep, minAngle, maxAngle)
     *  angleStep: angle changes during every interval
     *  minAngle: the minimum angle of pendulum animation
     *  maxAngle: the maximum angle of pendulum animation
     */
    sector.pendulum(4, 30, 150);

	/**
	 * AnimatedSector.stopPendulum()
	 */
	sector.stopPendulum();


	/**
     * AnimatedSector.spin(angleStep)
     *  angleStep: angle changes during every interval
     */
	sector.spin(4);

	/**
	 * AnimatedSector.stopSpin()
	 */
    sector.stopSpin();

## How do I reset the sector's style ?

	/**
     * AnimatedSector.setStyle(options)
     */
	sector.setStyle({
		radius: 400000,
		fillColor: '#ffff00',
		fillOpacity: 0.4,
		fillGradient: true,
		viewAngleRange:100,
		border: 1,          
		borderColor: '#ff0000',
		borderDashLine: true
	});
	
