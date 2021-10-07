function number_format ( number, decimals, decPoint, thousandsSep ) {
    //  Example 1: number_format(1234.56)
    //  returns 1: '1,235'
    //  example 2: number_format(1234.56, 2, ',', ' ')
    //  returns 2: '1 234,56'
    //  example 3: number_format(1234.5678, 2, '.', '')
    //  returns 3: '1234.57'
    //  example 4: number_format(67, 2, ',', '.')
    //  returns 4: '67,00'

    number = ( number + "" ).replace( /[^0-9+\-Ee.]/g, "" );
    var n = !isFinite( +number ) ? 0 : +number;
    var prec = !isFinite( +decimals ) ? 0 : Math.abs( decimals );
    var sep = ( typeof thousandsSep === "undefined" ) ? "," : thousandsSep;
    var dec = ( typeof decPoint === "undefined" ) ? "." : decPoint;
    var s = "";
    var toFixedFix = function( n, prec ) {
        var k = Math.pow( 10, prec );
        return "" + ( Math.round( n * k ) / k ).toFixed( prec );
    };

    // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
    s = ( prec ? toFixedFix( n, prec ) : "" + Math.round( n ) ).split( "." );
    if ( s[ 0 ].length > 3 ) {
        s[ 0 ] = s[ 0 ].replace( /\B(?=(?:\d{3})+(?!\d))/g, sep );
    }
    if ( ( s[ 1 ] || "" ).length < prec ) {
        s[ 1 ] = s[ 1 ] || "";
        s[ 1 ] += new Array( prec - s[ 1 ].length + 1 ).join( "0" );
    }
    return s.join( dec );
}
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
/**
 * Создает копию объекта
 * @param  {object} obj - Объект который нужно скопировать
 * @return {object} Копия объекта
 */
function cloneObj (obj) {
    var clone = {};

    for (var key in obj) {
      clone[key] = obj[key];
    }

    return clone;
}

$( function() {
    var $chat   = $( '.js-chat' ),
        $phone  = $( '.js-phone' );

    var chatFunction = function( event ) {
        event.preventDefault();
    };

    var phoneFunction = function( event ) {
        event.preventDefault();
    };

    $chat.on( 'click', chatFunction );
    $phone.on( 'click', chatFunction );
} );
$( function() {

    var clickHandler = 'click';
    var touchStartScreenY;
    var touchEndScreenY;

    function tSpoiler ( blockName, speed ) {
        var $spoilerBlock = $( '[data-show-spoiler=' + blockName + ']' );

        speed = ( speed != undefined ) ? speed : 300;

        if ( $spoilerBlock.length ) {
            $( '[data-spoiler=' + blockName + ']' ).toggleClass( 'is-active' ).toggleClass( 'is-open' );
            $spoilerBlock.slideToggle( speed ).toggleClass( 'is-hide' );
        }
    }

    function toggleSpoiler ( domElement, e ) {
        var nodeName    = domElement.nodeName,
            blockName   = $( domElement ).data( 'spoiler' ),
            speed       = $( domElement ).data( 'speed' );

        if ( nodeName == 'A' ) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Для Label заменям на change у checkbox'а
        if ( nodeName == 'LABEL' ) {
            var forId = $( domElement ).attr( 'for' );
            var $input = $( '#' + forId );

            if ( $input.attr( 'type' ) == 'checkbox' )
            {
                $input.on( 'change', function( e ) {
                    tSpoiler( blockName, speed );
                } );

                $( domElement ).removeClass( 'js-spoiler' );
                return;
            }
        }

        tSpoiler( blockName, speed );
    }

    /* Fix touch device */
    if ( 'ontouchstart' in document.documentElement && isMobile.iOS() ) {
        clickHandler = 'touchstart';

        $( document ).on( 'click', '.js-spoiler', function( e ) {
            if ( this.nodeName == 'A' ) {
                e.preventDefault();
                e.stopPropagation();
            }
        } );
    }

    $( document ).on( clickHandler, '.js-spoiler', function( e ) {
        if ( e.type == 'touchstart' ) {
            var touch = e.originalEvent.touches[ 0 ] || e.originalEvent.changedTouches[ 0 ];
            touchStartScreenY = touch.clientY;
        } else {
            toggleSpoiler( this, e );
        }
    } );

    $( document ).on( 'touchend', '.js-spoiler', function( e ) {
        var touch = e.originalEvent.touches[ 0 ] || e.originalEvent.changedTouches[ 0 ];

        touchEndScreenY = touch.clientY;
        if ( touchEndScreenY == touchStartScreenY || this.nodeName == 'A' ) {
            toggleSpoiler( this, e );
        }
    } );

} );
$( function() {
    "use strict";

    function Dots ( $slider ) {
        this.slider = $slider;

        this.parent;
        this.dots;
        this.content;
        this.flkty;

        var self = this;

        var init = function() {

            if ( !self.slider.length ) {
                return;
            }

            self.flkty   = self.slider.data( 'flickity' );
            self.parent  = self.slider.parents( '.slider' );
            self.dots    = self.parent.find( '.slider-dots' );
            self.content = self.parent.find( '.slider-content' );

            self.slider.on( 'dragEnd.flickity', playSlide );
            self.slider.on( 'select.flickity', selectActiveDots );

            self.createDots();
        };

        this.createDots = function() {
            self.dots.addClass( 'is-hide' );

            if ( self.flkty && self.flkty.slides.length > 1 ) {
                var $ul = createList( self.flkty );

                self.dots.append( $ul );
                self.dots.removeClass( 'is-hide' );
            }
        };

        this.clearDots = function() {
            self.dots.html( '' );
            self.dots.addClass( 'is-hide' );
        };

        /**
         * Событие возвпроизведения слайдера
         */
        var playSlide = function() {
            $( this ).flickity( 'playPlayer' );
        };

        /**
         * Событие выбора pageDots
         */
        var selectActiveDots = function() {
            var $li = self.parent.find( '.slider-dots__list li' ),
                selectIndex = 0;

            if ( self.flkty !== undefined ) {
                selectIndex = self.flkty.selectedIndex;
            }

            $li.filter( '.is-active' ).removeClass( 'is-active' );
            $li.eq( selectIndex ).addClass( 'is-active' );
        };

        /**
         * Создание списка с pageDots
         * @return {jQuerySelector}   - jQuery селектор список <ul>
         */
        var createList = function() {
            var $ul = $( '<ul />' ).addClass( 'slider-dots__list' ),
                z;

            for ( z = 0; z < self.flkty.slides.length; z += 1 ) {
                $ul.append( '<li />' );
            }

            $ul.find( 'li' ).eq( 0 ).addClass( 'is-active' );
            $ul.find( 'li' ).on( 'click', selectDotEvent );

            return $ul;
        };

        /**
         * Событие выбора слайдера
         */
        var selectDotEvent = function() {
            var index    = $( this ).index();

            self.content.flickity( 'select', index );
            self.content.flickity( 'pausePlayer' );
        };

        init();
    }

    /**
     * Конструктор для работы со слайдерами которые должны изменяться
     * в зависимости от размера экрана
     *
     * @param  {jQuery} $selector - jQuery селектор которым будет слайдер
     * @param  {object} setting   - Объект с настройками слайдера
     */
    var ResizeSlider = function( $slider, setting ) {
        var self = this;

        this.destroy = false;
        this.resize  = false;

        this.minSize = 480;
        this.slider  = $slider;
        this.setting = cloneObj( setting );
        this.dots;

        /**
         * Инициализация слайдера
         */
        var init = function() {
            if ( !self.slider.length ) {
                return;
            }

            self.createSlide();

            if ( $( window ).width() >= self.minSize ) {
                self.destroy = true;
                self.resize  = true;
            }
        };

        /**
         * Уничтожение слайдера
         */
        this.destroySlide = function() {
            self.dots.clearDots();

            if ( self.slider.data( 'flickity' ).length ) {
                self.slider.flickity( 'destroy' );
            }
        };

        /**
         * Создание слайдер и pageDots
         */
        this.createSlide = function() {
            self.slider.flickity( self.setting );
            self.dots = new Dots( self.slider );
        };

        /**
         * Убирает слайдер при ресайзе окна
         */
        this.onResizeDestroy = function() {
            var windowWidth = $( window ).width();

            if ( windowWidth >= self.minSize && self.destroy ) {
                self.destroy = false;
                self.destroySlide();
            }

            if ( windowWidth < self.minSize && !self.destroy ) {
                self.destroy = true;
                self.destroySlide();
                self.createSlide();
            }
        };

        /**
         * Групирование слайдеров при ресайзе окна
         */
        this.onResizeGroup = function() {
            var windowWidth = $( window ).width();

            if ( windowWidth >= self.minSize && self.resize ) {
                self.resize = false;
                self.setting.groupCells = 2;

                self.destroySlide();
                self.createSlide();
            }

            if ( windowWidth < self.minSize && !self.resize ) {
                self.resize = true;
                self.setting.groupCells = false;

                self.destroySlide();
                self.createSlide();
            }
        };

        init();
    };

    var slideSetting = {
        autoPlay: true,
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false,
        selectedAttraction: 0.01,
        friction: 0.15,
        dragThreshold: 20
    };

    var $sliderMain     = $( '.slider--main .slider-content' ).flickity( slideSetting ),
        $sliderReviews  = $( '.slider--reviews .slider-content' ).flickity( slideSetting );

    var dotsMainSlider  = new Dots( $sliderMain ),
        dotsReviews     = new Dots( $sliderReviews );

    // Слайдер на странице "О нас" в шапке
    var $sliderAbout = $( '.slider--about .slider-content' );
    if ( $sliderAbout.length )
    {
        var sliderAbout  = new ResizeSlider( $sliderAbout, slideSetting );

        sliderAbout.onResizeGroup();
        $( window ).resize( sliderAbout.onResizeGroup );
    }

    // Слайдер сертификатов
    var $sliderCertificate = $( '.slider--certificate .slider-content' );
    if ( $sliderCertificate.length )
    {
        slideSetting.wrapAround = false;
        var sliderCertificate   = new ResizeSlider( $sliderCertificate, slideSetting );

        sliderCertificate.onResizeGroup();
        $( window ).resize( sliderCertificate.onResizeGroup );
    }

    // Слайдер тарифов
    var $sliderTariff = $( '.slider--tariff .slider-content' );
    if ( $sliderTariff.length ) {
        slideSetting.autoPlay   = false;
        slideSetting.contain    = true;
        slideSetting.wrapAround = false;

        var sliderTariff = new ResizeSlider( $sliderTariff, slideSetting );
        sliderTariff.onResizeDestroy();

        $( window ).resize( sliderTariff.onResizeDestroy );
    }

} );
$( function() {

    var $body       = $( 'body' ),
        $menu       = $( '.menu' ),
        $sandwich   = $( '.sandwich' );

    var showMenuEvent = function( e ) {
        e.preventDefault();

        $menu.toggleClass( 'is-active' );
        $sandwich.toggleClass( 'is-active' );
        $body.toggleClass( 'is-active-menu' );
    };

    $sandwich.on( 'click', showMenuEvent );
} );
$( function()
{
    var slider          = $( '.tariff-range-slide__slide' )[ 0 ],
        $tariffPrice    = $( '.js-tariff-price' ),
        $monthMarker    = $( '.tariff-range-marker__item' ),
        $uiMarker, $uiValue;

    var settingRange = {
        start: 5,
        connect: 'lower',
        step: 5,
        range: { min: 0, max: 15 },
        pips: {
            mode: 'values',
            values: [ 0, 5, 10, 15 ],
            density: 25
        }
    };

    /**
     * Расчет скидки в зависимости от кол-ва месяцев
     */
    function changePriceTariff () {
        var discount  = parseInt( slider.noUiSlider.get() );

        discount = ( 100 - discount ) / 100;

        $tariffPrice.each( function() {
            var realPrice = $( this ).data( 'real-price' );

            if ( $( this ).data( 'discount' ) ) {
                realPrice = Math.ceil( realPrice * discount );
            }

            $( this ).html( number_format( realPrice, 0, '.', ' ' ) );
        } );
    }

    /**
     * Событие изменения скидки
     * @param  {integer} value - текущее значение
     */
    var changeUiSlider = function( value ) {
        $uiHandle.html( parseInt( value ) );

        $uiValue.each( function( index ) {
            $( this ).removeClass( 'is-active' );
            $monthMarker.eq( index ).removeClass( 'is-active' );

            if ( parseInt( $( this ).html() ) == value ) {
                $( this ).addClass( 'is-active' );
                $monthMarker.eq( index ).addClass( 'is-active' );
            }
        } );

        changePriceTariff();
    };

    if ( slider ) {
        noUiSlider.create( slider, settingRange );

        var $uiValue  = $( '.noUi-value' ),
            $uiHandle = $( '.noUi-handle' );

        slider.noUiSlider.on( 'update', changeUiSlider );
        changePriceTariff();
    }

} );
/**
* Расчет партнерского вознаграждения
*/
$( function() {
    var priceTariff = {
        opt: 1199,
        web: 700
    };

    var $rewardMonth     = $( '.js-reward-month' ),
        $rewardMonthNext = $( '.js-reward-month--next' ),
        $rewardYear      = $( '.js-reward-year' );

    var $radioOpt = $( '.js-reward-radio--opt' ),
        $radioWeb = $( '.js-reward-radio--web' );

    var $userInput      = $( '.js-reward-input' ),
        $userInputExtra = $( '.js-reward-input--extra' );

    var $userMinus = $( '.js-reward-minus' ),
        $userPlus  = $( '.js-reward-plus' );

    var $userMinusExtra = $( '.js-reward-minus--extra' ),
        $userPlusExtra  = $( '.js-reward-plus--extra' );

    var getUsers = function() {
        var user = {
                user: Math.abs( parseInt( $userInput.val() ) ),
                userExtra: Math.abs( parseInt( $userInputExtra.val() ) )
            };

        return user;
    };

    var setUsers = function( user ) {
        if ( isNaN( user.user ) || user.user <= 0 ) {
            user.user = 1;
        }

        if ( isNaN( user.userExtra ) || user.userExtra <= 0 ) {
            user.userExtra = 1;
        }

        if ( user.user > 200 ) user.user = 200;
        if ( user.userExtra > 200 ) user.userExtra = 200;

        $userInput.val( user.user );
        $userInputExtra.val( user.userExtra );
    };

    var userMinus =  function( event ) {
        event.preventDefault();
        var user = getUsers();

        user.user -= 1;
        setUsers( user );
        calcReward();
    };

    var userPlus =  function( event ) {
        event.preventDefault();
        var user = getUsers();

        user.user += 1;
        setUsers( user );
        calcReward();
    };

    var userMinusExtra =  function( event ) {
        event.preventDefault();
        var user = getUsers();

        user.userExtra -= 1;
        setUsers( user );
        calcReward();
    };

    var userPlusExtra =  function( event ) {
        event.preventDefault();
        var user = getUsers();

        user.userExtra += 1;
        setUsers( user );
        calcReward();
    };

    var changeInputs = function() {
        var user = getUsers();

        setUsers( user );
        calcReward();
    };

    var calcReward = function() {
        var user = getUsers(),
            month, monthNext, year, tariffPrice;

        if ( $radioOpt.prop( 'checked' ) ) {
            tariffPrice = priceTariff.opt;
        }

         if ( $radioWeb.prop( 'checked' ) ) {
            tariffPrice = priceTariff.web;
        }

        month       = user.user * user.userExtra * tariffPrice;
        monthNext   = user.user * user.userExtra * Math.ceil( tariffPrice * 0.1 );
        year        = month + monthNext * 11;

        $rewardMonth.text( number_format( month, 0, ',', ' ' ) );
        $rewardMonthNext.text( number_format( monthNext, 0, ',', ' ' ) );
        $rewardYear.text( number_format( year, 0, ',', ' ' ) );
    };

    $userInput.on( 'change keyup', changeInputs );
    $userInputExtra.on( 'change keyup', changeInputs );

    $radioOpt.on( 'change', changeInputs );
    $radioWeb.on( 'change', changeInputs );

    $userMinus.on( 'click', userMinus );
    $userPlus.on( 'click', userPlus );

    $userMinusExtra.on( 'click', userMinusExtra );
    $userPlusExtra.on( 'click', userPlusExtra );

    calcReward();
} );

$( function() {
    var $input = $( '.input-text' );

    var focusOut = function (event) {
        var value         = $( this ).val(),
            $placeholder  = $( this ).next( '.input-placeholder' );

        $placeholder.removeClass( 'is-focus' );
        $(this).removeClass('is-good');

        if ( value.length ) {
            $placeholder.addClass( 'is-focus' );
            $(this).addClass('is-good');
        }
    }

    var focusIn = function (event) {
        $( this ).removeClass( 'input--error' );
        $( this ).parent()
                 .find( '.input-error' )
                 .html( '' )
                 .removeAttr( 'style' );
    }

    $input.on( 'focusout', focusOut);
    $input.on( 'focusin', focusIn);

    $input.focusout();
} );
var validateSetting = {
    phone: {
        regExp: /^[0-9-+() ]{6,20}$/,
        error: [ 'Неверный номер телефона' ]
    },
    email: {
        regExp: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/,
        error: [
            'Неверный e-mail',
            'Пользователь с таким e-mail уже зарегистрирован',
            'Введенный e-mail не существует'
        ]
    },
    login: {
        regExp: [ /^[A-Za-z0-9]+$/, /^(?!sc)/ ],
        error: [
            'Логин должен состоять только из символов латинского алфавита и цифр',
            'Логин не может содержать текст формата sc*****',
            'Данный логин уже занят'
        ],
        minLength: 3,
        errorLength: 'Логин должен состоять как минимум из 3-х символов'
    },
    pass: {
        regExp: [ /^[A-Za-z0-9]+$/, /[A-Z]/, /[a-z]/, /[0-9]/ ],
        error: [
            'Присутствуют недопустимые символы',
            'Отсутствуют латинские заглавные буквы A - Z',
            'Отсутствуют латинские прописные буквы a - z',
            'Отсутствуют цифры 0 - 9'
            ],
        minLength: 8,
        errorLength: 'Пароль меньше 8 символов'
    },
    name: {
        minLength: 3,
        errorLength: 'Длина имени должна быть больше трех букв'
    }
};

function setErrorInput ( $error, text ) {
    var $span = $( '<span></span>' ).html( text ),
        height;

    $error.html( '' ).append( $span );
    height = $span.outerHeight();
    $error.css( 'height', height );
}

var inputValidate = function( $inputs ) {

    var eachInput = function() {
        currValidate = true;
        $inputs.each( function() {
            var validate    = $( this ).data( 'validate' ),                 // Тип валидации
                $error      = $( this ).parent().find( '.input-error' ),    // Куда писать ошибку
                value       = $( this ).val();                              // Значение

            // Continue
            if ( !$( this ).hasClass( 'js-validate' ) ) return true;

            // Если поля находятся в спойлере то пропускаем
            if ( $(this).parents('.is-hide').length ) return true;

            $( this ).removeClass( 'is-good' );

            if ( isEmpty( value ) ) {
                setErrorInput( $error, '* поле не заполнено' );
                $( this ).addClass( 'is-bad' );
                currValidate = false;
                return true;
            }

            if ( isLength( value, validate ) ) {
                setErrorInput( $error, validateSetting[ validate ].errorLength );
                $( this ).addClass( 'is-bad' );
                currValidate = false;
                return true;
            }

            errorRegExp = regExp( value, validate );
            if ( errorRegExp.length ) {
                setErrorInput( $error, errorRegExp );
                $( this ).addClass( 'is-bad' );
                currValidate = false;
                return true;
            }

            $( this ).removeClass( 'is-bad' ).addClass( 'is-good' );
            $error.html( '' );
        } );

        return currValidate;
    };

    var isEmpty = function( val ) {
        if ( val.length == 0 ) return true;
        return false;
    };

    var isLength = function( val, validateType ) {
        if ( !validateType ) return false;

        if ( validateSetting[ validateType ].hasOwnProperty( 'minLength' ) ) {
            if ( val.length < validateSetting[ validateType ].minLength ) return true;
        }
        return false;
    };

    var regExp = function( val, validateType ) {
        if ( !validateType ) return false;

        // Если необходимо проверить массив регулярок
        if ( Array.isArray( validateSetting[ validateType ].regExp ) ) {
            for ( var i = 0; i < validateSetting[ validateType ].regExp.length; i++ ) {
                if ( val.search( validateSetting[ validateType ].regExp[ i ] ) == -1 )
                    return validateSetting[ validateType ].error[ i ];
            }
        } else if ( val.search( validateSetting[ validateType ].regExp ) == -1 ) {
            return validateSetting[ validateType ].error[ 0 ];
        }

        return false;
    };

    return eachInput();
};
$( function() {
    var $formValidate = $( '.js-validate-form' );

    $formValidate.on( 'submit', function( event ) {
        var $input = $( this ).find( '.js-validate' );

        if ( !inputValidate( $input ) ) {
            event.preventDefault();
        }
    } );


    /* Дополнительные опции (Microsoft SQL Server) */
    var $tariffOptionForm     = $('.js-tariff-option'),
        $tariffOptionResponse = $('.js-tariff-option--response');

    $tariffOptionForm.on('submit', function (event) {
        event.preventDefault();

        var $input  = $( this ).find( '.js-validate' ),
            data    = { tel: $input.val() };

        if ( inputValidate( $input ) ) {
            $.post('/ajax_files/send_mail.php', data);

            $tariffOptionForm.hide();
            $tariffOptionResponse.fadeIn();
        }
    });

} );