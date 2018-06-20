$(function() {
	/* Let's store some data */
	$('body').after('<p class="lastPositionPillar" hidden></p>');
	$('body').after('<p class="areYouBlocked" hidden></p>');
	$('body').after('<p class="areYouDead" hidden>0</p>');
	$('body').after('<p class="speedGame" hidden>100</p>');
	$('body').after('<p class="isFalling" hidden>0</p>');
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
	/* Monk animation */
	function monkIsAnimating(numImgs) {
		monk.css('margin-left', -1 * (count * monkHeight));
		count++;
		if (count === numImgs) {
			count = 0;
		}
	}
	/* Monk variables */
	var 	monkHeight = 63.25;
	var 	count = 0;
	var 	monk = $('.monkContainer').find('img');

	/* PILLARS STUFF */
	/* Pillars are coming : general function*/
	function setNewPillar() {
		var speedPillar = pillarsAreQuicker(timeStart);
		var speedGame =	parseInt($('.speedGame').html());
		if (speedGame > 2) {
			speedGame -= 2;
		} else 
			speedGame = 1;
		console.log(speedGame);
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
		setInterval(function() {helloPillar(pillar);}, 10);
	}
	/* Display a pillar */
	function pillarIsComing(pillar, pillarY, speed) {
		pillar.animate({left : 0}, speed, 'linear', function() {
			pillarX = parseInt($(this).css('left'));
			while (pillarX < 0) {
				$(this).css('left', pillarX);
				pillarX = parseInt($(this).css('left'));
			}
			pillar.remove();
		});
	}

	/* More you survive... more god is angry
	Deal with speed of pillars */
	var timeStart = $.now();
	function pillarsAreQuicker(timeStart) {
		var timeNow = $.now();
		var timeSinceTheBeggining = timeNow - timeStart;
		var pillarsSpeed = 4500 - (timeSinceTheBeggining / 10);
		if (pillarsSpeed < 1000) {
			pillarsSpeed = 1000;
		}
		return parseInt(pillarsSpeed);
	}
	/* Deal with pace of pillars */
	function pillarsAreNumerous(timeStart) {
		var timeNow = $.now();
		var timeSinceTheBeggining = timeNow - timeStart;
		var pillarsPace = parseInt(2000 - (timeSinceTheBeggining / 20));
		if (pillarsPace < 200) {
			pillarsPace = 200;
		}
		if ($('.areYouDead').html() != 1) {
			setNewPillar();
			setTimeout(function() {pillarsAreNumerous(timeStart);}, pillarsPace);
		}
	}

	/* COLLISION */ 
	function helloPillar (pillar) {
		var monkY = parseInt($('.monkContainer').css('top'));
		var monkX = parseInt($('.monkContainer').css('left'));
		var pillarY = parseInt(pillar.css('top'));
		var pillarX = parseInt(pillar.css('left'));
		var speedGame = parseInt($('.speedGame').html());
		if (parseInt($('.monkContainer').html()) == 1)
			$('.monkContainer').clearQueue();
		// Meet a pillar from the face
		if (
		monkY < (pillarY + 400)
		&& monkY > (pillarY - 64)
		&& monkX < pillarX
		&& (monkX + 60) > pillarX) {
			$('.monkContainer').stop();
			if (speedGame > 30) 
				monkX = pillarX - 70;
			else if (speedGame > 10)
				monkX = pillarX - 140;
			else 
				monkX = pillarX - 210;
			
			$('.monkContainer').animate({left: monkX},{ 
				duration: 20, 
				easing: 'linear',
				queue: false,
				complete: function() {
					monkFalling();
				}
			});
			$('.monkContainer').animate({top: monkY + 80},{ 
				duration: 100, 
				easing: 'linear',
				queue: false,
				complete: function() {
					monkFalling();
				}
			});
			$('.areYouBlocked').html(1);
		} else 
			$('.areYouBlocked').html(0);
		// Meet a pillar from behind (you fool...)
		if (
		monkY < (pillarY + 400)
		&& monkY > (pillarY - 64)
		&& monkX < pillarX + 60
		&& monkX > pillarX) {
			monkX = pillarX + 80;
			$('.monkContainer').stop();
			$('.monkContainer').animate({left: monkX},{ 
				duration: speedGame, 
				easing: 'linear',
				queue: false,
				complete: function() {
					monkFalling();
				}
			});
			$('.areYouBlocked').html(1);
		} else 
			$('.areYouBlocked').html(0);

		// Meet a pillard from the bottom
		if (
		monkY >= (pillarY + 400)
		&& monkY < (pillarY + 450)
		&& monkX > pillarX - 40
		&& monkX < (pillarX + 40)) {
			monkY = 400;
			$('.monkContainer').stop();
			$('.monkContainer').animate({top: monkY},{ 
				duration: speedGame, 
				easing: 'linear',
				queue: false,
				complete: function() {
					monkFalling();
				}
			});
			$('.areYouBlocked').html(1);
		} else 
			$('.areYouBlocked').html(0);
		// Meet a pillard from the top
		if (
		monkY <= pillarY
		&& monkY + 70 >= pillarY
		&& monkX > pillarX - 40
		&& monkX < (pillarX + 40)) {
			monkY = 300;
			$('.monkContainer').stop();
			$('.monkContainer').animate({top: monkY},{ 
				duration: speedGame, 
				easing: 'linear',
				queue: false,
				complete: function() {
					monkFalling();
				}
			});
			$('.areYouBlocked').html(1);
		} else 
			$('.areYouBlocked').html(0);
	}

	/* DEFEAT */
	function monkDead() {
		var monkX = parseInt($('.monkContainer').css('left'));
		var monkY = parseInt($('.monkContainer').css('top'));
		if (monkX < 0 && $('.areYouDead').html() !=1) {
			$('.areYouDead').html(1);
			$('.monkContainer').css('display', 'none');
			var gameOverSound = document.createElement('audio');
			gameOverSound.setAttribute('src', 'sound/sounds/gameOver.mp3');
			gameOverSound.play();
		}
		if (monkY > 700 && $('.areYouDead').html() != 1) {
			$('.areYouDead').html(1);
			$('.monkContainer').css('display', 'none');
			var gameOverSound = document.createElement('audio');
			gameOverSound.setAttribute('src', 'sound/sounds/gameOver.mp3');
			gameOverSound.play();
		}
	}


	/* EVENT GESTION */
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
			duration: 3000,
			easing: 'linear',
			queue: false
		});
	}

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
				angle: -45,
			},
			end: {
				x: monkX + 400,
				y: monkY - 250,
				angle: 65,
				lenght: 8,
			}
		}
		switch (e.which) {
			// Top
			case 38:
				if (monkY > 10 && $('.areYouBlocked').html() != 1)
					$('.monkContainer').css('top', monkY -= 50);
				monkFalling();
			break;
			// Bottom
			case 40:
				if (monkY < 700 && $('.areYouBlocked').html() != 1)
					$('.monkContainer').css('top', monkY += 50);
				monkFalling();
			break;
			// Left
			case 37:
				if (monkX > 8 && $('.areYouBlocked').html() != 1)
					$('.monkContainer').css('left', monkX -= 50);
				monkFalling();
			break;
			// Right
			case 39:
				if (monkX < 800 && $('.areYouBlocked').html() != 1)
					$('.monkContainer').css('left', monkX += 50);
				monkFalling();
			break;
			// Mouseclick 
			case 1:
				$('.monkContainer').stop(true, false);
				$('.monkContainer').animate({path : new $.path.bezier(bezierPath_params)}, {
					duration: 1500,
					queue: false,
					complete: function() {
						monkFalling();
					}
				});
			break;
		}
	}

	/* FUNCTIONS CALLING */
	setInterval(function() {monkIsAnimating(4);} , 200);
	skyIsMoving();
	pillarsAreNumerous(timeStart);
	monkFalling();
	setInterval(monkDead, 200);
});