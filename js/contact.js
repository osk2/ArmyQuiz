$(function() {

  $('.form-feedback').on('submit', function(e) {

    e.preventDefault();

    ga('send', 'event', 'Feedback', 'submit');
    $('.input-wrapper').removeClass('has-error');
    var flag = true;

    $('.form-feedback .required').each(function(ind, val){

      if ($(this).val() === '' ) {
        $(this).parent().addClass('has-error');
        flag = false;
      }

    });

    if (flag) {
      var name = $('input[name="inputName"]').val(),
      question = $('input[name="inputQuestion"]').val().replace(/\r\n|\r|\n/g,"<br>"),
      answers = [],
      data;

      for (var i = 1; i <= 4; i++) {
        answers[i] = $('input[name="inputAnswer'+ i +'"]').val().replace(/\r\n|\r|\n/g,"<br>");
      }

      data = JSON.stringify({"name": name, "question": question, "answers": answers});

      $.ajax({
        url: './handler.php',
        type: 'POST',
        data: data,
        success: function(return_data) {

          if (return_data.success) {
            swal({
              title: '噢耶！',
              text: '已經收到你的愛了，感恩！',
              confirmButtonText: '好的',
              type: 'success'
            });
            $('.btn-reset').show();
            ga('send', 'event', 'Feedback', 'success');
          } else {
            var error_message = '';
            if (return_data.message !== '') {
              error_message = '發生錯誤了，稍後再重試一次（錯誤訊息︰' + return_data.message + '）';
            } else {
              error_message = '發生錯誤了，稍後再重試一次';
            }
            swal({
              title: '糟糕！',
              text: error_message,
              confirmButtonText: '好的',
              type: 'error'
            });
            ga('send', 'event', 'Feedback', 'serverError');
          }
        },
        error: function() {
          ga('send', 'event', 'Feedback', 'ajaxError');
          swal({
            title: '糟糕！',
            text: '發生錯誤了，稍後再重試一次',
            confirmButtonText: '好的',
            type: 'error'
          });
        }
      });
    } else {
      ga('send', 'event', 'Feedback', 'missing');
      swal({
        title: '糟糕！',
        text: '有些必填欄位被漏掉了，趕快補齊吧',
        confirmButtonText: '好的',
        type: 'error'
      });
    }

  });

});