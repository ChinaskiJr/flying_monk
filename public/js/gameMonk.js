$(function() {

	$('.startButton').one('click', function() {
	$('.welcome').css('display', 'none');

	/* Let's store some data */
	$('body').after('<p class="lastPositionPillar" hidden></p>');
	$('body').after('<p class="areYouBlocked" hidden>0</p>');
	$('body').after('<p class="areYouDead" hidden>0</p>');
	$('body').after('<p class="speedGame" hidden>100</p>');
	$('body').after('<p class="isFalling" hidden>0</p>');
	if (parseInt($('.score').html()) > 0) {
		$('.score').html(0);
	}
	/* Music loop */
	var music = document.createElement('audio');
	music.setAttribute('src', 'sound/music/music.mp3');
	music.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);
	music.play();

	/* LOOP ANIMATION */
	/* background animation */
	function skyIsMoving () {
		$('.skyBackground').animate({left : '-=960'}, 4000, 'linear', function() {
			$('.skyBackground:first').css('left', 960);
			$('.skyBackground:nth-child(2)').css('left', 0);
			if ($('.areYouDead').html() !=1)
				skyIsMoving();
		});
	}
	/* Monk variables */
	var 	monkHeight = 63.25;
	var 	count = 0;
	var 	monk = $('.monkSprite');
	/* Monk animation */
	// Reset interval1 at the end of the animation
	function monkIsJumping() {
		clearInterval(interval1);
		monk.css('margin-left', -1 * (5 * monkHeight));		
	}
	function monkIsHurting() {
		clearInterval(interval1);
		monk.css('margin-left', -1 * (4 * monkHeight));
		interval1 = setInterval(function() {monkIsAnimating(4);} , 200);
	}
	function monkIsAnimating(numImgs) {
		$('.areYouBlocked').html(0);
		monk.css('margin-left', -1 * (count * monkHeight));
		count++;
		if (count === numImgs) {
			count = 0;
		}
	}

	/* PILLARS STUFF */
	/* Pillars are coming : general function*/
	function setNewPillar() {
		var speedPillar = pillarsAreQuicker(timeStart);
		// speed = distance / time
		var speedGame = 960 / speedPillar;		
		$('.speedGame').html(speedGame);
		var pillar = $('.pillars:first').clone().appendTo('.pillarsContainer');
		/* Where does it comes ? 
		 * 2 chances on 3 that it will be 
		 * different from the previous
		 */
		if (parseInt($('.lastPositionPillar').html()) === 0) {
			var pillarY = Math.ceil(Math.random() * 3);
			if (pillarY == 2 || pillarY == 3) {
				pillarY = 1;
			} else 
				pillarY = 0;
		} else {
			var pillarY = Math.ceil(Math.random() * 3);
			if (pillarY == 2 || pillarY == 3) {
				pillarY = 0;
			} else 
				pillarY = 1;
		}
		pillarY *= 370;
		$('.lastPositionPillar').html(pillarY);
		pillar.css('left', 870);
		pillar.css('top', pillarY);
		pillarIsComing(pillar, pillarY, speedPillar);
		// Stock the ID in array interval4 for clear it when game will be over
		interval4[interval4.length] = (setInterval(function() {helloPillar(pillar, speedPillar);}, 60 - speedGame * 3));
	}		
	/* Display a pillar and destroy it when 'top' comes to 0*/
	function pillarIsComing(pillar, pillarY, speed) {
		pillar.animate({left : 0}, speed, 'linear', function() {
			pillarX = parseInt($(this).css('left'));
			while (pillarX < 0) {
				$(this).css('left', pillarX);
				pillarX = parseInt($(this).css('left'));
			}
			pillar.remove();
			var score = parseInt($('.score').html());
			score+=5;
			$('.score').html(score)
		});
	}

	/* More you survive... more god is angry
	Deal with speed of pillars */
	var timeStart = $.now();
	function pillarsAreQuicker() {
		var timeNow = $.now();
		var timeSinceTheBeggining = timeNow - timeStart;
		// pillarsSpeed is the duration (ms) for a pillar to go through the screen
		var pillarsSpeed = 4500 - (timeSinceTheBeggining / 10);
		if (pillarsSpeed < 1000) {
			pillarsSpeed = 1000;
		}
		return parseInt(pillarsSpeed);
	}
	/* Deal with pace of pillars */
	function pillarsAreNumerous() {
		var timeNow = $.now();
		var timeSinceTheBeggining = timeNow - timeStart;
		var pillarsPace = parseInt(2000 - (timeSinceTheBeggining / 20));
		if (pillarsPace < 200) {
			pillarsPace = 200;
		}
		if (parseInt($('.areYouDead').html()) != 1) {
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
		var speedGame = parseFloat($('.speedGame').html());
		var speedMonk = speedPillar * ((pillarX - 60) / 960);
		// Meet a pillar from the face
		if (
		monkY < (pillarY + pillar.height() + 20)
		&& monkY + monkHeight > pillarY
		&& monkX < pillarX
		&& monkX + monkHeight > pillarX) {
			monkIsHurting();
			$('.monkContainer').stop();
			$('.monkContainer').animate({left: pillarX - 80}, {
				duration: 10,
				queue:false});
			$('.monkContainer').animate({left: 0},{
				duration: speedMonk,
				easing: 'linear',
				queue: false,
			});	
			$('.monkContainer').animate({top: monkY + 20},{ 
				duration: 50,
				easing: 'linear',
				queue: false,
				complete: function() {
					monkFalling();
				}
			});
			$('.areYouBlocked').html(1);
		}
		// Meet a pillar from behind
		if (
		monkY < pillarY + pillar.height()
		&& monkY > pillarY - monkHeight + 20
		&& monkX < pillarX + pillar.width()
		&& monkX > pillarX) {
		monkIsHurting();
		$('.monkContainer').stop();
			$('.monkContainer').animate({left: monkX + 40},{ 
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
		monkY >= pillarY + pillar.height() - 20
		&& monkY < pillarY + pillar.height()
		&& monkX > pillarX
		&& monkX < pillarX + pillar.width()
		&& pillarX > 0) {
		monkIsHurting();
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
		$('.monkContainer').stop();
		$('.monkContainer').animate({top: monkY - 50},{ 
			duration: 200,
			easing: 'linear',
			queue: false,
			complete: function() {
				monkFalling();
			}
			});
		} 
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
		$('.monkContainer').animate({top: 760}, {
			duration: 3000 * (1 - monkY / 760),
			easing: 'linear',
			queue: false
		});
	}
	/* Monk has gone too far */
	function monkSpatialLimits() {
		var monkY = parseInt($('.monkContainer').css('top'));
		var monkX = parseInt($('.monkContainer').css('left'));
		if (monkX > 800) {
			$('.monkContainer').stop();
			monkFalling();
		}
		if (monkY < 60) {
			$('.monkContainer').stop();
			monkFalling();
		}
	}
	/* DEFEAT */
	function monkDead() {
		var monkX = parseInt($('.monkContainer').css('left'));
		var monkY = parseInt($('.monkContainer').css('top'));
		if (monkX < 0 || (monkY > 700 && parseInt($('.areYouDead').html()) != 1)) {
			$('.areYouDead').html(1);
			$('.monkContainer').css('display', 'none');
			var gameOverSound = document.createElement('audio');
			gameOverSound.setAttribute('src', 'sound/sounds/gameOver.mp3');
			gameOverSound.play();
			// clear initial functionCalling (end of file)
			clearInterval(interval1);
			clearInterval(interval2);
			clearInterval(interval3);
			// clear all the helloPillar() setInterval
			for (var i = 0 ; i < interval4.length ; i++) {
				clearInterval(interval4[i]);
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
				$('.credits').animate({top: 250}, {
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
				$('.oneMore').animate({top: 525}, {
					duration: 1000,
					queue: false,
					complete: function() {
						$('.oneMore').hover(function() {
							$(this).css('top', 520).css('cursor', 'pointer');
						}, function() {
							if ($('.areYouDead').html() == 1)
								$(this).css('top', 525);
						})
						// Using the one method to prevent the user from run the function several times with several clicks
						$('.oneMore').one('click', tryAgain);
					}
				});
			}, 3000);
		}
	}

	/* EVENT GESTION */
	/* Moving the little guy */
	$(document).on('keydown', moveTheMonk);
	$(document).on('click', moveTheMonk);
	function moveTheMonk(e) {
		var monkY = parseInt($('.monkContainer').css('top'));
		var monkX = parseInt($('.monkContainer').css('left'));
		var bottomScreen = parseInt($('body').height());
		var distanceMonkBottom = bottomScreen - monkY;
		var bezierPath_params = {
			start: {
				x: monkX,
				y: monkY,
				angle: -75,
				lenght: 1,
			},
			end: {
				x: monkX + 150,
				y: monkY - 150,
				angle: 75,
				lenght: 1,
			}
		}
		switch (e.which) {
			case 32:
				if ($('.areYouBlocked').html() != 1) {
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
				break;
			// Mouseclick 	
			case 1:
				$('.monkContainer').stop(true, false);
				monkIsJumping();
				$('.monkContainer').animate({path : new $.path.bezier(bezierPath_params)}, {
					duration: 700,
					queue: false,
					complete: function() {
						monkFalling();
						interval1 = setInterval(function() {monkIsAnimating(4);}, 200);
					}
				});

			break;
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

	//Play Again
	function tryAgain () {
		$('.areYouDead').html(0);
		$('.speedGame').html(100);
		$('.score').html(0);
		$('.monkContainer').css('display', 'block').css('top', 300).css('left', 400);
		$('.looser').css('opacity', '0').css('top', 700);
		$('.oneMore').css('opacity', '0').css('top', 700);
		$('.credits').css('opacity', '0').css('top', 700);
		timeStart = $.now();
		interval1 = setInterval(function() {monkIsAnimating(4);} , 200);
		interval2 = setInterval(monkDead, 20);
		interval3 = setInterval(monkSpatialLimits, 20);
		// global array for the ID of HelloPillar()'s' setInterval
		interval4 = [];
		skyIsMoving();
		pillarsAreNumerous(timeStart);
		monkFalling();
	}
});
});