jQuery(function ($) {
    $(document).ready(function () {
        $('.time-input').inputmask({
            alias: "datetime",
            inputFormat: "HH:MM:ss",
            placeholder: "00:00:00"
        });
        $('.date-input').inputmask({
            alias: "datetime",
            inputFormat: "dd.mm.yyyy",
            placeholder: "00.00.0000"
        });
        $('.client-logout-time').change(function(e){
            timeChange();
        });
        $('.client-login-time').change(function(e){
            timeChange();
        });
        $('.consultat-time').inputmask({
            alias: "datetime",
            inputFormat: "HH:MM:ss",
            placeholder: "00:00:00"
        });
        $('.client-sum-time').inputmask({
            alias: "datetime",
            inputFormat: "HH:MM:ss",
            placeholder: "00:00:00"
        });
        $('.consultat-time').change(function(e){
            let consultSeconds = timeToSeconds($(this).val());
            let visitSeconds = timeToSeconds($('.client-sum-time').val());
            if(consultSeconds > visitSeconds) {
                $('.consultat-time').parents('.question-block').addClass('has-error');
                $('.consultat-time').parents('.question-block').find('.error').fadeIn(300);
            } else {
                $('.consultat-time').parents('.question-block').removeClass('has-error');
                $('.consultat-time').parents('.question-block').find('.error').fadeOut(300);
            }
        });
        function timeChange (){
            let logoutTime = $('.client-logout-time').val();
            let loginTime = $('.client-login-time').val();
            let sumEl = $('.client-sum-time');
            if(logoutTime && loginTime) {
                let logoutSeconds = timeToSeconds(logoutTime);
                let loginSeconds = timeToSeconds(loginTime);
                let differnt = logoutSeconds - loginSeconds;
                if(differnt > 0) {
                    let sumTime = secondsToTime (differnt);
                    sumEl.val(sumTime);
                    $('.client-logout-time').parents('.input-fieldset').removeClass('has-error');
                    $('.client-login-time').parents('.input-fieldset').removeClass('has-error');
                    $('.client-login-time').parents('.time-group').find('.time-error').fadeOut(300);
                } else {
                    $('.client-logout-time').parents('.input-fieldset').addClass('has-error');
                    $('.client-login-time').parents('.input-fieldset').addClass('has-error');
                    $('.client-login-time').parents('.time-group').find('.time-error').fadeIn(300);
                }
            }
        }
        function secondsToTime(totalSeconds){
            let hours   = Math.floor(totalSeconds / 3600)
            let minutes = Math.floor(totalSeconds / 60) % 60
            let seconds = totalSeconds % 60
            return [hours,minutes,seconds]
                .map(v => v < 10 ? "0" + v : v)
                // .filter((v,i) => v !== "00" || i > 0)
                .join(":")
        }
        function timeToSeconds(time){
            let timeSplit = time.split(':');
            var seconds = (+timeSplit[0]) * 60 * 60 + (+timeSplit[1]) * 60 + (+timeSplit[2]);
            return seconds;
        }
        $('.input-fieldset input').focus(function(e){
            $(this).parents('.input-fieldset').find('.input-label').addClass('inFocus');
            $(this).parents('.input-fieldset').addClass('focusActive');
        });

        $('.input-fieldset input').blur(function(e){
            $(this).parents('.input-fieldset').removeClass('focusActive');
        });

        $('.show-hidden').on('change', 'input', function(e){
            let inputs = $(this).parents('.show-hidden').find('input');
            for (let i = 0; i < inputs.length; i++) {
                if($(inputs[i]).attr('data-hidden')){
                    if($(inputs[i]).is(':checked')){
                        $($(inputs[i]).attr('data-hidden')).fadeIn(300);   
                    }
                    else {
                        if($(this).attr('data-hidden') !== $(inputs[i]).attr('data-hidden')){
                            $($(inputs[i]).attr('data-hidden')).fadeOut(300);   
                        }
                    }
                }
            }
        });


        // Restricts input for the set of matched elements to the given inputFilter function.
        (function($) {
            $.fn.inputFilter = function(inputFilter) {
                return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty("oldValue")) {
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                } else {
                    this.value = "";
                }
                });
            };
        }(jQuery));
        $('.integer').inputFilter(function(value) {
            return /^\d*$/.test(value);    // Allow digits only, using a RegExp
        });
        //input with calendar
        $('.date-input').datepicker({
            // format: "HH:ii:SS",
            language: 'ru-RU',
            autoClose: true,
            autoHide: true,
            endDate: '+1d',
        });
        //input with clock
        $('.time-input').clockpicker({
            donetext: 'Завершить'
        })
        customSelectActive();
        function customSelectActive(){
            $('.customselect').each(function(){
                if(!$(this).hasClass('select-hidden')){
                    if($(this).attr('multiple')){
                        $(this).parent().addClass('customselect-wrapper');
                        var $this = $(this),
                        numberOfOptions = $(this).children('option').length;
                        $this.addClass('select-hidden'); 
                        $this.wrap('<div class="select"></div>');
                        $this.after('<div class="select-styled"></div>');
                        var $styledSelect = $this.next('div.select-styled');
                        if($this.find('option:selected').length == 0){
                            $styledSelect.html('<div class="default">Выберите ответ</div>');
                        }
                        var $list = $('<ul />', {
                            'class': 'select-options'
                        }).insertAfter($styledSelect);
                        for (var i = 0; i < numberOfOptions; i++) {
                            var lioption;
                            var id = Math.floor(Math.random() * 100000);
                            $this.children('option').eq(i).attr('data-id', id);
                            if(!$($this.children('option').eq(i)[0]).attr('disabled')){
                                if($this.children('option').eq(i)[0].selected){
                                    $styledSelect.append('<div class="selectvalue" data-value="' + $this.children('option').eq(i).text() + '" data-id="'+ id + '">' + $this.children('option').eq(i).text() + '</div>');
                                    lioption = '<li rel="'+ $this.children('option').eq(i).val() + '" data-id="'+ id + '"><div class="checked active"></div><div class="text">'+ $this.children('option').eq(i).text() + '</div></li>';
                                }
                                else {
                                    lioption = '<li rel="'+ $this.children('option').eq(i).val() + '" data-id="'+ id + '" ><div class="checked"></div><div class="text">'+ $this.children('option').eq(i).text() + '</div></li>';
                                }
                            }
                            $(lioption).appendTo($list);
                        }
                    
                        var $listItems = $list.children('li');
                    
                        $styledSelect.click(function(e) {
                            e.stopPropagation();
                            $('div.select-styled.active').not(this).each(function(){
                                $(this).removeClass('active').next('ul.select-options').hide();
                            });
                            $(this).toggleClass('active').next('ul.select-options').toggle();
                        });
                    
                        $listItems.click(function(e) {
                            e.stopPropagation();
                            if($(e.currentTarget).find('.checked').hasClass('active')) {
                                $(e.currentTarget).find('.checked').removeClass('active');
                                var id = $(e.currentTarget).attr('data-id');
                                $styledSelect.find('.selectvalue[data-id="' + id + '"]').remove();
                                if($styledSelect.find('.selectvalue').length == 0){
                                    $styledSelect.html('<div class="default">Выберите ответ</div>');
                                }
                                $this.find('option[value="' + $(e.currentTarget).attr('rel') + '"][data-id="' + id + '"]').prop("selected", false)
                            }
                            else {
                                $(e.currentTarget).find('.checked').addClass('active');
                                var id = $(e.currentTarget).attr('data-id');
                                if($styledSelect.find('.default').length > 0){
                                    $styledSelect.find('.default').remove();
                                }
                                $styledSelect.append('<div class="selectvalue" data-value="' + $(e.currentTarget).attr('rel') + '" data-id="'+ id + '">' + $(e.currentTarget).attr('rel') + '</div>');
                                $this.find('option[value="' + $(e.currentTarget).attr('rel') + '"][data-id="' + id + '"]').prop("selected", true)
                            }
                            $this.change();
                        });

                        $(document).mousedown(function(e) {
                            if($(e.target).parents('.customselect-wrapper').length == 0) {
                                $styledSelect.removeClass('active');
                                $list.hide();
                            }
                        });

                        $(document).click(function() {
                            $styledSelect.removeClass('active');
                            $list.hide();
                        });
                    }
                    else {
                        $(this).parent().addClass('customselect-wrapper');
                        var $this = $(this),
                        numberOfOptions = $(this).children('option').length;
                        $this.addClass('select-hidden'); 
                        $this.wrap('<div class="select"></div>');
                        $this.after('<div class="select-styled"></div>');
                        var $styledSelect = $this.next('div.select-styled');
                        if($this.find('option:selected').length>0){
                            $styledSelect.text($this.find('option:selected').text());
                        }
                        else {
                            $styledSelect.text('Выберите ответ');
                        }
                    
                        var $list = $('<ul />', {
                            'class': 'select-options'
                        }).insertAfter($styledSelect);
                    
                        for (var i = 0; i < numberOfOptions; i++) {
                            if(!$this.children('option').eq(i).attr('disabled')){
                                var id = Math.floor(Math.random() * 100000);
                                $this.children('option').eq(i).attr('data-id', id);
                                lioption = '<li rel="'+ $this.children('option').eq(i).val() + '" data-id="'+ id + '">'+ $this.children('option').eq(i).text() + '</li>';
                                $(lioption).appendTo($list);
                            }
                        }
                    
                        var $listItems = $list.children('li');
                    
                        $styledSelect.click(function(e) {
                            e.stopPropagation();
                            $('div.select-styled.active').not(this).each(function(){
                                $(this).removeClass('active').next('ul.select-options').hide();
                            });
                            $(this).toggleClass('active').next('ul.select-options').toggle();
                        });
                    
                        $listItems.click(function(e) {
                            e.stopPropagation();
                            $styledSelect.text($(this).text()).removeClass('active');
                            $this.val($(this).attr('rel'));
                            $list.hide();
                            $this.change();
                        });
                        $(document).mousedown(function(e) {
                            if($(e.target).parents('.customselect-wrapper').length == 0) {
                                $styledSelect.removeClass('active');
                                $list.hide();
                            }
                        });
                        $(document).click(function() {
                            $styledSelect.removeClass('active');
                            $list.hide();
                        });
                    }
                }
            });   
        }

        $("textarea").each(function () {
            this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
        }).on("input", function () {
            this.style.height = "auto";
            this.style.height = (this.scrollHeight) + "px";
        });

        //main select choise
        $('.select-main').change(function(e){
            let selected = $(this).find('option:selected');
            let type = selected.attr('data-type');
            switch(type){
                case "admin":
                    $('.for-admin').fadeIn(300);
                    break;
                default: 
                    $('.for-admin').fadeOut(300);
            }
        });
        $('.questions-container').on('change', '.select-show-hidden', function(e){
            let options = $(this).find('option');
            let selected = $(this).find('option:selected');
            for (let i = 0; i < options.length; i++) {
                if($(options[i]).attr('data-hidden')){
                    if($(options[i]).is(':checked')){
                        $($(options[i]).attr('data-hidden')).fadeIn(300);   
                    }
                    else {
                        if($(selected).attr('data-hidden') !== $(options[i]).attr('data-hidden')){
                            $($(options[i]).attr('data-hidden')).fadeOut(300);
                        }
                    }
                }
            }
        });


        //validation
        var formValid = document.getElementsByClassName('form-valid')[0];
        $('.valid-form-send').click(function () {
            $(this).parents('form').submit(function (e) {
                e.preventDefault();
                var el = document.querySelectorAll('.form-valid [data-reqired]');
                var erroreArrayElemnts = [];

                for (var i = 0; i < el.length; i++) {
                    if (el[i].value === '' || el[i].value === ' ' || el[i].value === '-') {
                        if($(el[i]).is(':visible')){
                            erroreArrayElemnts.push(el[i]);
                            if($(el[i]).parents('.input-fieldset').length > 0){
                                $(el[i]).parents('.input-fieldset').addClass('has-error');
                                $(el[i]).focus(function(e){
                                    $(this).parents('.input-fieldset').removeClass('has-error');
                                });
                            }
                            else {
                                $(el[i]).parents('.question-block').addClass('has-error');
                                $(el[i]).focus(function(e){
                                    $(this).parents('.question-block').removeClass('has-error');
                                });
                            }
                        }
                    }
                }

                var el = document.querySelectorAll('.form-valid input[type="radio"][data-reqired=reqired]');
                for (var i = 0; i < el.length; i++) {
                    if (el[i].tagName === 'INPUT') {
                        var name = el[i].getAttribute('name');
                        if (document.querySelectorAll('[name=' + name + ']:checked').length === 0) {
                            if($(el[i]).parents('.radio-cont').length > 0){
                                if($(el[i]).parents('.radio-cont').is(':visible')){
                                    erroreArrayElemnts.push(el[i]);
                                    $(el[i]).parents('.question-block').addClass('has-error');
                                    var inputname = $(el[i]).attr('name');
                                    $('input[name='+ inputname + ']').change(function (e) {
                                        $(this).parents('.question-block').removeClass('has-error');
                                    });
                                }
                            }
                            else if($(el[i]).parents('.radio-item').is(':visible')){
                                erroreArrayElemnts.push(el[i]);
                                $(el[i]).parents('.question-block').addClass('has-error');
                                var inputname = $(el[i]).attr('name');
                                $('input[name='+ inputname + ']').change(function (e) {
                                    $(this).parents('.question-block').removeClass('has-error');
                                });
                            }
                        }
                    }
                }

                var el = document.querySelectorAll('.form-valid select[data-reqired=reqired]');
                for (var i = 0; i < el.length; i++) {
                    if (el[i].tagName === 'SELECT') {
                        if($(el[i]).attr('multiple')) {
                            if($(el[i]).val().length === 0){
                                if($(el[i]).parents('.select-answer').is(':visible')){
                                    erroreArrayElemnts.push(el[i]);
                                    $(el[i]).parents('.question-block').addClass('has-error');
                                    $(el[i]).change(function (e) {
                                        $(this).parents('.question-block').removeClass('has-error');
                                    }); 
                                }
                            }
                        }
                        else if (!$(el[i]).val()) {
                            if($(el[i]).parents('.select-answer').is(':visible')){
                                erroreArrayElemnts.push(el[i]);
                                $(el[i]).parents('.question-block').addClass('has-error');
                                $(el[i]).change(function (e) {
                                    $(this).parents('.question-block').removeClass('has-error');
                                });
                            }
                        }
                    }
                }

                if (erroreArrayElemnts.length == 0) {
                    formValid.submit();
                }
                if (erroreArrayElemnts.length > 0) {
                    console.log('Valid error');
                    erroreArrayElemnts.sort(function(a, b){
                        return parseInt($(a).parents('.question-block').offset().top)-parseInt($(b).parents('.question-block').offset().top)
                    });
                    console.log(erroreArrayElemnts);
                    var scroolTO = parseInt($(erroreArrayElemnts[0]).parents('.question-block').offset().top);
                    $("html, body").animate({ scrollTop: scroolTO }, 600);
                }
            });
        });
    });
});
