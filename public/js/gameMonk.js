$(function() {
	/* Let's store some data */
	$('body').after('<p class="lastPositionPillar" hidden></p>');
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
		setInterval(function() {helloPillar(pillar);} , 200);
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
		var pillarsSpeed = 4500 - (timeSinceTheBeggining / 20);
		if (pillarsSpeed < 1500) {
			pillarsSpeed = 1500;
		}
		return parseInt(pillarsSpeed);
	}
	/* Deal with pace of pillars */
	function pillarsAreNumerous(timeStart) {
		var timeNow = $.now();
		var timeSinceTheBeggining = timeNow - timeStart;
		var pillarsPace = parseInt(3000 - (timeSinceTheBeggining / 25));
		if (pillarsPace < 450) {
			pillarsPace = 450;
		}
		setNewPillar();
		setTimeout(function() {pillarsAreNumerous(timeStart);}, pillarsPace);
	}

	/* COLLISION */ 
	function helloPillar (pillar) {
		var monkY = parseInt($('.monkContainer').css('top'));
		var monkX = parseInt($('.monkContainer').css('left'));
		var pillarY = parseInt(pillar.css('top'));
		var pillarX = parseInt(pillar.css('left'));
		// Meet a pillar from the face
		while (
		monkY < (pillarY + 400)
		&& monkY > (pillarY - 64)
		&& monkX < pillarX
		&& (monkX + 64) > pillarX) {
			monkX = pillarX - 90;
			$('.monkContainer').animate({left: monkX}, 200, 'linear');
		} // Meet a pillar from behind (you fool...)
		while (
		monkY < (pillarY + 400)
		&& monkY > (pillarY - 64)
		&& monkX < pillarX + 80
		&& monkX > pillarX) {
			monkX = pillarX + 90;
			$('.monkContainer').animate({left: monkX}, 200, 'linear');
		}
	}

	/* DEFEAT */
	var isDead = 0;
	function monkDead() {
		var monkX = parseInt($('.monkContainer').css('left'));
		if (monkX < 0 && isDead === 0) {
			isDead = 1;
			music.pause();
			var gameOverSound = document.createElement('audio');
			gameOverSound.setAttribute('src', 'sound/sounds/gameOver.mp3');
			gameOverSound.play();
			$('.gameOver').css('display', 'initial');
		}
	}

	/* FUNCTIONS CALLING */
	setInterval(function() {monkIsAnimating(4);} , 200);
	skyIsMoving();
	pillarsAreNumerous(timeStart);
	setInterval(monkDead, 1000);

	/* EVENT GESTION */
	/* Moving the little guy */
	$(document).on('keydown', function(e) {
		var monkY = parseInt($('.monkContainer').css('top'));
		var monkX = parseInt($('.monkContainer').css('left'));

		switch (e.which) {
			// Top
			case 38:
				if (monkY > 10)
					$('.monkContainer').css('top', monkY -= 50);
			break;
			// Bottom
			case 40:
				if (monkY < 700)
					$('.monkContainer').css('top', monkY += 50);
			break;
			// Left
			case 37:
				if (monkX > 8)
					$('.monkContainer').css('left', monkX -= 50);
			break;
			// Right
			case 39:
				if (monkX < 890)
					$('.monkContainer').css('left', monkX += 50);
			break;
		}
	})
});