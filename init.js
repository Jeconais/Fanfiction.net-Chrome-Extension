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
 
 // execution part

// first, remove all the sub menu items
var menuItems = ['menu-home-c',
                 'menu-justin-c',
                 'menu-community-c',
                 'menu-forum-c',
                 'menu-beta-c',
                 'menu-dictionary-c',
                 'menu-search-c',
                 'menu-extra-c'];

for (i=0; i < menuItems.length; i++)
{
    $('#'+menuItems[i]).remove();
}

// get the URL type
URL = new urlParse;

switch(URL.type)
{
// the only thing of note we can do (easily) is to align all the text left
case 'story':
    $('#storytext p').css('text-align','left');
    break;
case 'profile':

    // replace the bio with our own toggle
    // and set it to closed by default
    profile.replaceBio();

    // reach the script tags, and re-eval the javascript stories
    var favouriteStories = new storySorter('fs');
    var authorStories = new storySorter('st');
        

    // generate the lists of stories
    profile.generateStoryLists();

    // replace the sort links
    profile.replaceSortLinks();

    // empty the divs
    $('#st_inside').html('');
    $('#fs_inside').html('');

    // replace the tabs (relies on story sorters)
    profile.replaceTabs();

    // select the preferred tab
    profile.selectTab();

    // initiate the scrolling
    profile.initiateScroll();
    break;
// we're on a list page, so try and set some colours
default:
    $('div.z-padtop2').each( function()
    {
        s = new Story();
        s.fromString(this);
    } );
}

