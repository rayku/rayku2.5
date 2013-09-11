function cycle_bottom_banners() {
    var banners = $('#bottom-banners');
    var active_banner = banners.find('.active');
    var next_active = active_banner.next();
    active_banner.removeClass('active');
    active_banner.fadeOut(500);
    active_banner.addClass('hide');

    if(!next_active.length) {
        next_active = active_banner.prev();
    }

    next_active.removeClass('hide');
    next_active.fadeIn(1000);
    next_active.addClass('active');

}

function get_survey_result() {
    var time = null;
    var school_year = $('input[name=school_year]').val();
    var child_get = $('input[name=child_get]').val();
    var child_want = $('input[name=child_want]').val();
    var child_commit = $('input[name=child_commit]').val();
    switch(school_year) {
        case '9':
            switch (child_commit) {
                case '1':
                    time = 8;
                    break;
                case '2.5':
                    time = 6;
                    break;
                case '5':
                    time = 3;
                    break;
            }
            break;
        case '10':
            switch (child_commit) {
                case '1':
                    time = 10;
                    break;
                case '2.5':
                    time = 7;
                    break;
                case '5':
                    time = 4;
                    break;
            }
            break;
        case '11':
            switch (child_commit) {
                case '1':
                    time = 11;
                    break;
                case '2.5':
                    time = 8;
                    break;
                case '5':
                    time = 4;
                    break;
            }
            break;
    }

    time = time + ' months';
    $('#show_child_get').html(child_get);
    $('#show_child_want').html(child_want);
    $('#show_time').html(time);
}

function survey_next_clicked(container) {
    var step = container.attr('id');
    switch (step) {
        case 'question1':
            $('#question1').addClass('hide');
            $('#question2').removeClass('hide');
            break;
        case 'question2':
            $('#question2').addClass('hide');
            $('#question3').removeClass('hide');
            break;
        case 'question3':
            $('#question3').addClass('hide');
            $('#disclaimer').fadeIn();
            get_survey_result();
            $('#results').removeClass('hide');
            break;
    }
}

function survey_back_clicked(container) {
    var step = container.attr('id');
    switch (step) {
        case 'question2':
            $('#question2').addClass('hide');
            $('#question1').removeClass('hide');
            break;
        case 'question3':
            $('#question3').addClass('hide');
            $('#question2').removeClass('hide');
            break;
    }
}

$(document).ready(function () {
    setInterval(function () {
        cycle_bottom_banners();
    }, 10000);

    $('a.continue-button').click(function () {
        var parent = $(this).parent().parent();
        survey_next_clicked(parent);
    });

    $('a.back-button').click(function () {
        var parent = $(this).parent().parent();
        survey_back_clicked(parent);
    });
    $('select[act=true]').each(function () {
        var selected_val = $(this).val();
        var field_name = $(this).attr('name');
        var update_this = field_name.substring(4);
        $('input[name=' + update_this + ']').val(selected_val);
    });

    $('select[act=true]').change(function () {
        var selected_val = $(this).val();
        var field_name = $(this).attr('name');
        var update_this = field_name.substring(4);
        $('input[name='+ update_this+']').val(selected_val);

    });
});