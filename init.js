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
 
 
// add the extension config link
config.addConfigLink();

// first, remove all the sub menu items
if(config.get('hideSearch'))
{
    site.hideDropIn();
}


// get the URL type
URL = new urlParse;

switch(URL.type)
{
// the only thing of note we can do (easily) is to align all the text left
case 'story':
    if(config.get('alignRight'))
    {
        $('#storytext p').css('text-align','left');
    }
    if(config.get('hideShare'))
    {
        $('#storytext div[class="a2a_kit a2a_default_style"]').remove();
    }
    break;
case 'profile':

    // replace the bio with our own toggle
    // and set it to closed by default
    if(config.get('startWithBioClosed'))
    {
        profile.replaceBio();
    }

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
    if (config.get('rememberTab'))
    {
        profile.selectTab();
    }
    else // set the default tab to prefil things
    {
        $('#l_st').click();
    }
            
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

