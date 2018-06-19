$(function() {
	/* Let's store some data */
	$('body').after('<p class="lastPositionPillar" hidden></p>');
	$('body').after('<p class="areYouBlocked" hidden></p>');
	$('body').after('<p class="areYouDead" hidden>0</p>');
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
		var speed = pillarsAreQuicker(timeStart);
		var pillar = $('.pillars:first').clone().appendTo('.pillarsContainer');
		/* Where does it comes ? 
		2 chances on 3 that it will be 
		different from the previous*/
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
		pillarIsComing(pillar, pillarY, speed);
		setInterval(function() {helloPillar(pillar);} , 100);
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
		if (pillarsPace < 300) {
			pillarsPace = 300;
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
		// Meet a pillar from the face
		if (
		monkY < (pillarY + 400)
		&& monkY > (pillarY - 64)
		&& monkX < pillarX
		&& (monkX + 60) > pillarX) {
			monkX = pillarX - 60;
			$('.monkContainer').animate({left: monkX}, 100, 'linear');
			$('.areYouBlocked').html(1);
		} else 
			$('.areYouBlocked').html(0);
		// Meet a pillar from behind (you fool...)
		if (
		monkY < (pillarY + 400)
		&& monkY > (pillarY - 64)
		&& monkX < pillarX + 60
		&& monkX > pillarX) {
			monkX = pillarX + 70;
			$('.monkContainer').animate({left: monkX}, 100, 'linear');
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
			$('.monkContainer').animate({top: monkY}, 100, 'linear');
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
			$('.monkContainer').animate({top: monkY}, 100, 'linear');
			$('.areYouBlocked').html(1);
		} else 
			$('.areYouBlocked').html(0);
	}

	/* DEFEAT */
	function monkDead() {
		var monkX = parseInt($('.monkContainer').css('left'));
		if (monkX < 0 && $('.areYouDead').html() !=1) {
			$('.areYouDead').html(1);
			$('.monkContainer').css('display', 'none');
			var gameOverSound = document.createElement('audio');
			gameOverSound.setAttribute('src', 'sound/sounds/gameOver.mp3');
			gameOverSound.play();
		}
	}

	/* FUNCTIONS CALLING */
	setInterval(function() {monkIsAnimating(4);} , 200);
	skyIsMoving();
	pillarsAreNumerous(timeStart);
	setInterval(monkDead, 1000);

	/* EVENT GESTION */
	/* Moving the little guy */
	$(document).on('keydown', moveTheMonk);

	function moveTheMonk(e) {
		var monkY = parseInt($('.monkContainer').css('top'));
		var monkX = parseInt($('.monkContainer').css('left'));
		switch (e.which) {
			// Top
			case 38:
				if (monkY > 10 && $('.areYouBlocked').html() != 1)
					$('.monkContainer').css('top', monkY -= 50);
			break;
			// Bottom
			case 40:
				if (monkY < 700 && $('.areYouBlocked').html() != 1)
					$('.monkContainer').css('top', monkY += 50);
			break;
			// Left
			case 37:
				if (monkX > 8 && $('.areYouBlocked').html() != 1)
					$('.monkContainer').css('left', monkX -= 50);
			break;
			// Right
			case 39:
				if (monkX < 800 && $('.areYouBlocked').html() != 1)
					$('.monkContainer').css('left', monkX += 50);
			break;
		}
	}
});