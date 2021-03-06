// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

define([
    'base/js/events',
], function(events){
    "use strict";

    var Page = function () {
        // get url
        var version = getUrlParam('version');
        if (version == 'cn') {
            $('a#tutorial-language-cn').css('display','none');
            $('a#tutorial-language-en').css('display','block');
        } else {
            $('a#tutorial-language-cn').css('display','block');
            $('a#tutorial-language-en').css('display','none');
        }
        this.bind_events();

    };

     var getUrlParam = function(name) {
         var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
         var r = window.location.search.substr(1).match(reg);
         if (r != null)
            return unescape(r[2]);
         return null;
     }

    Page.prototype.bind_events = function () {
        // resize site on:
        // - window resize
        // - header change
        // - page load
        var _handle_resize = $.proxy(this._resize_site, this);
        var targetStr1 = 'README.en.ipynb';
        var startStr = '/notebooks/paddle-book/book/';
        var targetStr2 = 'README.ipynb';
        var defaultUrl = '/notebooks/paddle-book/book/01.fit_a_line/README.ipynb?version=cn';
        var defaultEnUrl = '/notebooks/paddle-book/book/01.fit_a_line/README.en.ipynb';
        $(window).resize(_handle_resize);
        // On document ready, resize codemirror.
        $(document).ready(_handle_resize);
        events.on('resize-header.Page', _handle_resize);
        $('i#new_chevron_up').click(function () {
            // put away contents
            $('div#contents').css('display','none');
            // change_chevron_down display
            $('i#new_chevron_up').css('display','none');
            $('i#new_chevron_down').css('display','block');
        });
        $('i#new_chevron_down').click(function () {
            // put away contents
            $('div#contents').css('display','block');
            // change_chevron_down display
            $('i#new_chevron_up').css('display','block');
            $('i#new_chevron_down').css('display','none');
        });
        $('.div_hover').hover(function() {
            $(this).css('background','#597cf1');
            $('p', this).css('color', '#ffffff');
           }, function () {
            $(this).css('background','#e4e6e9');
            $('p', this).css('color', '#000000');
        });

        $('.div_hover').click(function() {
            var version = getUrlParam('version');
            var url = '';
            if (version == 'cn') {
              url = $(this).attr("url-cn")
            } else {
              url = $(this).attr("url-en")
            }
            window.location.href = url;
        });

        $('#tutorial-language-cn').click(function() {
            var currentUrl = window.location.pathname;
            var endStrlocation = currentUrl.length - targetStr1.length;
            if (currentUrl.indexOf(startStr) == 0
                && endStrlocation >= 0 && currentUrl.lastIndexOf(targetStr1) == endStrlocation) {
                  window.location.href = currentUrl.replace(targetStr1, targetStr2) + "?version=cn";
            } else {
                  window.location.href  = defaultUrl;
            }
        });

        $('#tutorial-language-en').click(function() {
            var currentUrl = window.location.pathname;
            var endStrlocation = currentUrl.length - targetStr2.length;
            if (currentUrl.indexOf(startStr) == 0
                && endStrlocation >= 0 && currentUrl.lastIndexOf(targetStr2) == endStrlocation) {
                  window.location.href = currentUrl.replace(targetStr2, targetStr1);
            } else {
                  window.location.href = defaultEnUrl;
            }
        });


    };

    Page.prototype.show = function () {
        /**
         * The header and site divs start out hidden to prevent FLOUC.
         * Main scripts should call this method after styling everything.
         */
        this.show_header();
        this.show_site();
    };

    Page.prototype.show_header = function () {
        /**
         * The header and site divs start out hidden to prevent FLOUC.
         * Main scripts should call this method after styling everything.
         * TODO: selector are hardcoded, pass as constructor argument
         */
        $('div#header').css('display','block');
    };

    Page.prototype.show_site = function () {
        /**
         * The header and site divs start out hidden to prevent FLOUC.
         * Main scripts should call this method after styling everything.
         * TODO: selector are hardcoded, pass as constructor argument
         */
        $('div#site').css('display', 'block');
        this._resize_site();
    };



    Page.prototype._resize_site = function(e) {
        /**
         * Update the site's size.
         */

        // In the case an event is passed in, only trigger if the event does
        // *not* have a target DOM node (i.e., it is not bubbling up). See
        // https://bugs.jquery.com/ticket/9841#comment:8
        if (!(e && e.target && e.target.tagName)) {
            $('div#site').height($(window).height() - $('#header').height() - $('#nav-bar').height());
            $('div#ipython-main-app').width($('div.page-right').width() - 100);
        }
    };

    return {'Page': Page};
});
