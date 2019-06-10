var dayliCalendar;

class Calendar {
    constructor(uid, date, daysComplete) {
        this.uid = uid;
        this.date = date;
        this.daysComplete = daysComplete;
    }
    
    init() {
        var _this = this;
        dayliCalendar = jsCalendar.new('#calendar', _this.date);
        $('.jsCalendar > table').css({
            'margin': 'auto',
            'background-color': 'transparent',
            'color': 'var(--greyscale)',
            'box-shadow': 'none',
        });
        $('.jsCalendar-current')
            .attr('id', _this.date)
            .css('color', 'var(--brand)');

        dayliCalendar.select(_this.daysComplete);
        _this.styleSelected();

        dayliCalendar.onDateClick(function(event, dateClicked) {
            $('.jsCalendar-current').removeClass('jsCalendar-current');
            $(event.target).closest('td').addClass('jsCalendar-current');
            _this.showDay(dateClicked);
            _this.styleSelected();
        });

        dayliCalendar.onMonthChange(function(event, dateClicked) {
            var thisMonth = _this.date.split('-')[1];
            if (String(dateClicked.getMonth()+1) == thisMonth) {
                $('#' + _this.date).css('color', 'var(--brand)');
            } else {
                $('#' + _this.date).css('color', 'var(--greyscale)');
            }
            _this.styleSelected();
        });
    }

    showDay(date) {
        var dateObj = getDate(date); // defined in auth.js
        var dayli = new Dayli(this.uid, dateObj.year, dateObj.date);
        dayli.init();
    }

    styleSelected() {
        $('td').not('.jsCalendar-current, .jsCalendar-selected')
            .css('background-color', 'transparent');
        $('.jsCalendar-current').css('background-color', 'var(--dark)');
        $('.jsCalendar-selected').css({
            'background-color': 'var(--accent)',
            'border': 'none',
        });
    }
}

