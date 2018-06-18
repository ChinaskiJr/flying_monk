$(function() {
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

	/* Fonctions calling */
	var animation = setInterval(function() {monkIsAnimating(4);} , 200);
	skyIsMoving();

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