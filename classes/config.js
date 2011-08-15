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
config = {
    options : 
    {
        'all_pages':
        {
            'hideSearch': 'Hide the drop in secondary navigation'
        },
        'story_pages': 
        {
            'alignRight': 'Force the story pages to align all text left (eliminates mass centreing)',
            'hideShare': 'Hide the share panel at the top of each story page'
        },
        'profile_pages':
        {
            'startWithBioClosed' : 'Always close the author biography to start with',
            'rememberTab' : 'Remember which tab you were on the last time you visited this page'
        }
    },
    storage : null,
    init: function ()
    {
        // already configured
        if (this.storage !== null)
        {
            return;
        }
        this.storage = new storageHandler(true);
    },
    asHtml: function()
    {
        this.init();
        html = $('<div></div>');
        a = $('<a></a>')
            .html('X')
            .attr('href', '')
            .click(function (e) 
                { 
                    e.preventDefault();
                    config.closeConfig()
                });
        header = $('<div></div>').addClass('checkTop').html(a);
        html.append(header);
        $.each(this.options, function (a, b) 
        {
            
            list = config.createList();
            $.each(b, function (name, desc)
            {
                list.append(config.createOption(a, name, desc));
            })
            html.append(config.createHeader(a));
            html.append(list);
        })
        return html;
        
    },
    createOption: function(heading, name, desc)
    {
        id = 'option'+heading+name;
        checkBox = $('<input />').attr('type', 'checkbox')
                                 .attr('name', name)
                                 .attr('id', id)
                                 .click( function () { config.handleChange(this)});
        checked = this.storage.getItem(name);
        checkBox.attr('checked', checked);
        
        label = $('<label></label>').html(desc).attr('for', id);
        
        li = $('<li></li>').append(checkBox).append(label);
        return li;
    },
    createList: function (name)
    {
        return $('<ul></ul>').attr('class', 'checklist');
        
    },
    createHeader: function(name)
    {
        name = name.replace(/_/, ' ');
        first = name.charAt(0).toUpperCase();
        name = first+name.substr(1);
        h = $('<h4></h4>').attr('class', 'checkHeader').html(name);
        
        return h;
    },
    handleChange: function(el, name)
    {
        this.init();
        checked = $(el).is(':checked');
        name = $(el).attr('name');
        
        if (checked === true)
        {
            return this.storage.setItem(name, checked);
        }
        
        this.storage.removeItem(name);
    },
    get: function(name)
    {
        this.init();
        return this.storage.getItem(name);
    },
    createConfigOverlay: function ()
    {
        
        if ($('#configextcontent').html() == null)
        {
            
            left = ($('body').width() / 2) - 200;
            frame = $('<div></div>')
                    .attr('id', 'configextcontent')
                    .attr('style', 'background-color: #fff; z-index: 1000; border: 2px solid black; margin-left: auto; margin-right: auto; width: 400px; height: 400px; position: absolute; top: 100px; left: '+left+'px')
                    .html(config.asHtml());
            $('body').append(frame);
            back = $('<div></div>')
                   .addClass('checkModalBackground')
                   .attr('id', 'modalBack')
                   .click(function (e) 
                   { 
                        e.preventDefault() 
                        config.closeConfig();
                   });
            $('body').append(back);
        }
    },
    closeConfig: function()
    {
        $('#configextcontent').hide();
        $('#modalBack').hide();
    },
    openConfig: function()
    {
        $('#configextcontent').show();
        $('#modalBack').show();
    },
    addConfigLink: function()
    {
        
        conf = $('<a></a>')
               .attr('href', '#configure')
               .attr('id', 'configext')
               .html('Configure extension')
               .click( function (e) 
               {
                    e.preventDefault();

                    // append the overlay, if required
                    config.createConfigOverlay();
                    config.openConfig();
                } );
        $('.zui').filter(":first").append(conf);
    }
};
