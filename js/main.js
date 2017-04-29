/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2017, Codrops
 * http://www.codrops.com
 */
;(function(window) {

	'use strict';

	// From https://davidwalsh.name/javascript-debounce-function.
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	// Returns a function, that, when invoked, will only be triggered at most once
	// during a given window of time. Normally, the throttled function will run
	// as much as it can, without ever going more than once per `wait` duration;
	// but if you'd like to disable the execution on the leading edge, pass
	// `{leading: false}`. To disable execution on the trailing edge, ditto.
	function throttle(func, wait, options) {
	  var context, args, result;
	  var timeout = null;
	  var previous = 0;
	  if (!options) options = {};
	  var later = function() {
	    previous = options.leading === false ? 0 : Date.now();
	    timeout = null;
	    result = func.apply(context, args);
	    if (!timeout) context = args = null;
	  };
	  return function() {
	    var now = Date.now();
	    if (!previous && options.leading === false) previous = now;
	    var remaining = wait - (now - previous);
	    context = this;
	    args = arguments;
	    if (remaining <= 0 || remaining > wait) {
	      if (timeout) {
	        clearTimeout(timeout);
	        timeout = null;
	      }
	      previous = now;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    } else if (!timeout && options.trailing !== false) {
	      timeout = setTimeout(later, remaining);
	    }
	    return result;
	  };
	};

	// from http://www.quirksmode.org/js/events_properties.html#position
	function getMousePos(e) {
		var posx = 0;
		var posy = 0;
		if (!e) var e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
		}
		return {
			x : posx,
			y : posy
		}
	}

	var DOM = {};
	// The loader.
	DOM.loader = document.querySelector('.overlay--loader');
	// The room wrapper. This will be the element to be transformed in order to move around.
	DOM.scroller = document.querySelector('.container > .scroller');
	// The rooms.
	DOM.rooms = [].slice.call(DOM.scroller.querySelectorAll('.room'));
	// The content wrapper.
	DOM.content = document.querySelector('.content');
	// Rooms navigation controls.
	DOM.nav = {
		leftCtrl : DOM.content.querySelector('nav > .btn--nav-left'),
		rightCtrl : DOM.content.querySelector('nav > .btn--nav-right')
	};
	// Content slides.
	DOM.slides = [].slice.call(DOM.content.querySelectorAll('.slides > .slide'));
	// The off canvas menu button.
	DOM.menuCtrl = DOM.content.querySelector('.btn--menu');
	// The menu overlay.
	DOM.menuOverlay = DOM.content.querySelector('.overlay--menu');
	// The menu items
	DOM.menuItems = DOM.menuOverlay.querySelectorAll('.menu > .menu__item');
	// The info button.
	DOM.infoCtrl = DOM.content.querySelector('.btn--info');
	// The info overlay.
	DOM.infoOverlay = DOM.content.querySelector('.overlay--info');
	// The info text.
	DOM.infoText = DOM.infoOverlay.querySelector('.info');

	var	currentRoom = 0,
		// Total number of rooms.
		totalRooms = DOM.rooms.length,
		// Initial transform.
		initTransform = { translateX : 0, translateY : 0, translateZ : '500px', rotateX : 0, rotateY : 0, rotateZ : 0 },
		// Reset transform.
		resetTransform = { translateX : 0, translateY : 0, translateZ : 0, rotateX : 0, rotateY : 0, rotateZ : 0 },
		// View from top.
		menuTransform = { translateX : 0, translateY : '150%', translateZ : 0, rotateX : '15deg', rotateY : 0, rotateZ : 0 },
		menuTransform = { translateX : 0, translateY : '50%', translateZ : 0, rotateX : '-10deg', rotateY : 0, rotateZ : 0 },
		// Info view transform.
		infoTransform = { translateX : 0, translateY : 0, translateZ : '200px', rotateX : '2deg', rotateY : 0, rotateZ : '4deg' },
		// Room initial moving transition.
		initTransition = { speed: '0.9s', easing: 'ease' },
		// Room moving transition.
		roomTransition = { speed: '0.4s', easing: 'ease' },
		// View from top transition.
		menuTransition = { speed: '1.5s', easing: 'cubic-bezier(0.2,1,0.3,1)' },
		// Info transition.
		infoTransition = { speed: '15s', easing: 'cubic-bezier(0.3,1,0.3,1)' },
		// Tilt transition
		tiltTransition = { speed: '0.2s', easing: 'ease-out' },
		tilt = false,
		// How much to rotate when the mouse moves.
		tiltRotation = {
			rotateX : 1, // a relative rotation of -1deg to 1deg on the x-axis
			rotateY : -3  // a relative rotation of -3deg to 3deg on the y-axis
		},
		// Transition end event handler.
		onEndTransition = function(el, callback) {
			var onEndCallbackFn = function(ev) {
				this.removeEventListener('transitionend', onEndCallbackFn);
				if( callback && typeof callback === 'function' ) { callback.call(); }
			};
			el.addEventListener('transitionend', onEndCallbackFn);
		},
		// Window sizes.
		win = {width: window.innerWidth, height: window.innerHeight},
		// Check if moving inside the room and check if navigating.
		isMoving, isNavigating;

	function init() {
		// Move into the current room.
		move({transition: initTransition, transform: initTransform}).then(function() {
			initTilt();
		});
		// Animate the current slide in.
		showSlide(100);
		// Init/Bind events.
		initEvents();
	}

	function initTilt() {
		applyRoomTransition(tiltTransition);
		tilt = true;
	}

	function removeTilt() {
		tilt = false;
	}

	function move(opts) {
		return new Promise(function(resolve, reject) {
			if( isMoving && !opts.stopTransition ) {
				return false;
			}
			isMoving = true;

			if( opts.transition ) {
				applyRoomTransition(opts.transition);
			}

			if( opts.transform ) {
				applyRoomTransform(opts.transform);
				var onEndFn = function() {
					isMoving = false;
					resolve();
				};
				onEndTransition(DOM.scroller, onEndFn);
			}
			else {
				resolve();
			}

		});
	}

	function initEvents() {
		// Mousemove event / Tilt functionality.
		// var onMouseMoveFn = function(ev) {
		// 		requestAnimationFrame(function() {
		// 			if( !tilt ) return false;
		//
		//
		// 			var mousepos = getMousePos(ev),
		// 				// transform values
		// 				rotX = tiltRotation.rotateX ? initTransform.rotateX -  (2 * tiltRotation.rotateX / win.height * mousepos.y - tiltRotation.rotateX) : 0,
		// 				rotY = tiltRotation.rotateY ? initTransform.rotateY -  (2 * tiltRotation.rotateY / win.width * mousepos.x - tiltRotation.rotateY) : 0;
		//
		// 			// apply transform
		// 			applyRoomTransform({
		// 				'translateX' : initTransform.translateX,
		// 				'translateY' : initTransform.translateY,
		// 				'translateZ' : initTransform.translateZ,
		// 				'rotateX' : rotX + 'deg',
		// 				'rotateY' : rotY + 'deg',
		// 				'rotateZ' : initTransform.rotateZ
		// 			});
		// 		});
		// 	},
		// 	// Window resize.
		// 	debounceResizeFn = debounce(function() {
		// 		win = {width: window.innerWidth, height: window.innerHeight};
		// 	}, 10);

		// window.ondevicemotion = throttle(function(event) {
		// 	var accelerationX = event.accelerationIncludingGravity.x.toFixed(1);
		// 	var accelerationY = event.accelerationIncludingGravity.y.toFixed(1);
		// 	// apply transform
		// 	applyRoomTransform({
		// 		'translateX' : initTransform.translateX*2,
		// 		'translateY' : initTransform.translateY/2,
		// 		'translateZ' : initTransform.translateZ,
		// 		'rotateX' : accelerationY + 'deg',
		// 		'rotateY' : accelerationX + 'deg',
		// 		'rotateZ' : initTransform.rotateZ
		// 	});
		// }, 100);

		// document.addEventListener('mousemove', onMouseMoveFn);
		// document.addEventListener('touchmove', function(e) {
		// 	var context, args;
		// 	e.preventDefault()
		// 	onMouseMoveFn(e)
		// });
		// window.addEventListener('resize', debounceResizeFn);

		// Room navigation.
		// var onNavigatePrevFn = function() { navigate('prev'); },
		// 	onNavigateNextFn = function() { navigate('next'); };
		//
		// DOM.nav.leftCtrl.addEventListener('click', onNavigatePrevFn);
		// DOM.nav.rightCtrl.addEventListener('click', onNavigateNextFn);
	}

	function applyRoomTransform(transform) {
		DOM.scroller.style.transform = 'translate3d(' + transform.translateX + ', ' + transform.translateY + ', ' + transform.translateZ + ') ' +
									   'rotate3d(1,0,0,' + transform.rotateX + ') rotate3d(0,1,0,' + transform.rotateY + ') rotate3d(0,0,1,' + transform.rotateZ + ')';
	}

	function applyRoomTransition(transition) {
		DOM.scroller.style.transition = transition === 'none' ? transition : 'transform ' + transition.speed + ' ' + transition.easing;
	}

	function toggleSlide(dir, delay) {
		var slide = DOM.slides[currentRoom],
			// Slide's name.
			name = slide.querySelector('.slide__name'),
			// Slide's title and date elements.
			title = slide.querySelector('.slide__title'),
			date = slide.querySelector('.slide__date');

		delay = delay !== undefined ? delay : 0;

		anime.remove([name, title, date]);
		var animeOpts = {
			targets: [name, title, date],
			duration: dir === 'in' ? 400 : 400,
			//delay: 0,//dir === 'in' ? 150 : 0,
			delay: function(t, i, c) {
				return delay + 75+i*75;
			},
			easing: [0.25,0.1,0.25,1],
			opacity: {
				value: dir === 'in' ? [0,1] : [1,0],
				duration: dir === 'in' ? 550 : 250
			},
			translateY: function(t, i) {
				return dir === 'in' ? [150,0] : [0,-150];
			}
		};
		if( dir === 'in' ) {
			animeOpts.begin = function() {
				slide.classList.add('slide--current');
			};
		}
		else {
			animeOpts.complete = function() {
				slide.classList.remove('slide--current');
			};
		}
		anime(animeOpts);
	}

	function showSlide(delay) {
		toggleSlide('in', delay);
	}

	function hideSlide(delay) {
		toggleSlide('out', delay);
	}

	// Preload all the images.
	imagesLoaded(DOM.scroller, function() {
		var extradelay = 1000;
		// Slide out loader.
		anime({
			targets: DOM.loader,
			duration: 600,
			easing: 'easeInOutCubic',
			delay: extradelay,
			translateY: '-100%',
			begin: function() {
				init();
			},
			complete: function() {
				DOM.loader.classList.remove('overlay--active');
			}
		});
	});
})(window);
