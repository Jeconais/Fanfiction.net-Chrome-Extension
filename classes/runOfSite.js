/*!
 * Fanfiction.net Extension v@VERSION
 * https://github.com/Jeconais/Fanfiction.net-Chrome-Extension
 *
 * Copyright 2011, Tim Joy
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: @DATE
 */
site = {
    hideDropIn: function ()
    {
        var menuItems = ['menu-home-c',
                         'menu-justin-c',
                         'menu-community-c',
                         'menu-forum-c',
                         'menu-beta-c',
                         'menu-dictionary-c',
                         'menu-search-c',
                         'menu-extra-c'];

        $.each(menuItems, function (a, b) 
        {
            $('#'+b).remove();
        });
    }
}