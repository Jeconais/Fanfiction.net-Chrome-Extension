/*!
 * Fanfiction.net Extension v@VERSION
 * https://github.com/Jeconais/Fanfiction.net-Chrome-Extension
 *
 * Copyright 2011, Jeconais
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: @DATE
 */
config = {
    options :
    {
        'story_pages':
        {
            'alignLeft': 'Force the story pages to align all text left (eliminates mass centreing)',
        },
        'profile_pages':
        {
            'startWithBioClosed' : 'Always close the author biography to start with',
            'rememberTab' : 'Remember which tab you were on the last time you visited this page (Can be slow on profiles with large amounts of favourite stories)'
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

        $.each(this.options, function (a, b) {
            var rows = [];
            $.each(b, function (name, desc) {
                rows.push(config.createOption(a, name, desc));
            });

            html.append(config.createHeader(a));

            $.each(rows, function (a, row) {
                html.append(row);
            });

        });
        return html;

    },
    createOption: function(heading, name, desc)
    {
        id = 'option'+heading+name;
        checkBox = $('<input />').attr('type', 'checkbox')
                                 .attr('name', name)
                                 .attr('id', id)
                                 .click( function () { config.handleChange(this);});
        checked = this.storage.getItem(name);
        checkBox.attr('checked', checked);

        label = $('<label></label>').html(desc).attr('for', id);

        s = $('<span></span>').append(label);

        item = $('<div class="row"></div>').append(checkBox).append(s);

        return item;
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
    openConfig: function()
    {

        $(this.asHtml()).dialog({
            autoOpen:true,
            show: "fold",
            hide: "explode",
            resizable: false,
            modal: true,
            closeOnEscape: true,
            height: 450,
            width: 600,
            title: 'Extension options',
            buttons:{
                "Ok":function(){
                    $(this).dialog("close");
                }
            },
            close:function(){
                //$(this).dialog("destroy");
            }

        });

    },
    addConfigLink: function() {

        conf = $('<a></a>')
               .attr('href', '#configure')
               .attr('id', 'configext')
               .html('Configure extension')
               .click( function (e)
               {
                    e.preventDefault();
                    // append the overlay, if required
                    config.openConfig();
                } );
        var holder = $('<div></div>').addClass('xmenu_item').append(conf);
        $('#zmenu td').filter(":first").append(holder);
    }
};
