/*!
 * jQuery Popup Overlay
 *
 * @version 1.7.10
 * @requires jQuery v1.7.1+
 * @link http://vast-engineering.github.com/jquery-popup-overlay/
 */
;(function ($) {

    var $window = $(window);
    var options = {};
    var zindexvalues = [];
    var lastclicked = [];
    var scrollbarwidth;
    var bodymarginright = null;
    var opensuffix = '_open';
    var closesuffix = '_close';
    var visiblePopupsArray = [];
    var transitionsupport = null;
    var opentimer;
    var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    var focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

    var methods = {

        _init: function (el) {
            var $el = $(el);
            var options = $el.data('popupoptions');
            lastclicked[el.id] = false;
            zindexvalues[el.id] = 0;

            if (!$el.data('popup-initialized')) {
                $el.attr('data-popup-initialized', 'true');
                methods._initonce(el);
            }

            if (options.autoopen) {
                setTimeout(function() {
                    methods.show(el, 0);
                }, 0);
            }
        },

        _initonce: function (el) {
            var $el = $(el);
            var $body = $('body');
            var $wrapper;
            var options = $el.data('popupoptions');
            var css;

            bodymarginright = parseInt($body.css('margin-right'), 10);
            transitionsupport = document.body.style.webkitTransition !== undefined ||
                                document.body.style.MozTransition !== undefined ||
                                document.body.style.msTransition !== undefined ||
                                document.body.style.OTransition !== undefined ||
                                document.body.style.transition !== undefined;

            if (options.type == 'tooltip') {
                options.background = false;
                options.scrolllock = false;
            }

            if (options.backgroundactive) {
                options.background = false;
                options.blur = false;
                options.scrolllock = false;
            }

            if (options.scrolllock) {
                // Calculate the browser's scrollbar width dynamically
                var parent;
                var child;
                if (typeof scrollbarwidth === 'undefined') {
                    parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
                    child = parent.children();
                    scrollbarwidth = child.innerWidth() - child.height(99).innerWidth();
                    parent.remove();
                }
            }

            if (!$el.attr('id')) {
                $el.attr('id', 'j-popup-' + parseInt((Math.random() * 100000000), 10));
            }

            $el.addClass('popup_content');

            $body.prepend(el);

            $el.wrap('<div id="' + el.id + '_wrapper" class="popup_wrapper" />');

            $wrapper = $('#' + el.id + '_wrapper');

            $wrapper.css({
                opacity: 0,
                visibility: 'hidden',
                position: 'absolute'
            });

            // Make div clickable in iOS
            if (iOS) {
                $wrapper.css('cursor', 'pointer');
            }

            if (options.type == 'overlay') {
                $wrapper.css('overflow','auto');
            }

            $el.css({
                opacity: 0,
                visibility: 'hidden',
                display: 'inline-block'
            });

            if (options.setzindex && !options.autozindex) {
                $wrapper.css('z-index', '100001');
            }

            if (!options.outline) {
                $el.css('outline', 'none');
            }

            if (options.transition) {
                $el.css('transition', options.transition);
                $wrapper.css('transition', options.transition);
            }

            // Hide popup content from screen readers initially
            $el.attr('aria-hidden', true);

            if ((options.background) && (!$('#' + el.id + '_background').length)) {

                $body.prepend('<div id="' + el.id + '_background" class="popup_background"></div>');

                var $background = $('#' + el.id + '_background');

                $background.css({
                    opacity: 0,
                    visibility: 'hidden',
                    backgroundColor: options.color,
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                });

                if (options.setzindex && !options.autozindex) {
                    $background.css('z-index', '100000');
                }

                if (options.transition) {
                    $background.css('transition', options.transition);
                }
            }

            if (options.type == 'overlay') {
                $el.css({
                    textAlign: 'left',
                    position: 'relative',
                    verticalAlign: 'middle'
                });

                css = {
                    position: 'fixed',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    textAlign: 'center'
                };

                if(options.backgroundactive){
                    css.position = 'relative';
                    css.height = '0';
                    css.overflow = 'visible';
                }

                $wrapper.css(css);

                // CSS vertical align helper
                $wrapper.append('<div class="popup_align" />');

                $('.popup_align').css({
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    height: '100%'
                });
            }

            // Add WAI ARIA role to announce dialog to screen readers
            $el.attr('role', 'dialog');

            var openelement =  (options.openelement) ? options.openelement : ('.' + el.id + opensuffix);

            $(openelement).each(function (i, item) {
                $(item).attr('data-popup-ordinal', i);

                if (!item.id) {
                    $(item).attr('id', 'open_' + parseInt((Math.random() * 100000000), 10));
                }
            });

            // Set aria-labelledby (if aria-label or aria-labelledby is not set in html)
            if (!($el.attr('aria-labelledby') || $el.attr('aria-label'))) {
                $el.attr('aria-labelledby', $(openelement).attr('id'));
            }

            // Show and hide tooltips on hover
            if(options.action == 'hover'){
                options.keepfocus = false;

                // Handler: mouseenter, focusin
                $(openelement).on('mouseenter', function (event) {
                    methods.show(el, $(this).data('popup-ordinal'));
                });

                // Handler: mouseleave, focusout
                $(openelement).on('mouseleave', function (event) {
                    methods.hide(el);
                });

            } else {

                // Handler: Show popup when clicked on `open` element
                $(document).on('click', openelement, function (event) {
                    event.preventDefault();

                    var ord = $(this).data('popup-ordinal');
                    setTimeout(function() { // setTimeout is to allow `close` method to finish (for issues with multiple tooltips)
                        methods.show(el, ord);
                    }, 0);
                });
            }

            if (options.closebutton) {
                methods.addclosebutton(el);
            }

            if (options.detach) {
                $el.hide().detach();
            } else {
                $wrapper.hide();
            }
        },

        /**
         * Show method
         *
         * @param {object} el - popup instance DOM node
         * @param {number} ordinal - order number of an `open` element
         */
        show: function (el, ordinal) {
            var $el = $(el);

            if ($el.data('popup-visible')) return;

            // Initialize if not initialized. Required for: $('#popup').popup('show')
            if (!$el.data('popup-initialized')) {
                methods._init(el);
            }
            $el.attr('data-popup-initialized', 'true');

            var $body = $('body');
            var options = $el.data('popupoptions');
            var $wrapper = $('#' + el.id + '_wrapper');
            var $background = $('#' + el.id + '_background');

            // `beforeopen` callback event
            callback(el, ordinal, options.beforeopen);

            // Remember last clicked place
            lastclicked[el.id] = ordinal;

            // Add popup id to visiblePopupsArray
            setTimeout(function() {
                visiblePopupsArray.push(el.id);
            }, 0);

            // Calculating maximum z-index
            if (options.autozindex) {

                var elements = document.getElementsByTagName('*');
                var len = elements.length;
                var maxzindex = 0;

                for(var i=0; i<len; i++){

                    var elementzindex = $(elements[i]).css('z-index');

                    if(elementzindex !== 'auto'){

                      elementzindex = parseInt(elementzindex, 10);

                      if(maxzindex < elementzindex){
                        maxzindex = elementzindex;
                      }
                    }
                }

                zindexvalues[el.id] = maxzindex;

                // Add z-index to the background
                if (options.background) {
                    if (zindexvalues[el.id] > 0) {
                        $('#' + el.id + '_background').css({
                            zIndex: (zindexvalues[el.id] + 1)
                        });
                    }
                }

                // Add z-index to the wrapper
                if (zindexvalues[el.id] > 0) {
                    $wrapper.css({
                        zIndex: (zindexvalues[el.id] + 2)
                    });
                }
            }

            if (options.detach) {
                $wrapper.prepend(el);
                $el.show();
            } else {
                $wrapper.show();
            }

            opentimer = setTimeout(function() {
                $wrapper.css({
                    visibility: 'visible',
                    opacity: 1
                });

                $('html').addClass('popup_visible').addClass('popup_visible_' + el.id);
                $wrapper.addClass('popup_wrapper_visible');
            }, 20); // 20ms required for opening animation to occur in FF

            // Disable background layer scrolling when popup is opened
            if (options.scrolllock) {
                $body.css('overflow', 'hidden');
                if ($body.height() > $window.height()) {
                    $body.css('margin-right', bodymarginright + scrollbarwidth);
                }
            }

            if(options.backgroundactive){
                //calculates the vertical align
                $el.css({
                    top:(
                        $window.height() - (
                            $el.get(0).offsetHeight +
                            parseInt($el.css('margin-top'), 10) +
                            parseInt($el.css('margin-bottom'), 10)
                        )
                    )/2 +'px'
                });
            }

            $el.css({
                'visibility': 'visible',
                'opacity': 1
            });

            // Show background
            if (options.background) {
                $background.css({
                    'visibility': 'visible',
                    'opacity': options.opacity
                });

                // Fix IE8 issue with background not appearing
                setTimeout(function() {
                    $background.css({
                        'opacity': options.opacity
                    });
                }, 0);
            }

            $el.data('popup-visible', true);

            // Position popup
            methods.reposition(el, ordinal);

            // Remember which element had focus before opening a popup
            $el.data('focusedelementbeforepopup', document.activeElement);

            // Handler: Keep focus inside dialog box
            if (options.keepfocus) {
                // Make holder div focusable
                $el.attr('tabindex', -1);

                // Focus popup or user specified element.
                // Initial timeout of 50ms is set to give some time to popup to show after clicking on
                // `open` element, and after animation is complete to prevent background scrolling.
                setTimeout(function() {
                    if (options.focuselement === 'closebutton') {
                        $('#' + el.id + ' .' + el.id + closesuffix + ':first').focus();
                    } else if (options.focuselement) {
                        $(options.focuselement).focus();
                    } else {
                        $el.focus();
                    }
                }, options.focusdelay);

            }

            // Hide main content from screen readers
            $(options.pagecontainer).attr('aria-hidden', true);

            // Reveal popup content to screen readers
            $el.attr('aria-hidden', false);

            callback(el, ordinal, options.onopen);

            if (transitionsupport) {
                $wrapper.one('transitionend', function() {
                    callback(el, ordinal, options.opentransitionend);
                });
            } else {
                callback(el, ordinal, options.opentransitionend);
            }
        },

        /**
         * Hide method
         *
         * @param object el - popup instance DOM node
         * @param boolean outerClick - click on the outer content below popup
         */
        hide: function (el, outerClick) {
            // Get index of popup ID inside of visiblePopupsArray
            var popupIdIndex = $.inArray(el.id, visiblePopupsArray);

            // If popup is not opened, ignore the rest of the function
            if (popupIdIndex === -1) {
                return;
            }

            if(opentimer) clearTimeout(opentimer);

            var $body = $('body');
            var $el = $(el);
            var options = $el.data('popupoptions');
            var $wrapper = $('#' + el.id + '_wrapper');
            var $background = $('#' + el.id + '_background');

            $el.data('popup-visible', false);

            if (visiblePopupsArray.length === 1) {
                $('html').removeClass('popup_visible').removeClass('popup_visible_' + el.id);
            } else {
                if($('html').hasClass('popup_visible_' + el.id)) {
                    $('html').removeClass('popup_visible_' + el.id);
                }
            }

            // Remove popup from the visiblePopupsArray
            visiblePopupsArray.splice(popupIdIndex, 1);

            if($wrapper.hasClass('popup_wrapper_visible')) {
                $wrapper.removeClass('popup_wrapper_visible');
            }

            // Focus back on saved element
            if (options.keepfocus && !outerClick) {
                setTimeout(function() {
                    if ($($el.data('focusedelementbeforepopup')).is(':visible')) {
                        $el.data('focusedelementbeforepopup').focus();
                    }
                }, 0);
            }

            // Hide popup
            $wrapper.css({
                'visibility': 'hidden',
                'opacity': 0
            });
            $el.css({
                'visibility': 'hidden',
                'opacity': 0
            });

            // Hide background
            if (options.background) {
                $background.css({
                    'visibility': 'hidden',
                    'opacity': 0
                });
            }

            // Reveal main content to screen readers
            $(options.pagecontainer).attr('aria-hidden', false);

            // Hide popup content from screen readers
            $el.attr('aria-hidden', true);

            // `onclose` callback event
            callback(el, lastclicked[el.id], options.onclose);

            if (transitionsupport && $el.css('transition-duration') !== '0s') {
                $el.one('transitionend', function(e) {

                    if (!($el.data('popup-visible'))) {
                        if (options.detach) {
                            $el.hide().detach();
                        } else {
                            $wrapper.hide();
                        }
                    }

                    // Re-enable scrolling of background layer
                    if (options.scrolllock) {
                        setTimeout(function() {
                            $body.css({
                                overflow: 'visible',
                                'margin-right': bodymarginright
                            });
                        }, 10); // 10ms added for CSS transition in Firefox which doesn't like overflow:auto
                    }

                    callback(el, lastclicked[el.id], options.closetransitionend);
                });
            } else {
                if (options.detach) {
                    $el.hide().detach();
                } else {
                    $wrapper.hide();
                }

                // Re-enable scrolling of background layer
                if (options.scrolllock) {
                    setTimeout(function() {
                        $body.css({
                            overflow: 'visible',
                            'margin-right': bodymarginright
                        });
                    }, 10); // 10ms added for CSS transition in Firefox which doesn't like overflow:auto
                }

                callback(el, lastclicked[el.id], options.closetransitionend);
            }

        },

        /**
         * Toggle method
         *
         * @param {object} el - popup instance DOM node
         * @param {number} ordinal - order number of an `open` element
         */
        toggle: function (el, ordinal) {
            if ($(el).data('popup-visible')) {
                methods.hide(el);
            } else {
                setTimeout(function() {
                    methods.show(el, ordinal);
                }, 0);
            }
        },

        /**
         * Reposition method
         *
         * @param {object} el - popup instance DOM node
         * @param {number} ordinal - order number of an `open` element
         */
        reposition: function (el, ordinal) {
            var $el = $(el);
            var options = $el.data('popupoptions');
            var $wrapper = $('#' + el.id + '_wrapper');
            var $background = $('#' + el.id + '_background');

            ordinal = ordinal || 0;

            // Tooltip type
            if (options.type == 'tooltip') {
                $wrapper.css({
                    'position': 'absolute'
                });

                var $tooltipanchor;
                if (options.tooltipanchor) {
                    $tooltipanchor = $(options.tooltipanchor);
                } else if (options.openelement) {
                    $tooltipanchor = $(options.openelement).filter('[data-popup-ordinal="' + ordinal + '"]');
                } else {
                    $tooltipanchor = $('.' + el.id + opensuffix + '[data-popup-ordinal="' + ordinal + '"]');
                }

                var linkOffset = $tooltipanchor.offset();

                // Horizontal position for tooltip
                if (options.horizontal == 'right') {
                    $wrapper.css('left', linkOffset.left + $tooltipanchor.outerWidth() + options.offsetleft);
                } else if (options.horizontal == 'leftedge') {
                    $wrapper.css('left', linkOffset.left + $tooltipanchor.outerWidth() - $tooltipanchor.outerWidth() +  options.offsetleft);
                } else if (options.horizontal == 'left') {
                    $wrapper.css('right', $window.width() - linkOffset.left  - options.offsetleft);
                } else if (options.horizontal == 'rightedge') {
                    $wrapper.css('right', $window.width()  - linkOffset.left - $tooltipanchor.outerWidth() - options.offsetleft);
                } else {
                    $wrapper.css('left', linkOffset.left + ($tooltipanchor.outerWidth() / 2) - ($el.outerWidth() / 2) - parseFloat($el.css('marginLeft')) + options.offsetleft);
                }

                // Vertical position for tooltip
                if (options.vertical == 'bottom') {
                    $wrapper.css('top', linkOffset.top + $tooltipanchor.outerHeight() + options.offsettop);
                } else if (options.vertical == 'bottomedge') {
                    $wrapper.css('top', linkOffset.top + $tooltipanchor.outerHeight() - $el.outerHeight() + options.offsettop);
                } else if (options.vertical == 'top') {
                    $wrapper.css('bottom', $window.height() - linkOffset.top - options.offsettop);
                } else if (options.vertical == 'topedge') {
                    $wrapper.css('bottom', $window.height() - linkOffset.top - $el.outerHeight() - options.offsettop);
                } else {
                    $wrapper.css('top', linkOffset.top + ($tooltipanchor.outerHeight() / 2) - ($el.outerHeight() / 2) - parseFloat($el.css('marginTop')) + options.offsettop);
                }

            // Overlay type
            } else if (options.type == 'overlay') {

                // Horizontal position for overlay
                if (options.horizontal) {
                    $wrapper.css('text-align', options.horizontal);
                } else {
                    $wrapper.css('text-align', 'center');
                }

                // Vertical position for overlay
                if (options.vertical) {
                    $el.css('vertical-align', options.vertical);
                } else {
                    $el.css('vertical-align', 'middle');
                }
            }
        },

        /**
         * Add-close-button method
         *
         * @param {object} el - popup instance DOM node
         */
        addclosebutton: function (el) {
            var genericCloseButton;

            if ($(el).data('popupoptions').closebuttonmarkup) {
                genericCloseButton = $(options.closebuttonmarkup).addClass(el.id + '_close');
            } else {
                genericCloseButton = '<button class="popup_close ' + el.id + '_close" title="Close" aria-label="Close"><span aria-hidden="true">×</span></button>';
            }

            if ($el.data('popup-initialized')){
                $el.append(genericCloseButton);
            }

        }

    };

    /**
     * Callback event calls
     *
     * @param {object} el - popup instance DOM node
     * @param {number} ordinal - order number of an `open` element
     * @param {function} func - callback function
     */
    var callback = function (el, ordinal, func) {
        var options = $(el).data('popupoptions');
        var openelement =  (options.openelement) ? options.openelement : ('.' + el.id + opensuffix);
        var elementclicked = $(openelement + '[data-popup-ordinal="' + ordinal + '"]');
        if (typeof func == 'function') {
            func.call($(el), el, elementclicked);
        }
    };

    // Hide popup if ESC key is pressed
    $(document).on('keydown', function (event) {
        if(visiblePopupsArray.length) {
            var elementId = visiblePopupsArray[visiblePopupsArray.length - 1];
            var el = document.getElementById(elementId);

            if ($(el).data('popupoptions').escape && event.keyCode == 27) {
                methods.hide(el);
            }
        }
    });

    // Hide popup on click
    $(document).on('click', function (event) {
        if(visiblePopupsArray.length) {
            var elementId = visiblePopupsArray[visiblePopupsArray.length - 1];
            var el = document.getElementById(elementId);
            var closeButton = ($(el).data('popupoptions').closeelement) ? $(el).data('popupoptions').closeelement : ('.' + el.id + closesuffix);

            // If Close button clicked
            if ($(event.target).closest(closeButton).length) {
                event.preventDefault();
                methods.hide(el);
            }

            // If clicked outside of popup
            if ($(el).data('popupoptions').blur && !$(event.target).closest('#' + elementId).length && event.which !== 2 && $(event.target).is(':visible')) {

                if ($(el).data('popupoptions').background) {
                    // If clicked on popup cover
                    methods.hide(el);

                    // Older iOS/Safari will trigger a click on the elements below the cover,
                    // when tapping on the cover, so the default action needs to be prevented.
                    event.preventDefault();

                } else {
                    // If clicked on outer content
                    methods.hide(el, true);
                }
            }
        }
    });

    // Keep keyboard focus inside of popup
    $(document).on('keydown', function(event) {
        if(visiblePopupsArray.length && event.which == 9) {

            // If tab or shift-tab pressed
            var elementId = visiblePopupsArray[visiblePopupsArray.length - 1];
            var el = document.getElementById(elementId);

            // Get list of all children elements in given object
            var popupItems = $(el).find('*');

            // Get list of focusable items
            var focusableItems = popupItems.filter(focusableElementsString).filter(':visible');

            // Get currently focused item
            var focusedItem = $(':focus');

            // Get the number of focusable items
            var numberOfFocusableItems = focusableItems.length;

            // Get the index of the currently focused item
            var focusedItemIndex = focusableItems.index(focusedItem);

            // If popup doesn't contain focusable elements, focus popup itself
            if (numberOfFocusableItems === 0) {
                $(el).focus();
                event.preventDefault();
            } else {
                if (event.shiftKey) {
                    // Back tab
                    // If focused on first item and user preses back-tab, go to the last focusable item
                    if (focusedItemIndex === 0) {
                        focusableItems.get(numberOfFocusableItems - 1).focus();
                        event.preventDefault();
                    }

                } else {
                    // Forward tab
                    // If focused on the last item and user preses tab, go to the first focusable item
                    if (focusedItemIndex == numberOfFocusableItems - 1) {
                        focusableItems.get(0).focus();
                        event.preventDefault();
                    }
                }
            }
        }
    });

    /**
     * Plugin API
     */
    $.fn.popup = function (customoptions) {
        return this.each(function () {

            var $el = $(this);

            if (typeof customoptions === 'object') {  // e.g. $('#popup').popup({'color':'blue'})
                var opt = $.extend({}, $.fn.popup.defaults, customoptions, $el.data('popupoptions'));
                $el.data('popupoptions', opt);
                options = $el.data('popupoptions');

                methods._init(this);

            } else if (typeof customoptions === 'string') { // e.g. $('#popup').popup('hide')
                if (!($el.data('popupoptions'))) {
                    $el.data('popupoptions', $.fn.popup.defaults);
                    options = $el.data('popupoptions');
                }

                methods[customoptions].call(this, this);

            } else { // e.g. $('#popup').popup()
                if (!($el.data('popupoptions'))) {
                    $el.data('popupoptions', $.fn.popup.defaults);
                    options = $el.data('popupoptions');
                }

                methods._init(this);

            }

        });
    };

    $.fn.popup.defaults = {
        type: 'overlay',
        autoopen: false,
        background: true,
        backgroundactive: false,
        color: 'black',
        opacity: '0.5',
        horizontal: 'center',
        vertical: 'middle',
        offsettop: 0,
        offsetleft: 0,
        escape: true,
        blur: true,
        setzindex: true,
        autozindex: false,
        scrolllock: false,
        closebutton: false,
        closebuttonmarkup: null,
        keepfocus: true,
        focuselement: null,
        focusdelay: 50,
        outline: false,
        pagecontainer: null,
        detach: false,
        openelement: null,
        closeelement: null,
        transition: null,
        tooltipanchor: null,
        beforeopen: null,
        onclose: null,
        onopen: null,
        opentransitionend: null,
        closetransitionend: null
    };

})(jQuery);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5wb3B1cG92ZXJsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImxpYnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcclxuICogalF1ZXJ5IFBvcHVwIE92ZXJsYXlcclxuICpcclxuICogQHZlcnNpb24gMS43LjEwXHJcbiAqIEByZXF1aXJlcyBqUXVlcnkgdjEuNy4xK1xyXG4gKiBAbGluayBodHRwOi8vdmFzdC1lbmdpbmVlcmluZy5naXRodWIuY29tL2pxdWVyeS1wb3B1cC1vdmVybGF5L1xyXG4gKi9cclxuOyhmdW5jdGlvbiAoJCkge1xyXG5cclxuICAgIHZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xyXG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcclxuICAgIHZhciB6aW5kZXh2YWx1ZXMgPSBbXTtcclxuICAgIHZhciBsYXN0Y2xpY2tlZCA9IFtdO1xyXG4gICAgdmFyIHNjcm9sbGJhcndpZHRoO1xyXG4gICAgdmFyIGJvZHltYXJnaW5yaWdodCA9IG51bGw7XHJcbiAgICB2YXIgb3BlbnN1ZmZpeCA9ICdfb3Blbic7XHJcbiAgICB2YXIgY2xvc2VzdWZmaXggPSAnX2Nsb3NlJztcclxuICAgIHZhciB2aXNpYmxlUG9wdXBzQXJyYXkgPSBbXTtcclxuICAgIHZhciB0cmFuc2l0aW9uc3VwcG9ydCA9IG51bGw7XHJcbiAgICB2YXIgb3BlbnRpbWVyO1xyXG4gICAgdmFyIGlPUyA9IC8oaVBhZHxpUGhvbmV8aVBvZCkvZy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG4gICAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nID0gXCJhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCAqW3RhYmluZGV4XSwgKltjb250ZW50ZWRpdGFibGVdXCI7XHJcblxyXG4gICAgdmFyIG1ldGhvZHMgPSB7XHJcblxyXG4gICAgICAgIF9pbml0OiBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICAgICAgdmFyICRlbCA9ICQoZWwpO1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9ICRlbC5kYXRhKCdwb3B1cG9wdGlvbnMnKTtcclxuICAgICAgICAgICAgbGFzdGNsaWNrZWRbZWwuaWRdID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHppbmRleHZhbHVlc1tlbC5pZF0gPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkZWwuZGF0YSgncG9wdXAtaW5pdGlhbGl6ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgJGVsLmF0dHIoJ2RhdGEtcG9wdXAtaW5pdGlhbGl6ZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kcy5faW5pdG9uY2UoZWwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5hdXRvb3Blbikge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2RzLnNob3coZWwsIDApO1xyXG4gICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfaW5pdG9uY2U6IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICB2YXIgJGVsID0gJChlbCk7XHJcbiAgICAgICAgICAgIHZhciAkYm9keSA9ICQoJ2JvZHknKTtcclxuICAgICAgICAgICAgdmFyICR3cmFwcGVyO1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9ICRlbC5kYXRhKCdwb3B1cG9wdGlvbnMnKTtcclxuICAgICAgICAgICAgdmFyIGNzcztcclxuXHJcbiAgICAgICAgICAgIGJvZHltYXJnaW5yaWdodCA9IHBhcnNlSW50KCRib2R5LmNzcygnbWFyZ2luLXJpZ2h0JyksIDEwKTtcclxuICAgICAgICAgICAgdHJhbnNpdGlvbnN1cHBvcnQgPSBkb2N1bWVudC5ib2R5LnN0eWxlLndlYmtpdFRyYW5zaXRpb24gIT09IHVuZGVmaW5lZCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuTW96VHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5tc1RyYW5zaXRpb24gIT09IHVuZGVmaW5lZCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuT1RyYW5zaXRpb24gIT09IHVuZGVmaW5lZCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMudHlwZSA9PSAndG9vbHRpcCcpIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuYmFja2dyb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5zY3JvbGxsb2NrID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmJhY2tncm91bmRhY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuYmFja2dyb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5ibHVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLnNjcm9sbGxvY2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2Nyb2xsbG9jaykge1xyXG4gICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBicm93c2VyJ3Mgc2Nyb2xsYmFyIHdpZHRoIGR5bmFtaWNhbGx5XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50O1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzY3JvbGxiYXJ3aWR0aCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSAkKCc8ZGl2IHN0eWxlPVwid2lkdGg6NTBweDtoZWlnaHQ6NTBweDtvdmVyZmxvdzphdXRvXCI+PGRpdi8+PC9kaXY+JykuYXBwZW5kVG8oJ2JvZHknKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IHBhcmVudC5jaGlsZHJlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbGJhcndpZHRoID0gY2hpbGQuaW5uZXJXaWR0aCgpIC0gY2hpbGQuaGVpZ2h0KDk5KS5pbm5lcldpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoISRlbC5hdHRyKCdpZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkZWwuYXR0cignaWQnLCAnai1wb3B1cC0nICsgcGFyc2VJbnQoKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMDApLCAxMCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkZWwuYWRkQ2xhc3MoJ3BvcHVwX2NvbnRlbnQnKTtcclxuXHJcbiAgICAgICAgICAgICRib2R5LnByZXBlbmQoZWwpO1xyXG5cclxuICAgICAgICAgICAgJGVsLndyYXAoJzxkaXYgaWQ9XCInICsgZWwuaWQgKyAnX3dyYXBwZXJcIiBjbGFzcz1cInBvcHVwX3dyYXBwZXJcIiAvPicpO1xyXG5cclxuICAgICAgICAgICAgJHdyYXBwZXIgPSAkKCcjJyArIGVsLmlkICsgJ193cmFwcGVyJyk7XHJcblxyXG4gICAgICAgICAgICAkd3JhcHBlci5jc3Moe1xyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcclxuICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6ICdoaWRkZW4nLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIGRpdiBjbGlja2FibGUgaW4gaU9TXHJcbiAgICAgICAgICAgIGlmIChpT1MpIHtcclxuICAgICAgICAgICAgICAgICR3cmFwcGVyLmNzcygnY3Vyc29yJywgJ3BvaW50ZXInKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMudHlwZSA9PSAnb3ZlcmxheScpIHtcclxuICAgICAgICAgICAgICAgICR3cmFwcGVyLmNzcygnb3ZlcmZsb3cnLCdhdXRvJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRlbC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcclxuICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6ICdoaWRkZW4nLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaydcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zZXR6aW5kZXggJiYgIW9wdGlvbnMuYXV0b3ppbmRleCkge1xyXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKCd6LWluZGV4JywgJzEwMDAwMScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMub3V0bGluZSkge1xyXG4gICAgICAgICAgICAgICAgJGVsLmNzcygnb3V0bGluZScsICdub25lJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICRlbC5jc3MoJ3RyYW5zaXRpb24nLCBvcHRpb25zLnRyYW5zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKCd0cmFuc2l0aW9uJywgb3B0aW9ucy50cmFuc2l0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSGlkZSBwb3B1cCBjb250ZW50IGZyb20gc2NyZWVuIHJlYWRlcnMgaW5pdGlhbGx5XHJcbiAgICAgICAgICAgICRlbC5hdHRyKCdhcmlhLWhpZGRlbicsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKChvcHRpb25zLmJhY2tncm91bmQpICYmICghJCgnIycgKyBlbC5pZCArICdfYmFja2dyb3VuZCcpLmxlbmd0aCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAkYm9keS5wcmVwZW5kKCc8ZGl2IGlkPVwiJyArIGVsLmlkICsgJ19iYWNrZ3JvdW5kXCIgY2xhc3M9XCJwb3B1cF9iYWNrZ3JvdW5kXCI+PC9kaXY+Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyICRiYWNrZ3JvdW5kID0gJCgnIycgKyBlbC5pZCArICdfYmFja2dyb3VuZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICRiYWNrZ3JvdW5kLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiAnaGlkZGVuJyxcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IG9wdGlvbnMuY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbTogMCxcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5zZXR6aW5kZXggJiYgIW9wdGlvbnMuYXV0b3ppbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRiYWNrZ3JvdW5kLmNzcygnei1pbmRleCcsICcxMDAwMDAnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGJhY2tncm91bmQuY3NzKCd0cmFuc2l0aW9uJywgb3B0aW9ucy50cmFuc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMudHlwZSA9PSAnb3ZlcmxheScpIHtcclxuICAgICAgICAgICAgICAgICRlbC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ2xlZnQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBjc3MgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMuYmFja2dyb3VuZGFjdGl2ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY3NzLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuICAgICAgICAgICAgICAgICAgICBjc3MuaGVpZ2h0ID0gJzAnO1xyXG4gICAgICAgICAgICAgICAgICAgIGNzcy5vdmVyZmxvdyA9ICd2aXNpYmxlJztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkd3JhcHBlci5jc3MoY3NzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDU1MgdmVydGljYWwgYWxpZ24gaGVscGVyXHJcbiAgICAgICAgICAgICAgICAkd3JhcHBlci5hcHBlbmQoJzxkaXYgY2xhc3M9XCJwb3B1cF9hbGlnblwiIC8+Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnLnBvcHVwX2FsaWduJykuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBXQUkgQVJJQSByb2xlIHRvIGFubm91bmNlIGRpYWxvZyB0byBzY3JlZW4gcmVhZGVyc1xyXG4gICAgICAgICAgICAkZWwuYXR0cigncm9sZScsICdkaWFsb2cnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvcGVuZWxlbWVudCA9ICAob3B0aW9ucy5vcGVuZWxlbWVudCkgPyBvcHRpb25zLm9wZW5lbGVtZW50IDogKCcuJyArIGVsLmlkICsgb3BlbnN1ZmZpeCk7XHJcblxyXG4gICAgICAgICAgICAkKG9wZW5lbGVtZW50KS5lYWNoKGZ1bmN0aW9uIChpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAkKGl0ZW0pLmF0dHIoJ2RhdGEtcG9wdXAtb3JkaW5hbCcsIGkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghaXRlbS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoaXRlbSkuYXR0cignaWQnLCAnb3Blbl8nICsgcGFyc2VJbnQoKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMDApLCAxMCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCBhcmlhLWxhYmVsbGVkYnkgKGlmIGFyaWEtbGFiZWwgb3IgYXJpYS1sYWJlbGxlZGJ5IGlzIG5vdCBzZXQgaW4gaHRtbClcclxuICAgICAgICAgICAgaWYgKCEoJGVsLmF0dHIoJ2FyaWEtbGFiZWxsZWRieScpIHx8ICRlbC5hdHRyKCdhcmlhLWxhYmVsJykpKSB7XHJcbiAgICAgICAgICAgICAgICAkZWwuYXR0cignYXJpYS1sYWJlbGxlZGJ5JywgJChvcGVuZWxlbWVudCkuYXR0cignaWQnKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFNob3cgYW5kIGhpZGUgdG9vbHRpcHMgb24gaG92ZXJcclxuICAgICAgICAgICAgaWYob3B0aW9ucy5hY3Rpb24gPT0gJ2hvdmVyJyl7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmtlZXBmb2N1cyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZXI6IG1vdXNlZW50ZXIsIGZvY3VzaW5cclxuICAgICAgICAgICAgICAgICQob3BlbmVsZW1lbnQpLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy5zaG93KGVsLCAkKHRoaXMpLmRhdGEoJ3BvcHVwLW9yZGluYWwnKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGVyOiBtb3VzZWxlYXZlLCBmb2N1c291dFxyXG4gICAgICAgICAgICAgICAgJChvcGVuZWxlbWVudCkub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2RzLmhpZGUoZWwpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZXI6IFNob3cgcG9wdXAgd2hlbiBjbGlja2VkIG9uIGBvcGVuYCBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCBvcGVuZWxlbWVudCwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9yZCA9ICQodGhpcykuZGF0YSgncG9wdXAtb3JkaW5hbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IC8vIHNldFRpbWVvdXQgaXMgdG8gYWxsb3cgYGNsb3NlYCBtZXRob2QgdG8gZmluaXNoIChmb3IgaXNzdWVzIHdpdGggbXVsdGlwbGUgdG9vbHRpcHMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZHMuc2hvdyhlbCwgb3JkKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jbG9zZWJ1dHRvbikge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kcy5hZGRjbG9zZWJ1dHRvbihlbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRldGFjaCkge1xyXG4gICAgICAgICAgICAgICAgJGVsLmhpZGUoKS5kZXRhY2goKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICR3cmFwcGVyLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNob3cgbWV0aG9kXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZWwgLSBwb3B1cCBpbnN0YW5jZSBET00gbm9kZVxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvcmRpbmFsIC0gb3JkZXIgbnVtYmVyIG9mIGFuIGBvcGVuYCBlbGVtZW50XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2hvdzogZnVuY3Rpb24gKGVsLCBvcmRpbmFsKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWwgPSAkKGVsKTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkZWwuZGF0YSgncG9wdXAtdmlzaWJsZScpKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAvLyBJbml0aWFsaXplIGlmIG5vdCBpbml0aWFsaXplZC4gUmVxdWlyZWQgZm9yOiAkKCcjcG9wdXAnKS5wb3B1cCgnc2hvdycpXHJcbiAgICAgICAgICAgIGlmICghJGVsLmRhdGEoJ3BvcHVwLWluaXRpYWxpemVkJykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZHMuX2luaXQoZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRlbC5hdHRyKCdkYXRhLXBvcHVwLWluaXRpYWxpemVkJywgJ3RydWUnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciAkYm9keSA9ICQoJ2JvZHknKTtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSAkZWwuZGF0YSgncG9wdXBvcHRpb25zJyk7XHJcbiAgICAgICAgICAgIHZhciAkd3JhcHBlciA9ICQoJyMnICsgZWwuaWQgKyAnX3dyYXBwZXInKTtcclxuICAgICAgICAgICAgdmFyICRiYWNrZ3JvdW5kID0gJCgnIycgKyBlbC5pZCArICdfYmFja2dyb3VuZCcpO1xyXG5cclxuICAgICAgICAgICAgLy8gYGJlZm9yZW9wZW5gIGNhbGxiYWNrIGV2ZW50XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVsLCBvcmRpbmFsLCBvcHRpb25zLmJlZm9yZW9wZW4pO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVtZW1iZXIgbGFzdCBjbGlja2VkIHBsYWNlXHJcbiAgICAgICAgICAgIGxhc3RjbGlja2VkW2VsLmlkXSA9IG9yZGluYWw7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgcG9wdXAgaWQgdG8gdmlzaWJsZVBvcHVwc0FycmF5XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2aXNpYmxlUG9wdXBzQXJyYXkucHVzaChlbC5pZCk7XHJcbiAgICAgICAgICAgIH0sIDApO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2FsY3VsYXRpbmcgbWF4aW11bSB6LWluZGV4XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmF1dG96aW5kZXgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnKicpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxlbiA9IGVsZW1lbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHZhciBtYXh6aW5kZXggPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGxlbjsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnR6aW5kZXggPSAkKGVsZW1lbnRzW2ldKS5jc3MoJ3otaW5kZXgnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZWxlbWVudHppbmRleCAhPT0gJ2F1dG8nKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50emluZGV4ID0gcGFyc2VJbnQoZWxlbWVudHppbmRleCwgMTApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIGlmKG1heHppbmRleCA8IGVsZW1lbnR6aW5kZXgpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXh6aW5kZXggPSBlbGVtZW50emluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB6aW5kZXh2YWx1ZXNbZWwuaWRdID0gbWF4emluZGV4O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFkZCB6LWluZGV4IHRvIHRoZSBiYWNrZ3JvdW5kXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5iYWNrZ3JvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHppbmRleHZhbHVlc1tlbC5pZF0gPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyMnICsgZWwuaWQgKyAnX2JhY2tncm91bmQnKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAoemluZGV4dmFsdWVzW2VsLmlkXSArIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgei1pbmRleCB0byB0aGUgd3JhcHBlclxyXG4gICAgICAgICAgICAgICAgaWYgKHppbmRleHZhbHVlc1tlbC5pZF0gPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAoemluZGV4dmFsdWVzW2VsLmlkXSArIDIpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRldGFjaCkge1xyXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIucHJlcGVuZChlbCk7XHJcbiAgICAgICAgICAgICAgICAkZWwuc2hvdygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIuc2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBvcGVudGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiAndmlzaWJsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCdwb3B1cF92aXNpYmxlJykuYWRkQ2xhc3MoJ3BvcHVwX3Zpc2libGVfJyArIGVsLmlkKTtcclxuICAgICAgICAgICAgICAgICR3cmFwcGVyLmFkZENsYXNzKCdwb3B1cF93cmFwcGVyX3Zpc2libGUnKTtcclxuICAgICAgICAgICAgfSwgMjApOyAvLyAyMG1zIHJlcXVpcmVkIGZvciBvcGVuaW5nIGFuaW1hdGlvbiB0byBvY2N1ciBpbiBGRlxyXG5cclxuICAgICAgICAgICAgLy8gRGlzYWJsZSBiYWNrZ3JvdW5kIGxheWVyIHNjcm9sbGluZyB3aGVuIHBvcHVwIGlzIG9wZW5lZFxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zY3JvbGxsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAkYm9keS5jc3MoJ292ZXJmbG93JywgJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCRib2R5LmhlaWdodCgpID4gJHdpbmRvdy5oZWlnaHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRib2R5LmNzcygnbWFyZ2luLXJpZ2h0JywgYm9keW1hcmdpbnJpZ2h0ICsgc2Nyb2xsYmFyd2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihvcHRpb25zLmJhY2tncm91bmRhY3RpdmUpe1xyXG4gICAgICAgICAgICAgICAgLy9jYWxjdWxhdGVzIHRoZSB2ZXJ0aWNhbCBhbGlnblxyXG4gICAgICAgICAgICAgICAgJGVsLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOihcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHdpbmRvdy5oZWlnaHQoKSAtIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlbC5nZXQoMCkub2Zmc2V0SGVpZ2h0ICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KCRlbC5jc3MoJ21hcmdpbi10b3AnKSwgMTApICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KCRlbC5jc3MoJ21hcmdpbi1ib3R0b20nKSwgMTApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICApLzIgKydweCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkZWwuY3NzKHtcclxuICAgICAgICAgICAgICAgICd2aXNpYmlsaXR5JzogJ3Zpc2libGUnLFxyXG4gICAgICAgICAgICAgICAgJ29wYWNpdHknOiAxXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gU2hvdyBiYWNrZ3JvdW5kXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmJhY2tncm91bmQpIHtcclxuICAgICAgICAgICAgICAgICRiYWNrZ3JvdW5kLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3Zpc2liaWxpdHknOiAndmlzaWJsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ29wYWNpdHknOiBvcHRpb25zLm9wYWNpdHlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEZpeCBJRTggaXNzdWUgd2l0aCBiYWNrZ3JvdW5kIG5vdCBhcHBlYXJpbmdcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGJhY2tncm91bmQuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ29wYWNpdHknOiBvcHRpb25zLm9wYWNpdHlcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkZWwuZGF0YSgncG9wdXAtdmlzaWJsZScsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy8gUG9zaXRpb24gcG9wdXBcclxuICAgICAgICAgICAgbWV0aG9kcy5yZXBvc2l0aW9uKGVsLCBvcmRpbmFsKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbWVtYmVyIHdoaWNoIGVsZW1lbnQgaGFkIGZvY3VzIGJlZm9yZSBvcGVuaW5nIGEgcG9wdXBcclxuICAgICAgICAgICAgJGVsLmRhdGEoJ2ZvY3VzZWRlbGVtZW50YmVmb3JlcG9wdXAnLCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgIC8vIEhhbmRsZXI6IEtlZXAgZm9jdXMgaW5zaWRlIGRpYWxvZyBib3hcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMua2VlcGZvY3VzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBNYWtlIGhvbGRlciBkaXYgZm9jdXNhYmxlXHJcbiAgICAgICAgICAgICAgICAkZWwuYXR0cigndGFiaW5kZXgnLCAtMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRm9jdXMgcG9wdXAgb3IgdXNlciBzcGVjaWZpZWQgZWxlbWVudC5cclxuICAgICAgICAgICAgICAgIC8vIEluaXRpYWwgdGltZW91dCBvZiA1MG1zIGlzIHNldCB0byBnaXZlIHNvbWUgdGltZSB0byBwb3B1cCB0byBzaG93IGFmdGVyIGNsaWNraW5nIG9uXHJcbiAgICAgICAgICAgICAgICAvLyBgb3BlbmAgZWxlbWVudCwgYW5kIGFmdGVyIGFuaW1hdGlvbiBpcyBjb21wbGV0ZSB0byBwcmV2ZW50IGJhY2tncm91bmQgc2Nyb2xsaW5nLlxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5mb2N1c2VsZW1lbnQgPT09ICdjbG9zZWJ1dHRvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnIycgKyBlbC5pZCArICcgLicgKyBlbC5pZCArIGNsb3Nlc3VmZml4ICsgJzpmaXJzdCcpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmZvY3VzZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKG9wdGlvbnMuZm9jdXNlbGVtZW50KS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbC5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMuZm9jdXNkZWxheSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBIaWRlIG1haW4gY29udGVudCBmcm9tIHNjcmVlbiByZWFkZXJzXHJcbiAgICAgICAgICAgICQob3B0aW9ucy5wYWdlY29udGFpbmVyKS5hdHRyKCdhcmlhLWhpZGRlbicsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy8gUmV2ZWFsIHBvcHVwIGNvbnRlbnQgdG8gc2NyZWVuIHJlYWRlcnNcclxuICAgICAgICAgICAgJGVsLmF0dHIoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgY2FsbGJhY2soZWwsIG9yZGluYWwsIG9wdGlvbnMub25vcGVuKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0cmFuc2l0aW9uc3VwcG9ydCkge1xyXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIub25lKCd0cmFuc2l0aW9uZW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZWwsIG9yZGluYWwsIG9wdGlvbnMub3BlbnRyYW5zaXRpb25lbmQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlbCwgb3JkaW5hbCwgb3B0aW9ucy5vcGVudHJhbnNpdGlvbmVuZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIaWRlIG1ldGhvZFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9iamVjdCBlbCAtIHBvcHVwIGluc3RhbmNlIERPTSBub2RlXHJcbiAgICAgICAgICogQHBhcmFtIGJvb2xlYW4gb3V0ZXJDbGljayAtIGNsaWNrIG9uIHRoZSBvdXRlciBjb250ZW50IGJlbG93IHBvcHVwXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaGlkZTogZnVuY3Rpb24gKGVsLCBvdXRlckNsaWNrKSB7XHJcbiAgICAgICAgICAgIC8vIEdldCBpbmRleCBvZiBwb3B1cCBJRCBpbnNpZGUgb2YgdmlzaWJsZVBvcHVwc0FycmF5XHJcbiAgICAgICAgICAgIHZhciBwb3B1cElkSW5kZXggPSAkLmluQXJyYXkoZWwuaWQsIHZpc2libGVQb3B1cHNBcnJheSk7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBwb3B1cCBpcyBub3Qgb3BlbmVkLCBpZ25vcmUgdGhlIHJlc3Qgb2YgdGhlIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGlmIChwb3B1cElkSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKG9wZW50aW1lcikgY2xlYXJUaW1lb3V0KG9wZW50aW1lcik7XHJcblxyXG4gICAgICAgICAgICB2YXIgJGJvZHkgPSAkKCdib2R5Jyk7XHJcbiAgICAgICAgICAgIHZhciAkZWwgPSAkKGVsKTtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSAkZWwuZGF0YSgncG9wdXBvcHRpb25zJyk7XHJcbiAgICAgICAgICAgIHZhciAkd3JhcHBlciA9ICQoJyMnICsgZWwuaWQgKyAnX3dyYXBwZXInKTtcclxuICAgICAgICAgICAgdmFyICRiYWNrZ3JvdW5kID0gJCgnIycgKyBlbC5pZCArICdfYmFja2dyb3VuZCcpO1xyXG5cclxuICAgICAgICAgICAgJGVsLmRhdGEoJ3BvcHVwLXZpc2libGUnLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodmlzaWJsZVBvcHVwc0FycmF5Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgJCgnaHRtbCcpLnJlbW92ZUNsYXNzKCdwb3B1cF92aXNpYmxlJykucmVtb3ZlQ2xhc3MoJ3BvcHVwX3Zpc2libGVfJyArIGVsLmlkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmKCQoJ2h0bWwnKS5oYXNDbGFzcygncG9wdXBfdmlzaWJsZV8nICsgZWwuaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnaHRtbCcpLnJlbW92ZUNsYXNzKCdwb3B1cF92aXNpYmxlXycgKyBlbC5pZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBwb3B1cCBmcm9tIHRoZSB2aXNpYmxlUG9wdXBzQXJyYXlcclxuICAgICAgICAgICAgdmlzaWJsZVBvcHVwc0FycmF5LnNwbGljZShwb3B1cElkSW5kZXgsIDEpO1xyXG5cclxuICAgICAgICAgICAgaWYoJHdyYXBwZXIuaGFzQ2xhc3MoJ3BvcHVwX3dyYXBwZXJfdmlzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAkd3JhcHBlci5yZW1vdmVDbGFzcygncG9wdXBfd3JhcHBlcl92aXNpYmxlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEZvY3VzIGJhY2sgb24gc2F2ZWQgZWxlbWVudFxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5rZWVwZm9jdXMgJiYgIW91dGVyQ2xpY2spIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJGVsLmRhdGEoJ2ZvY3VzZWRlbGVtZW50YmVmb3JlcG9wdXAnKSkuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsLmRhdGEoJ2ZvY3VzZWRlbGVtZW50YmVmb3JlcG9wdXAnKS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBIaWRlIHBvcHVwXHJcbiAgICAgICAgICAgICR3cmFwcGVyLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAndmlzaWJpbGl0eSc6ICdoaWRkZW4nLFxyXG4gICAgICAgICAgICAgICAgJ29wYWNpdHknOiAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkZWwuY3NzKHtcclxuICAgICAgICAgICAgICAgICd2aXNpYmlsaXR5JzogJ2hpZGRlbicsXHJcbiAgICAgICAgICAgICAgICAnb3BhY2l0eSc6IDBcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBIaWRlIGJhY2tncm91bmRcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYmFja2dyb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgJGJhY2tncm91bmQuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAndmlzaWJpbGl0eSc6ICdoaWRkZW4nLFxyXG4gICAgICAgICAgICAgICAgICAgICdvcGFjaXR5JzogMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJldmVhbCBtYWluIGNvbnRlbnQgdG8gc2NyZWVuIHJlYWRlcnNcclxuICAgICAgICAgICAgJChvcHRpb25zLnBhZ2Vjb250YWluZXIpLmF0dHIoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgLy8gSGlkZSBwb3B1cCBjb250ZW50IGZyb20gc2NyZWVuIHJlYWRlcnNcclxuICAgICAgICAgICAgJGVsLmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBgb25jbG9zZWAgY2FsbGJhY2sgZXZlbnRcclxuICAgICAgICAgICAgY2FsbGJhY2soZWwsIGxhc3RjbGlja2VkW2VsLmlkXSwgb3B0aW9ucy5vbmNsb3NlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0cmFuc2l0aW9uc3VwcG9ydCAmJiAkZWwuY3NzKCd0cmFuc2l0aW9uLWR1cmF0aW9uJykgIT09ICcwcycpIHtcclxuICAgICAgICAgICAgICAgICRlbC5vbmUoJ3RyYW5zaXRpb25lbmQnLCBmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKCRlbC5kYXRhKCdwb3B1cC12aXNpYmxlJykpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmRldGFjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVsLmhpZGUoKS5kZXRhY2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR3cmFwcGVyLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUmUtZW5hYmxlIHNjcm9sbGluZyBvZiBiYWNrZ3JvdW5kIGxheWVyXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2Nyb2xsbG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGJvZHkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdtYXJnaW4tcmlnaHQnOiBib2R5bWFyZ2lucmlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMCk7IC8vIDEwbXMgYWRkZWQgZm9yIENTUyB0cmFuc2l0aW9uIGluIEZpcmVmb3ggd2hpY2ggZG9lc24ndCBsaWtlIG92ZXJmbG93OmF1dG9cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVsLCBsYXN0Y2xpY2tlZFtlbC5pZF0sIG9wdGlvbnMuY2xvc2V0cmFuc2l0aW9uZW5kKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGV0YWNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsLmhpZGUoKS5kZXRhY2goKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdyYXBwZXIuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlLWVuYWJsZSBzY3JvbGxpbmcgb2YgYmFja2dyb3VuZCBsYXllclxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2Nyb2xsbG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRib2R5LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ21hcmdpbi1yaWdodCc6IGJvZHltYXJnaW5yaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAxMCk7IC8vIDEwbXMgYWRkZWQgZm9yIENTUyB0cmFuc2l0aW9uIGluIEZpcmVmb3ggd2hpY2ggZG9lc24ndCBsaWtlIG92ZXJmbG93OmF1dG9cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlbCwgbGFzdGNsaWNrZWRbZWwuaWRdLCBvcHRpb25zLmNsb3NldHJhbnNpdGlvbmVuZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVG9nZ2xlIG1ldGhvZFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGVsIC0gcG9wdXAgaW5zdGFuY2UgRE9NIG5vZGVcclxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gb3JkaW5hbCAtIG9yZGVyIG51bWJlciBvZiBhbiBgb3BlbmAgZWxlbWVudFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRvZ2dsZTogZnVuY3Rpb24gKGVsLCBvcmRpbmFsKSB7XHJcbiAgICAgICAgICAgIGlmICgkKGVsKS5kYXRhKCdwb3B1cC12aXNpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZHMuaGlkZShlbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZHMuc2hvdyhlbCwgb3JkaW5hbCk7XHJcbiAgICAgICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlcG9zaXRpb24gbWV0aG9kXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZWwgLSBwb3B1cCBpbnN0YW5jZSBET00gbm9kZVxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvcmRpbmFsIC0gb3JkZXIgbnVtYmVyIG9mIGFuIGBvcGVuYCBlbGVtZW50XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVwb3NpdGlvbjogZnVuY3Rpb24gKGVsLCBvcmRpbmFsKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWwgPSAkKGVsKTtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSAkZWwuZGF0YSgncG9wdXBvcHRpb25zJyk7XHJcbiAgICAgICAgICAgIHZhciAkd3JhcHBlciA9ICQoJyMnICsgZWwuaWQgKyAnX3dyYXBwZXInKTtcclxuICAgICAgICAgICAgdmFyICRiYWNrZ3JvdW5kID0gJCgnIycgKyBlbC5pZCArICdfYmFja2dyb3VuZCcpO1xyXG5cclxuICAgICAgICAgICAgb3JkaW5hbCA9IG9yZGluYWwgfHwgMDtcclxuXHJcbiAgICAgICAgICAgIC8vIFRvb2x0aXAgdHlwZVxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy50eXBlID09ICd0b29sdGlwJykge1xyXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAncG9zaXRpb24nOiAnYWJzb2x1dGUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgJHRvb2x0aXBhbmNob3I7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy50b29sdGlwYW5jaG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRvb2x0aXBhbmNob3IgPSAkKG9wdGlvbnMudG9vbHRpcGFuY2hvcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMub3BlbmVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkdG9vbHRpcGFuY2hvciA9ICQob3B0aW9ucy5vcGVuZWxlbWVudCkuZmlsdGVyKCdbZGF0YS1wb3B1cC1vcmRpbmFsPVwiJyArIG9yZGluYWwgKyAnXCJdJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICR0b29sdGlwYW5jaG9yID0gJCgnLicgKyBlbC5pZCArIG9wZW5zdWZmaXggKyAnW2RhdGEtcG9wdXAtb3JkaW5hbD1cIicgKyBvcmRpbmFsICsgJ1wiXScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBsaW5rT2Zmc2V0ID0gJHRvb2x0aXBhbmNob3Iub2Zmc2V0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSG9yaXpvbnRhbCBwb3NpdGlvbiBmb3IgdG9vbHRpcFxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuaG9yaXpvbnRhbCA9PSAncmlnaHQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKCdsZWZ0JywgbGlua09mZnNldC5sZWZ0ICsgJHRvb2x0aXBhbmNob3Iub3V0ZXJXaWR0aCgpICsgb3B0aW9ucy5vZmZzZXRsZWZ0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5ob3Jpem9udGFsID09ICdsZWZ0ZWRnZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAkd3JhcHBlci5jc3MoJ2xlZnQnLCBsaW5rT2Zmc2V0LmxlZnQgKyAkdG9vbHRpcGFuY2hvci5vdXRlcldpZHRoKCkgLSAkdG9vbHRpcGFuY2hvci5vdXRlcldpZHRoKCkgKyAgb3B0aW9ucy5vZmZzZXRsZWZ0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5ob3Jpem9udGFsID09ICdsZWZ0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICR3cmFwcGVyLmNzcygncmlnaHQnLCAkd2luZG93LndpZHRoKCkgLSBsaW5rT2Zmc2V0LmxlZnQgIC0gb3B0aW9ucy5vZmZzZXRsZWZ0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5ob3Jpem9udGFsID09ICdyaWdodGVkZ2UnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKCdyaWdodCcsICR3aW5kb3cud2lkdGgoKSAgLSBsaW5rT2Zmc2V0LmxlZnQgLSAkdG9vbHRpcGFuY2hvci5vdXRlcldpZHRoKCkgLSBvcHRpb25zLm9mZnNldGxlZnQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkd3JhcHBlci5jc3MoJ2xlZnQnLCBsaW5rT2Zmc2V0LmxlZnQgKyAoJHRvb2x0aXBhbmNob3Iub3V0ZXJXaWR0aCgpIC8gMikgLSAoJGVsLm91dGVyV2lkdGgoKSAvIDIpIC0gcGFyc2VGbG9hdCgkZWwuY3NzKCdtYXJnaW5MZWZ0JykpICsgb3B0aW9ucy5vZmZzZXRsZWZ0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBWZXJ0aWNhbCBwb3NpdGlvbiBmb3IgdG9vbHRpcFxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMudmVydGljYWwgPT0gJ2JvdHRvbScpIHtcclxuICAgICAgICAgICAgICAgICAgICAkd3JhcHBlci5jc3MoJ3RvcCcsIGxpbmtPZmZzZXQudG9wICsgJHRvb2x0aXBhbmNob3Iub3V0ZXJIZWlnaHQoKSArIG9wdGlvbnMub2Zmc2V0dG9wKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy52ZXJ0aWNhbCA9PSAnYm90dG9tZWRnZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAkd3JhcHBlci5jc3MoJ3RvcCcsIGxpbmtPZmZzZXQudG9wICsgJHRvb2x0aXBhbmNob3Iub3V0ZXJIZWlnaHQoKSAtICRlbC5vdXRlckhlaWdodCgpICsgb3B0aW9ucy5vZmZzZXR0b3ApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLnZlcnRpY2FsID09ICd0b3AnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKCdib3R0b20nLCAkd2luZG93LmhlaWdodCgpIC0gbGlua09mZnNldC50b3AgLSBvcHRpb25zLm9mZnNldHRvcCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMudmVydGljYWwgPT0gJ3RvcGVkZ2UnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKCdib3R0b20nLCAkd2luZG93LmhlaWdodCgpIC0gbGlua09mZnNldC50b3AgLSAkZWwub3V0ZXJIZWlnaHQoKSAtIG9wdGlvbnMub2Zmc2V0dG9wKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKCd0b3AnLCBsaW5rT2Zmc2V0LnRvcCArICgkdG9vbHRpcGFuY2hvci5vdXRlckhlaWdodCgpIC8gMikgLSAoJGVsLm91dGVySGVpZ2h0KCkgLyAyKSAtIHBhcnNlRmxvYXQoJGVsLmNzcygnbWFyZ2luVG9wJykpICsgb3B0aW9ucy5vZmZzZXR0b3ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gT3ZlcmxheSB0eXBlXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy50eXBlID09ICdvdmVybGF5Jykge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEhvcml6b250YWwgcG9zaXRpb24gZm9yIG92ZXJsYXlcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmhvcml6b250YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAkd3JhcHBlci5jc3MoJ3RleHQtYWxpZ24nLCBvcHRpb25zLmhvcml6b250YWwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkd3JhcHBlci5jc3MoJ3RleHQtYWxpZ24nLCAnY2VudGVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVmVydGljYWwgcG9zaXRpb24gZm9yIG92ZXJsYXlcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnZlcnRpY2FsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsLmNzcygndmVydGljYWwtYWxpZ24nLCBvcHRpb25zLnZlcnRpY2FsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsLmNzcygndmVydGljYWwtYWxpZ24nLCAnbWlkZGxlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBZGQtY2xvc2UtYnV0dG9uIG1ldGhvZFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGVsIC0gcG9wdXAgaW5zdGFuY2UgRE9NIG5vZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBhZGRjbG9zZWJ1dHRvbjogZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICAgIHZhciBnZW5lcmljQ2xvc2VCdXR0b247XHJcblxyXG4gICAgICAgICAgICBpZiAoJChlbCkuZGF0YSgncG9wdXBvcHRpb25zJykuY2xvc2VidXR0b25tYXJrdXApIHtcclxuICAgICAgICAgICAgICAgIGdlbmVyaWNDbG9zZUJ1dHRvbiA9ICQob3B0aW9ucy5jbG9zZWJ1dHRvbm1hcmt1cCkuYWRkQ2xhc3MoZWwuaWQgKyAnX2Nsb3NlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBnZW5lcmljQ2xvc2VCdXR0b24gPSAnPGJ1dHRvbiBjbGFzcz1cInBvcHVwX2Nsb3NlICcgKyBlbC5pZCArICdfY2xvc2VcIiB0aXRsZT1cIkNsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCRlbC5kYXRhKCdwb3B1cC1pbml0aWFsaXplZCcpKXtcclxuICAgICAgICAgICAgICAgICRlbC5hcHBlbmQoZ2VuZXJpY0Nsb3NlQnV0dG9uKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGxiYWNrIGV2ZW50IGNhbGxzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsIC0gcG9wdXAgaW5zdGFuY2UgRE9NIG5vZGVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvcmRpbmFsIC0gb3JkZXIgbnVtYmVyIG9mIGFuIGBvcGVuYCBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jIC0gY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAqL1xyXG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKGVsLCBvcmRpbmFsLCBmdW5jKSB7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSAkKGVsKS5kYXRhKCdwb3B1cG9wdGlvbnMnKTtcclxuICAgICAgICB2YXIgb3BlbmVsZW1lbnQgPSAgKG9wdGlvbnMub3BlbmVsZW1lbnQpID8gb3B0aW9ucy5vcGVuZWxlbWVudCA6ICgnLicgKyBlbC5pZCArIG9wZW5zdWZmaXgpO1xyXG4gICAgICAgIHZhciBlbGVtZW50Y2xpY2tlZCA9ICQob3BlbmVsZW1lbnQgKyAnW2RhdGEtcG9wdXAtb3JkaW5hbD1cIicgKyBvcmRpbmFsICsgJ1wiXScpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGZ1bmMuY2FsbCgkKGVsKSwgZWwsIGVsZW1lbnRjbGlja2VkKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhpZGUgcG9wdXAgaWYgRVNDIGtleSBpcyBwcmVzc2VkXHJcbiAgICAkKGRvY3VtZW50KS5vbigna2V5ZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGlmKHZpc2libGVQb3B1cHNBcnJheS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFyIGVsZW1lbnRJZCA9IHZpc2libGVQb3B1cHNBcnJheVt2aXNpYmxlUG9wdXBzQXJyYXkubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJChlbCkuZGF0YSgncG9wdXBvcHRpb25zJykuZXNjYXBlICYmIGV2ZW50LmtleUNvZGUgPT0gMjcpIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZHMuaGlkZShlbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBIaWRlIHBvcHVwIG9uIGNsaWNrXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBpZih2aXNpYmxlUG9wdXBzQXJyYXkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50SWQgPSB2aXNpYmxlUG9wdXBzQXJyYXlbdmlzaWJsZVBvcHVwc0FycmF5Lmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50SWQpO1xyXG4gICAgICAgICAgICB2YXIgY2xvc2VCdXR0b24gPSAoJChlbCkuZGF0YSgncG9wdXBvcHRpb25zJykuY2xvc2VlbGVtZW50KSA/ICQoZWwpLmRhdGEoJ3BvcHVwb3B0aW9ucycpLmNsb3NlZWxlbWVudCA6ICgnLicgKyBlbC5pZCArIGNsb3Nlc3VmZml4KTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIENsb3NlIGJ1dHRvbiBjbGlja2VkXHJcbiAgICAgICAgICAgIGlmICgkKGV2ZW50LnRhcmdldCkuY2xvc2VzdChjbG9zZUJ1dHRvbikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kcy5oaWRlKGVsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSWYgY2xpY2tlZCBvdXRzaWRlIG9mIHBvcHVwXHJcbiAgICAgICAgICAgIGlmICgkKGVsKS5kYXRhKCdwb3B1cG9wdGlvbnMnKS5ibHVyICYmICEkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnIycgKyBlbGVtZW50SWQpLmxlbmd0aCAmJiBldmVudC53aGljaCAhPT0gMiAmJiAkKGV2ZW50LnRhcmdldCkuaXMoJzp2aXNpYmxlJykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJChlbCkuZGF0YSgncG9wdXBvcHRpb25zJykuYmFja2dyb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGNsaWNrZWQgb24gcG9wdXAgY292ZXJcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2RzLmhpZGUoZWwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBPbGRlciBpT1MvU2FmYXJpIHdpbGwgdHJpZ2dlciBhIGNsaWNrIG9uIHRoZSBlbGVtZW50cyBiZWxvdyB0aGUgY292ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiB0YXBwaW5nIG9uIHRoZSBjb3Zlciwgc28gdGhlIGRlZmF1bHQgYWN0aW9uIG5lZWRzIHRvIGJlIHByZXZlbnRlZC5cclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgY2xpY2tlZCBvbiBvdXRlciBjb250ZW50XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy5oaWRlKGVsLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEtlZXAga2V5Ym9hcmQgZm9jdXMgaW5zaWRlIG9mIHBvcHVwXHJcbiAgICAkKGRvY3VtZW50KS5vbigna2V5ZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgaWYodmlzaWJsZVBvcHVwc0FycmF5Lmxlbmd0aCAmJiBldmVudC53aGljaCA9PSA5KSB7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0YWIgb3Igc2hpZnQtdGFiIHByZXNzZWRcclxuICAgICAgICAgICAgdmFyIGVsZW1lbnRJZCA9IHZpc2libGVQb3B1cHNBcnJheVt2aXNpYmxlUG9wdXBzQXJyYXkubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgbGlzdCBvZiBhbGwgY2hpbGRyZW4gZWxlbWVudHMgaW4gZ2l2ZW4gb2JqZWN0XHJcbiAgICAgICAgICAgIHZhciBwb3B1cEl0ZW1zID0gJChlbCkuZmluZCgnKicpO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IGxpc3Qgb2YgZm9jdXNhYmxlIGl0ZW1zXHJcbiAgICAgICAgICAgIHZhciBmb2N1c2FibGVJdGVtcyA9IHBvcHVwSXRlbXMuZmlsdGVyKGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nKS5maWx0ZXIoJzp2aXNpYmxlJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgY3VycmVudGx5IGZvY3VzZWQgaXRlbVxyXG4gICAgICAgICAgICB2YXIgZm9jdXNlZEl0ZW0gPSAkKCc6Zm9jdXMnKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbnVtYmVyIG9mIGZvY3VzYWJsZSBpdGVtc1xyXG4gICAgICAgICAgICB2YXIgbnVtYmVyT2ZGb2N1c2FibGVJdGVtcyA9IGZvY3VzYWJsZUl0ZW1zLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgaW5kZXggb2YgdGhlIGN1cnJlbnRseSBmb2N1c2VkIGl0ZW1cclxuICAgICAgICAgICAgdmFyIGZvY3VzZWRJdGVtSW5kZXggPSBmb2N1c2FibGVJdGVtcy5pbmRleChmb2N1c2VkSXRlbSk7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBwb3B1cCBkb2Vzbid0IGNvbnRhaW4gZm9jdXNhYmxlIGVsZW1lbnRzLCBmb2N1cyBwb3B1cCBpdHNlbGZcclxuICAgICAgICAgICAgaWYgKG51bWJlck9mRm9jdXNhYmxlSXRlbXMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICQoZWwpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQmFjayB0YWJcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBmb2N1c2VkIG9uIGZpcnN0IGl0ZW0gYW5kIHVzZXIgcHJlc2VzIGJhY2stdGFiLCBnbyB0byB0aGUgbGFzdCBmb2N1c2FibGUgaXRlbVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb2N1c2VkSXRlbUluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzYWJsZUl0ZW1zLmdldChudW1iZXJPZkZvY3VzYWJsZUl0ZW1zIC0gMSkuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBGb3J3YXJkIHRhYlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGZvY3VzZWQgb24gdGhlIGxhc3QgaXRlbSBhbmQgdXNlciBwcmVzZXMgdGFiLCBnbyB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZm9jdXNlZEl0ZW1JbmRleCA9PSBudW1iZXJPZkZvY3VzYWJsZUl0ZW1zIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb2N1c2FibGVJdGVtcy5nZXQoMCkuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFBsdWdpbiBBUElcclxuICAgICAqL1xyXG4gICAgJC5mbi5wb3B1cCA9IGZ1bmN0aW9uIChjdXN0b21vcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgJGVsID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY3VzdG9tb3B0aW9ucyA9PT0gJ29iamVjdCcpIHsgIC8vIGUuZy4gJCgnI3BvcHVwJykucG9wdXAoeydjb2xvcic6J2JsdWUnfSlcclxuICAgICAgICAgICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwgJC5mbi5wb3B1cC5kZWZhdWx0cywgY3VzdG9tb3B0aW9ucywgJGVsLmRhdGEoJ3BvcHVwb3B0aW9ucycpKTtcclxuICAgICAgICAgICAgICAgICRlbC5kYXRhKCdwb3B1cG9wdGlvbnMnLCBvcHQpO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9ICRlbC5kYXRhKCdwb3B1cG9wdGlvbnMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBtZXRob2RzLl9pbml0KHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY3VzdG9tb3B0aW9ucyA9PT0gJ3N0cmluZycpIHsgLy8gZS5nLiAkKCcjcG9wdXAnKS5wb3B1cCgnaGlkZScpXHJcbiAgICAgICAgICAgICAgICBpZiAoISgkZWwuZGF0YSgncG9wdXBvcHRpb25zJykpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsLmRhdGEoJ3BvcHVwb3B0aW9ucycsICQuZm4ucG9wdXAuZGVmYXVsdHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPSAkZWwuZGF0YSgncG9wdXBvcHRpb25zJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbWV0aG9kc1tjdXN0b21vcHRpb25zXS5jYWxsKHRoaXMsIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gZS5nLiAkKCcjcG9wdXAnKS5wb3B1cCgpXHJcbiAgICAgICAgICAgICAgICBpZiAoISgkZWwuZGF0YSgncG9wdXBvcHRpb25zJykpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsLmRhdGEoJ3BvcHVwb3B0aW9ucycsICQuZm4ucG9wdXAuZGVmYXVsdHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPSAkZWwuZGF0YSgncG9wdXBvcHRpb25zJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbWV0aG9kcy5faW5pdCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICQuZm4ucG9wdXAuZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgdHlwZTogJ292ZXJsYXknLFxyXG4gICAgICAgIGF1dG9vcGVuOiBmYWxzZSxcclxuICAgICAgICBiYWNrZ3JvdW5kOiB0cnVlLFxyXG4gICAgICAgIGJhY2tncm91bmRhY3RpdmU6IGZhbHNlLFxyXG4gICAgICAgIGNvbG9yOiAnYmxhY2snLFxyXG4gICAgICAgIG9wYWNpdHk6ICcwLjUnLFxyXG4gICAgICAgIGhvcml6b250YWw6ICdjZW50ZXInLFxyXG4gICAgICAgIHZlcnRpY2FsOiAnbWlkZGxlJyxcclxuICAgICAgICBvZmZzZXR0b3A6IDAsXHJcbiAgICAgICAgb2Zmc2V0bGVmdDogMCxcclxuICAgICAgICBlc2NhcGU6IHRydWUsXHJcbiAgICAgICAgYmx1cjogdHJ1ZSxcclxuICAgICAgICBzZXR6aW5kZXg6IHRydWUsXHJcbiAgICAgICAgYXV0b3ppbmRleDogZmFsc2UsXHJcbiAgICAgICAgc2Nyb2xsbG9jazogZmFsc2UsXHJcbiAgICAgICAgY2xvc2VidXR0b246IGZhbHNlLFxyXG4gICAgICAgIGNsb3NlYnV0dG9ubWFya3VwOiBudWxsLFxyXG4gICAgICAgIGtlZXBmb2N1czogdHJ1ZSxcclxuICAgICAgICBmb2N1c2VsZW1lbnQ6IG51bGwsXHJcbiAgICAgICAgZm9jdXNkZWxheTogNTAsXHJcbiAgICAgICAgb3V0bGluZTogZmFsc2UsXHJcbiAgICAgICAgcGFnZWNvbnRhaW5lcjogbnVsbCxcclxuICAgICAgICBkZXRhY2g6IGZhbHNlLFxyXG4gICAgICAgIG9wZW5lbGVtZW50OiBudWxsLFxyXG4gICAgICAgIGNsb3NlZWxlbWVudDogbnVsbCxcclxuICAgICAgICB0cmFuc2l0aW9uOiBudWxsLFxyXG4gICAgICAgIHRvb2x0aXBhbmNob3I6IG51bGwsXHJcbiAgICAgICAgYmVmb3Jlb3BlbjogbnVsbCxcclxuICAgICAgICBvbmNsb3NlOiBudWxsLFxyXG4gICAgICAgIG9ub3BlbjogbnVsbCxcclxuICAgICAgICBvcGVudHJhbnNpdGlvbmVuZDogbnVsbCxcclxuICAgICAgICBjbG9zZXRyYW5zaXRpb25lbmQ6IG51bGxcclxuICAgIH07XHJcblxyXG59KShqUXVlcnkpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
