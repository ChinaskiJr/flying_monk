$(function() {

	/* SOUNDS */
	/* Music loop */
	var music = document.createElement('audio');
	music.setAttribute('src', 'sound/music/music.mp3');
	music.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);
	// Game sounds
	var hit = document.createElement('audio');
	var hitLong = document.createElement('audio');
	hit.setAttribute('src', 'sound/sounds/hit.mp3');
	hitLong.setAttribute('src', 'sound/sounds/hitLong.mp3');
	/* Game over scream */
	var gameOverSound = document.createElement('audio');
	gameOverSound.setAttribute('src', 'sound/sounds/gameOver.mp3');
	/* Sound on/off button */
	$('.soundButtonContainer').on('click', function() {
		if (parseInt($('.soundButton').css('margin-left')) != 0) {
			$('.soundButton').css('margin-left', 0);
		} else {
			$('.soundButton').css('margin-left', -32);
		}
		if (hit.volume != 0) {
			hit.volume = 0;
		} else {
			hit.volume = 1;
		}
		if (hitLong.volume != 0) {
			hitLong.volume = 0;
		} else {
			hitLong.volume = 1;
		} 
		if (gameOverSound.volume != 0) {
			gameOverSound.volume = 0;
		} else {
			gameOverSound.volume = 1;
		}
	});
	$('.musicButton').on('click', function() {
		if (parseInt($('.musicButton').css('margin-left')) != 0) {
			$('.musicButton').css('margin-left', 0);
		} else {
			$('.musicButton').css('margin-left', -32);
		}
		if (music.volume != 0) {
			music.volume = 0;
			musicMute = 1;
		} else {
			music.volume = 1;
			musicMute = 0;
		}
	});

	$('.startButton').one('click', function() {
	$('.welcome').css('display', 'none');

	/* Let's store some data */
	var lastPositionPillar;
	var areYouBlocked = 0;
	var areYouDead = 0;
	var isSkyMoving = 0;
	var speedGame = 100;
	var spacePressed = 0;
	var musicMute = 0;

	music.play();
	hit.play();
	hit.pause();
	hitLong.play();
	hitLong.pause();
	gameOverSound.play();
	gameOverSound.pause();
	/* global variables */
	// Desktop
	var 	screenWidth = parseInt($('.background').css('width'));
	var 	screenHeight = parseInt($('.background').css('height'));
	if (window.matchMedia("(min-width: 768px)").matches) {
		var 	monkHeight = 63.25;
	// Mobile
	} else {
		var 	monkHeight = screenHeight * 0.1;
		$('.monkContainer').css('width', monkHeight);
	}
	var 	count = 0;
	var 	monk = $('.monkSprite');
	
	/* LOOP ANIMATION */
	/* background animation */
	function skyIsMoving () {
		isSkyMoving = 1;
		$('.skyBackground').animate({left : '-=' + screenWidth}, {
			duration: 4000,
			easing: 'linear',
			complete: function() {
			$('.skyBackground:first').css('left', screenWidth);
			$('.skyBackground:nth-child(2)').css('left', 0);
			if (areYouDead != 1)
				skyIsMoving();
			else 
				isSkyMoving = 0;
			}
		});
	}
	/* Monk animation */
	// Reset interval1 at the end of the animation
	function monkIsJumping() {
		clearInterval(interval1);
		interval1 = null;
		monk.css('margin-left', -1 * (5 * monkHeight));	
	}
	function monkIsHurting() {
		clearInterval(interval1);
		interval1 = null;
		monk.css('margin-left', -1 * (4 * monkHeight));
		interval1 = setInterval(function() {monkIsAnimating(4);} , 200);
	}
	function monkIsAnimating(numImgs) {
		monk.css('margin-left', -1 * (count * monkHeight));
		count++;
		if (count === numImgs) {
			count = 0;
		}
	}
	/* PressSpace flash */
	function flash() {
		// Only on desktop
		if (window.matchMedia("(min-width: 768px)").matches) {
			$('.pressSpace').animate({opacity: 0}, {
				duration: 300,
				complete: function() {
					if (spacePressed === 0 && areYouDead === 0) {
						$('.pressSpace').animate({opacity: 1}, {
							duration: 300,
							complete: flash,
						});
					} else {
						$('.pressSpace').css('opacity', 0);
					}
				}
			});
		}
	}
	/* PILLARS STUFF */
	/* Pillars are coming : general function*/
	function setNewPillar() {
		var speedPillar = pillarsAreQuicker(timeStart);
		var pillar = $('.pillars:first').clone().appendTo('.pillarsContainer');
		/* Where does it comes ? 
		 * 2 chances on 3 that it will be 
		 * different from the previous
		 */
		if (lastPositionPillar === 0) {
			var pillarY = Math.ceil(Math.random() * 3);
			if (pillarY == 2 || pillarY == 3) {
				pillarY = 1;
			} else {
				pillarY = 0;
			}
		} else {
			var pillarY = Math.ceil(Math.random() * 3);
			if (pillarY == 2 || pillarY == 3) {
				pillarY = 0;
			} else {
				pillarY = 1;
			}
		}
		pillarY *= 370;
		// lastPositionPillar should be 0 or 370
		lastPositionPillar = pillarY;
		// Random height
		// for desktop
		if (window.matchMedia("(min-width: 768px)").matches) {
			if (pillarY === 0) {
				pillarY -= Math.random() * 250;
			} else {
				pillarY += Math.random() * 250;
			}
			pillar.css('left', 960);
			pillar.css('top', pillarY);
		// for mobile
		} else {
			if (pillarY === 0) {
				pillarY -= Math.random() * 34;
			} else {
				pillarY = 50 + Math.random() * 34;
			}
			pillar.css('left', '100vw');
			pillarY = pillarY + "vh";
			pillar.css('top', pillarY);	
		}
		// Stock the ID in array interval4 for clear it when game will be over
		helloPillar(pillar, speedPillar);
		pillarIsComing(pillar, pillarY, speedPillar);
	}		
	/* Display a pillar and destroy it when 'top' comes to 0*/
	function pillarIsComing(pillar, pillarY, speed, intervalPillar) {
		pillar.animate({left : 0}, speed, 'linear', function() {
			pillarX = parseInt($(this).css('left'));
			while (pillarX < 0) {
				$(this).css('left', pillarX);
				pillarX = parseInt($(this).css('left'));
			}
			pillar.remove();
			var score = parseInt($('.score').html());
			score+=5;
			$('.score').html(score);
		});
	}
	/* More you survive... more god is angry
	Deal with speed of pillars */
	var timeStart = $.now();
	function pillarsAreQuicker() {
		var timeNow = $.now();
		var timeSinceTheBeggining = timeNow - timeStart;
		// pillarsSpeed is the duration (ms) for a pillar to go through the screen
		var pillarsSpeed = 4500 - (timeSinceTheBeggining / 20);
		if (pillarsSpeed < 1000) {
			pillarsSpeed = 1000;
		}
		return parseInt(pillarsSpeed);
	}
	/* Deal with pace of pillars */
	function pillarsAreNumerous() {
		var timeNow = $.now();
		var timeSinceTheBeggining = timeNow - timeStart;
		var pillarsPace = parseInt(2000 - (timeSinceTheBeggining / 35));
		if (pillarsPace < 400) {
			pillarsPace = 400;
		}
		if (areYouDead != 1) {
			setNewPillar();
			setTimeout(function() {pillarsAreNumerous();}, pillarsPace);
		}
	}
	/* COLLISION */ 
	function helloPillar (pillar, speedPillar) {
		var monkY = parseInt($('.monkContainer').css('top'));
		var monkX = parseInt($('.monkContainer').css('left'));
		var pillarY = parseInt(pillar.css('top'));
		var pillarX = parseInt(pillar.css('left'));
		var speedMonk = pillarX / (screenWidth / speedPillar);
		speedMonk -= Math.abs(($('.monkContainer').width() / (screenWidth / speedPillar)));
		speedMonk *= 0.7;
		// Meet a pillar from the face
		if (
		monkY < (pillarY + pillar.height())
		&& monkY + monkHeight > pillarY
		&& monkX < pillarX
		&& monkX + monkHeight > pillarX) {
			hitLong.play();
			monkIsHurting();
			$('.monkContainer').stop();
			$('.monkContainer').animate({left: 0},{
				duration: speedMonk,
				easing: 'linear',
				queue: false,
			});	
			$('.monkContainer').animate({top: monkY + 20},{ 
				duration: 35,
				easing: 'linear',
				queue: false,
				complete: function() {
					monkFalling();
				}
			});
			areYouBlocked = 1;
		} else 
			areYouBlocked = 0;
		// Meet a pillar from behind
		if (
		monkY < pillarY + pillar.height() - 10
		&& monkY > pillarY - monkHeight
		&& monkX < pillarX + pillar.width()
		&& monkX > pillarX) {
			monkIsHurting();
			hit.play();
			if (window.matchMedia("(min-width: 768px)").matches) {
				modif = 0;
			} else {
				modif = 30;
			}
			$('.monkContainer').stop();
			$('.monkContainer').animate({left: monkX + 40 - modif},{ 
				duration: 50,
				easing: 'linear',
				queue: false,
				complete: function() {
					monkFalling();
				}
			});
		}
		// Meet a pillard from monk's top
		if (
		monkY >= pillarY + pillar.height() - 10
		&& monkY < pillarY + pillar.height()
		&& monkX > pillarX
		&& monkX < pillarX + pillar.width()
		&& pillarX > 0) {
			monkIsHurting();
			hit.play();
			$('.monkContainer').stop();
				monkFalling();
		}
		// Meet a pillard from monk's bottom
		if (
		monkY + monkHeight >= pillarY - 10
		&& monkY + monkHeight <= pillarY + 20
		&& monkX + monkHeight > pillarX - 20
		&& monkX < pillarX + pillar.width()) {
			monkIsHurting();
			hit.play();
			$('.monkContainer').stop();
			// Modification for mobile devices
			if (window.matchMedia("(min-width: 768px)").matches) {
				modif = 0;
			} else {
				modif = 30;
			}
			$('.monkContainer').animate({top: monkY - 50 + modif},{ 
				duration: 200,
				easing: 'linear',
				queue: false,
				complete: function() {
					monkFalling();
				}
				});
		} 
		interval4[interval4.length] = window.requestAnimationFrame(function() {helloPillar(pillar, speedPillar);});
	}
	/* MONK'S MOVEMENTS */
	/* Monk is always falling... */
	function monkFalling() {
		var monkY = parseInt($('.monkContainer').css('top'));
		var monkX = parseInt($('.monkContainer').css('left'));
		$('.monkContainer').animate({left: 0}, {
			duration: 4000,
			easing: 'linear',
			queue: false
		});
		// Desktop
		if (window.matchMedia("(min-width: 768px)").matches) {
			$('.monkContainer').animate({top: 760}, {
				duration: 3000 * (1 - monkY / 760),
				easing: 'linear',
				queue: false
			});
		// Mobile
		} else {
			$('.monkContainer').animate({top: "100vh"}, {
				duration: 3000 * (1 - monkY / screenHeight),
				easing: 'linear',
				queue: false
			});
		}
	}
	/* Monk has gone too far */
	function monkSpatialLimits() {
		var monkY = parseInt($('.monkContainer').css('top'));
		var monkX = parseInt($('.monkContainer').css('left'));
		// Desktop
		if (window.matchMedia("(min-width: 768px)").matches) {	
			if (monkX > 800) {
				$('.monkContainer').stop();
				monkFalling();
				if (!interval1)
					interval1 = setInterval(function() {monkIsAnimating(4);}, 200);
			}
			if (monkY < 60) {
				$('.monkContainer').stop();
				monkFalling();
				if (!interval1)
					interval1 = setInterval(function() {monkIsAnimating(4);}, 200);
			}
		// Mobile
		} else {
			if (monkX > screenWidth * 0.95) {
				$('.monkContainer').stop();
				monkFalling();
				if (!interval1)
					interval1 = setInterval(function() {monkIsAnimating(4);}, 200);
			}
			if (monkY < 10) {
				$('.monkContainer').stop();
				monkFalling();
				if (!interval1)
					interval1 = setInterval(function() {monkIsAnimating(4);}, 200);
			}
		}
	}
	/* DEFEAT */
	function monkDead() {
		var monkX = parseInt($('.monkContainer').css('left'));
		var monkY = parseInt($('.monkContainer').css('top'));
		// Desktop
		if (window.matchMedia("(min-width: 768px)").matches) {
			if (monkX < 0 || (monkY > 700 && areYouDead != 1)) {
				areYouDead = 1;
				$(document).off('keyup', moveTheMonk);
				$('.monkContainer').css('display', 'none');
				gameOverSound.play();
				// clear initial functionCalling (end of file)
				clearInterval(interval1);
				interval1 = null;
				clearInterval(interval2);
				clearInterval(interval3);
				// clear all the helloPillar() setInterval
				for (var i = 0 ; i < interval4.length ; i++) {
					window.cancelAnimationFrame(interval4[i]);
				}
				// Display the GameOver Screen
				// fadeIn() doesn't work well on Edge & IE
				$('.looser').animate({opacity: 1}, {
					duration: 1000,
					queue: false,
				});
				$('.looser').animate({top: 150}, {
					duration: 1000,
					queue: false
				});
				setTimeout(function() {
					$('.credits').animate({opacity: 1}, {
						duration: 1000,
						queue: false,
					});
					$('.credits').animate({top: 225}, {
						duration: 1000,
						queue: false
					});
				}, 1000);
				setTimeout(function() {
					// fadeIn() doesn't work well on Edge & IE
					$('.oneMore').animate({opacity: 1}, {
						duration: 1000,
						queue: false,
					});
					$('.oneMore').animate({top: 560}, {
						duration: 1000,
						queue: false,
						complete: function() {
							$('.oneMore').hover(function() {
								$(this).css('top', 555).css('cursor', 'pointer');
							}, function() {
								if (areYouDead === 1)
									$(this).css('top', 560);
							})
							// Using the one method to prevent the user from run the function several times with several clicks
							$('.oneMore').one('click', tryAgain);
						}
					});
				}, 3000);	
			} 
		// Mobile
		} else {
			if (monkX < 0 || (monkY > screenHeight * 0.9 && areYouDead != 1)) {
				areYouDead = 1;
				$(document).off('keyup', moveTheMonk);
				$('.monkContainer').css('display', 'none');
				gameOverSound.play();
				// clear initial functionCalling (end of file)
				clearInterval(interval1);
				interval1 = null;
				clearInterval(interval2);
				clearInterval(interval3);
				// clear all the helloPillar() setInterval
				for (var i = 0 ; i < interval4.length ; i++) {
					window.cancelAnimationFrame(interval4[i]);
				}
				// Display the GameOver Screen
				// fadeIn() doesn't work well on Edge & IE
				$('.looser').animate({opacity: 1}, {
					duration: 1000,
					queue: false,
				});
				$('.looser').animate({top: "10%"}, {
					duration: 1000,
					queue: false
				});
				setTimeout(function() {
					$('.credits').animate({opacity: 1}, {
						duration: 1000,
						queue: false,
					});
					$('.credits').animate({top: "25%"}, {
						duration: 1000,
						queue: false
					});
				}, 1000);
				setTimeout(function() {
					// fadeIn() doesn't work well on Edge & IE
					$('.oneMore').animate({opacity: 1}, {
						duration: 1000,
						queue: false,
					});
					$('.oneMore').animate({top: "80%"}, {
						duration: 1000,
						queue: false,
						complete: function() {
							// Using the one method to prevent the user from run the function several times with several clicks
							$('.oneMore').one('click', tryAgain);
						}
					});
				}, 3000);
			} 
		}
	}
	/* EVENT GESTION */
	/* Moving the little guy */
	// Desktop
	if (window.matchMedia("(min-width: 768px)").matches) {
		$(document).on('keyup', moveTheMonk);
		function moveTheMonk(e) {
			var monkY = parseInt($('.monkContainer').css('top'));
			var monkX = parseInt($('.monkContainer').css('left'));
			var bottomScreen = parseInt($('body').height());
			var distanceMonkBottom = bottomScreen - monkY;
			var bezierPath_params = {
				start: {
					x: monkX,
					y: monkY,
					angle: -45,
					lenght: 0.5,
				},
				end: {
					x: monkX + 100,
					y: monkY - 200,
					angle: 45,
					lenght: 0.25,
				}
			};
			if (e.which === 32) {
				spacePressed = 1;
				if (areYouBlocked != 1) {
					monkIsJumping();
					$('.monkContainer').stop(true, false);
					$('.monkContainer').animate({path : new $.path.bezier(bezierPath_params)}, {
						duration: 700,
						queue: false,
						complete: function() {
							monkFalling();
							interval1 = setInterval(function() {monkIsAnimating(4);}, 200);
						}
					});
				} else
					monkFalling();
			}
		}
	// Mobile
	} else {
		$(document).on('mousedown', moveTheMonk);
		function moveTheMonk(e) {
			var monkY = parseInt($('.monkContainer').css('top'));
			var monkX = parseInt($('.monkContainer').css('left'));
			var bottomScreen = parseInt($('body').height());
			var distanceMonkBottom = bottomScreen - monkY;
			var bezierPath_params = {
				start: {
					x: monkX,
					y: monkY,
					angle: -45,
					lenght: 0.5,
				},
				end: {
					x: monkX + screenWidth * 0.10,
					y: monkY - screenHeight * 0.26,
					angle: 45,
					lenght: 0.25,
				}
			};
			if (e.which === 1) {
				spacePressed = 1;
				if (areYouBlocked != 1) {
					monkIsJumping();
					$('.monkContainer').stop(true, false);
					$('.monkContainer').animate({path : new $.path.bezier(bezierPath_params)}, {
						duration: 700,
						queue: false,
						complete: function() {
							monkFalling();
							interval1 = setInterval(function() {monkIsAnimating(4);}, 200);
						}
					});
				} else
					monkFalling();
			}
		}
	}
	/* FUNCTIONS CALLING */ 
	var interval1 = setInterval(function() {monkIsAnimating(4);} , 200);
	var interval2 = setInterval(monkDead, 20);
	var interval3 = setInterval(monkSpatialLimits, 20);
	// global array for the ID of HelloPillar()'s' setInterval
	var interval4 = [];
	skyIsMoving();
	pillarsAreNumerous(timeStart);
	monkFalling();
	flash();
	//Play Again
	function tryAgain () {
		$(document).on('keyup', moveTheMonk);
		areYouDead = 0;
		speedGame = 100;
		$('.score').html(0);
		// Desktop
		if (window.matchMedia("(min-width: 768px)").matches) {
			$('.monkContainer').css('display', 'block').css('top', 300).css('left', 400);
		// Mobile
		} else {
			$('.monkContainer').css('display', 'block').css('top', '50vh').css('left', '10vw');
		}
		$('.looser').css('opacity', '0').css('top', 700);
		$('.oneMore').css('opacity', '0').css('top', 700);
		$('.credits').css('opacity', '0').css('top', 700);
		timeStart = $.now();
		interval1 = setInterval(function() {monkIsAnimating(4);} , 200);
		interval2 = setInterval(monkDead, 20);
		interval3 = setInterval(monkSpatialLimits, 20);
		// global array for the ID of HelloPillar()'s' setInterval
		interval4 = [];
		if (isSkyMoving === 0) {
			skyIsMoving();
		}
		pillarsAreNumerous(timeStart);
		monkFalling();
	}
});
});