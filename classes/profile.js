/*!
 * Fanfiction.net Extension v@VERSION
 * https://github.com/Jeconais/Fanfiction.net-Chrome-Extension
 *
 * Copyright 2011, Tim Joy
 * Licensed under the MIT license.
 *
 * Date: @DATE
 */
var profile = {
    replaceBio : function()
    {
        link = $('<a></a>')
               .attr('href','#bio')
               .click( function (e) {e.preventDefault();$('#bio').toggle();return false;})
               .html('Toggle bio');
        $('#bio_text').html(link);
        $('#bio').hide();
    },
    replaceTabs : function()
    {
        $('#primary li a').click( function (e)
        {
            e.preventDefault();

            var tabs = ['l_st', 'l_fa', 'l_fs', 'l_cc'];
            var readable = {l_st : 'stories', l_fs:'favourite_stories',
                            l_fa:'favourite_authors', l_cc : 'communities'};

            for ( i = 0; i < tabs.length; i++)
            {
                // get the tab
                tab = tabs[i];

                // remove the current
                $('#'+tab).removeClass('current');

                // hide all the normal tabs
                t = tab.toString().replace(/l_/,'');
                $('#'+t).hide();

            }

            // add the current to the item clicks
            $(this).addClass('current');

            tab = $(this).attr('id')
            if(tab == 'l_fa')
            {
                var t = $('#fa').html();
                if(t.match(/xmg/gi))
                {
                    t = t.replace(/xmg/gi,'img');
                    $('#fa').html(t);
                }
            }
            else if (tab == 'l_st')
            {
                $('#fs_inside').html('');
                $('#st_inside').html('');
                authorStories.sortDefault();

            }
            else if (tab == 'l_fs')
            {
                $('#fs_inside').html('');
                $('#st_inside').html('');
                favouriteStories.sortDefault();
            }

            storage.setItem('profileTab', readable[tab]);

            current = tab.toString().replace(/l_/,'');
            $('#'+current).show();
        });

        // replace the href with something prettier
        $('#l_st').attr('href','#stories');
        $('#l_fs').attr('href','#favourite_stories');
        $('#l_fa').attr('href','#favourite_authors');
        $('#l_cc').attr('href','#communities');
    },
    replaceSortLinks : function()
    {
        fssort = new sortLinks('fs');
        ausort = new sortLinks('st');
        $('#fs blockquote div').each(function (i, el) {
            fssort.generate(i, el);

        });
        $('#st blockquote div').each( function (i, el) {
            ausort.generate(i, el);
        });
    }
    ,
    generateStoryLists: function()
    {
        
        // find the script tags
        $('script').each(
            function(i, b)
            {
                h = $(this).html();

                // find out of the author stories code
                if (h.indexOf('st_array_index') !== -1)
                {
                    authorEval = new evalHandler(authorStories,'authorEval');
                    authorEval.sort(this);
                }
                // if we have the favourite stories code
                if (h.indexOf('fs_array_index') !== -1)
                {
                    favouriteEval = new evalHandler(favouriteStories,'favouriteEval');
                    favouriteEval.sort(this);
                }
            } );
    },
    selectTab: function()
    {
        profileTab = storage.getItem('profileTab');
        switch(profileTab)
        {
        case 'favourite_stories':
            $('#l_fs').click();
            break;
        case 'favourite_authors':
            $('#l_fa').click();
            break;
        case 'communities':
            $('#l_cc').click();
            break;
        default:
            $('#l_st').click();
            break;

        }
    },
    initiateScroll: function()
    {

        $(window).scroll(function()
        {
            if  ($(window).scrollTop() > $(document).height() - $(window).height() - 50)
            {
         
                profileTab = storage.getItem('profileTab');
                if (profileTab === 'favourite_stories')
                {
                    console.log('favourite_stories');
                    favouriteStories.updateScroll();
                }
                else if (profileTab === 'stories')
                {
                    console.log('stories');
                    authorStories.updateScroll();
                }
                this.scrollLoadInProgress = false;
            }

        });
    }
}