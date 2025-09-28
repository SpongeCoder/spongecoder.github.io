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
function trim(string) {
    return string.replace(/^\s+|\s+$/gm,'');
}

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
    var $input = $( ".input-text" );

    var focusOut = function (event) {
        var value         = $( this ).val(),
            $placeholder  = $( this ).next( ".input-placeholder" );

        $placeholder.removeClass( "is-focus" );
        $(this).removeClass('is-good');

        if ( value.length ) {
            $placeholder.addClass( "is-focus" );
            $(this).addClass('is-good');
        }
    }

    var focusIn = function (event) {
        $( this ).removeClass( "input--error" );
        $( this ).parent()
                 .find( ".input-error" )
                 .html( "" )
                 .removeAttr( "style" );
    }

    $input.on( "focusout", focusOut);
    $input.on( "focusin", focusIn);

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


} );


/*
 * Слайдер на главной стр.
 */
$('.js-mSlide').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    dots: true,
    autoplaySpeed: 4000,

    prevArrow:  $('.js-mSlide-arrow--left'),
    nextArrow:  $('.js-mSlide-arrow--right'),
    appendDots: $('.js-mSlide-dots')
});