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

	/* Pillars are coming */
	function setNewPillar() {
		var speed = pillarsAreQuicker(timeStart);
		var pillar = $('.pillars:first').clone().appendTo('.pillarsContainer');
		/* Where does it comes ? 
		2 chances on 3 that it will be 
		different from the previous*/
		console.log($('.lastPositionPillar').html());
		if (parseInt($('.lastPositionPillar').html()) === 0) {
			var pillarY = Math.ceil(Math.random() * 3);
			if (pillarY == 2 || pillarY == 3) {
				pillarY = 1;
			} else 
				pillarY = 0;
			console.log(pillarY);
		} else {
			var pillarY = Math.ceil(Math.random() * 3);
			if (pillarY == 2 || pillarY == 3) {
				pillarY = 0;
			} else 
				pillarY = 1;
			console.log(pillarY);
		}
		pillarY *= 370;
		$('.lastPositionPillar').html(pillarY);
		pillar.css('left', 870);
		pillar.css('top', pillarY);
		pillarIsComing(pillar, pillarY, speed);
	}
	function pillarIsComing(pillar, pillarY, speed) {
		pillar.animate({left : 0}, speed, 'linear', function() {
			pillarX = parseInt($(this).css('left'));
			while (pillarX < 0) {
				$(this).css('left', pillarX);
				pillarX = parseInt($(this).css('left'));
			}
			pillar.empty
			pillar.remove();
		});
	}

	/* More you survive... more god is angry */
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
	function pillarsAreNumerous(timeStart) {
		var pillarsPlace = 3000; // FIX THIS
		var timeNow = $.now();
		var timeSinceTheBeggining = timeNow - timeStart;
		var pillarsPace = parseInt(3000 - (timeSinceTheBeggining / 25));
		if (pillarsPace < 450) {
			pillarsPace = 450;
		}
		setNewPillar();
		setTimeout(function() {pillarsAreNumerous(timeStart);}, pillarsPace);
	}


	/* Fonctions calling */
	setInterval(function() {monkIsAnimating(4);} , 200);
	skyIsMoving();
	pillarsAreNumerous(timeStart);

	/* Moving the little guy */
	$(document).on('keydown', function(e) {
		var monkY = parseInt($('.monkContainer').css('top'));
		var monkX = parseInt($('.monkContainer').css('left'));
		switch (e.which) {
			// Top
			case 38:
				if (monkY > 50)
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
				if (monkX < 950)
					$('.monkContainer').css('left', monkX += 50);
			break;
		}
	})
});