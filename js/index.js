$(function() {

	$('.btn-start').on('click', function() {
		$('.navbar, .wrapper').hide();
		$.Velocity.animate($('.container-quiz'), 'fadeIn', {duration: 1500}).then(function() {
			load_question();
		});
	});

	$('.type-writer').t({
		blink: true,
		speed: 30,
		speed_vary: true,
		fin: function() {
			$('.btn-start').velocity('fadeIn', {duration: 800});
		}
	});

	var questions;

	$.getJSON('questions.json?' + Date.now(), function(data) {
		questions = shuffle(data);
		questions = questions.slice(0, 10);
	});


	var shuffle = function(array) {
		var counter = array.length;
		while (counter > 0) {
			var index = Math.floor(Math.random() * counter);
			counter--;
			var temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}
		return array;
	}

	var bind_click_event = function() {

		$(document).one('click', '.btn-answer', function() {
			var that = $(this),
			score = $('.current-score'),
			current_score = parseInt(score.text());

			if (that.attr('data-correct') !== '1') {
				$('html').addClass('shake shake-constant');
				that.addClass('btn-danger').find('.glyphicon-remove').show();

				setTimeout(function() {
					$('html').removeClass('shake shake-constant');
				}, 200);

				if ('vibrate' in navigator) {
					navigator.vibrate(100);
				}
				
				load_next_question(that);
			} else {
				score.prop('number', current_score).animateNumber({number: current_score + 200});
				that.addClass('btn-correct shake shake-constant').find('.glyphicon-ok').show();
				load_next_question(that);
			}
		});
	}

	var load_question = function() {

		if (questions.length <= 0 ){
			show_result();
			return;
		}

		var question = questions[0].question,
			answers = shuffle(questions[0].answers),
			answer_buttons = '',
			provider = '<p>&nbsp;</p><p>&nbsp;</p>';

		for (var i = 0; i < answers.length; i++) {
			var correct = answers[i].correct ? '1' : '0';
			answer_buttons += 
				'<button class="btn btn-default btn-lg btn-block btn-answer row" data-correct="' + correct + '" style="display: none">' +
					'<span class="col-md-11">' + questions[0].answers[i].title + '</span>' +
				'</button>';
		}

		if (questions[0].provider !== '') {
			provider = '<div class="quiz-provider">本題由「' + questions[0].provider + '」提供</div>';
		}

		$('.row-quiz').html(
			'<div class="col-md-8 col-md-offset-2 col-xs-10 col-xs-offset-1 quiz-wrapper">' +
				'<h2 class="quiz-text">' + questions[0].question + '</h2>' +
				provider +
				answer_buttons +
			'</div>'
			);

		$('.btn-answer').prepend(
			'<i class="glyphicon glyphicon-remove col-md-1" style="display: none"></i>'+
			'<i class="glyphicon glyphicon-ok col-md-1" style="display: none"></i>'
			);

		$('.quiz-text, .quiz-provider').velocity('fadeIn', {duration: 1000});

		questions.splice(0, 1);

		setTimeout(function() {
			$('.btn-answer').show().addClass('animated bounceIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				$(this).removeClass('animated bounceIn');
			});
		}, 1500);

		bind_click_event();
	}

	var load_next_question = function(that) {

		var correct_answer = $('.quiz-wrapper .btn-answer[data-correct="1"]'),
			wrong_answer = $('.quiz-wrapper .btn-answer[data-correct="0"]'),
			provider = $('.quiz-provider');

		setTimeout(function() {
			that.removeClass('shake shake-constant');
		}, 80);

		setTimeout(function() {
			correct_answer.addClass('btn-correct').find('.glyphicon-ok').show();
			wrong_answer.velocity({opacity: 0}, {visibility: 'hidden'});
			provider.velocity({opacity: 0}, {visibility: 'hidden'});
		}, 1000);

		setTimeout(function() {
			correct_answer.velocity('fadeOut', {duration: 300});
			$('.quiz-text').velocity('fadeOut', {duration: 300});
		}, 2500);

		setTimeout(function() {
			load_question();
		}, 3200)
	}

	var show_result = function() {
		var score = parseInt($('.current-score').text()),
			result_text = '',
			share_url = '',
			share_text = '';

		result_text += '<p>&nbsp;</p>';
		if (score <= 1000) {
			result_text = '<h1>我看你還是老老實實當個死老百姓吧</h1>';
		} else if (score > 1200 && score <= 1600) {
			result_text = '<h1>看來是太菜了，再多飄點</h1>';
		} else {
			result_text = '<h1>什麼都別說了</h1>'+
			'<p>&nbsp;</p>'+
			'<h2>北部地區人才招募中心<br>(02)2364-3837</h2>'+
			'<h2>中部地區人才招募中心<br>(04)2215-1813</h2>'+
			'<h2>南部地區人才招募中心<br>(07)583-0076</h2>';
		}
		share_text = encodeURIComponent('我拿' + score + '分，叫我姿勢王！');
		share_url = 'http://www.facebook.com/sharer/sharer.php?u=http://osk2.me/armyquiz&t=' + share_text;

		result_text += '<p>&nbsp;</p><a class="btn btn-lg btn-facebook" href="'+ share_url +'" target="_blank"><i class="fa fa-facebook" aria-hidden="true"></i>&nbsp;分享至 Facebook</a><p>&nbsp;</p>';

		$('.quiz-wrapper').html(result_text).velocity('fadeIn', {duration: 800});
		$('.container-quiz').addClass('wrapper');
		$('footer').velocity('fadeIn', {duration: 500});
	}

});