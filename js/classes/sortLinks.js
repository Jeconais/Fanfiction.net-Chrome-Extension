/*!
 * Fanfiction.net Extension v@VERSION
 * https://github.com/Jeconais/Fanfiction.net-Chrome-Extension
 *
 * Copyright 2011, Tim Joy
 * Licensed under the MIT license.
 *
 * Date: @DATE
 */
 
function sortLinks(target, handler)
{
    this.type = target;
    this.handler = handler;
}
    // we're in the context of a loop, trying to find the correct div
sortLinks.prototype.generate = function (i, el)
{
    // only get the first one
    if (i !== 0)
    {
        return;
    }

    this.generateLinks(el)
};
/**
 * Generate the links needed, witgh a default
 */
sortLinks.prototype.generateLinks = function (el)
{

    link = [];
    link[0] = this.generateLink('category', 'Category');
    link[1] = this.generateLink('published', 'Published');
    link[2] = this.generateLink('updated', 'Updated');
    link[3] = this.generateLink('title', 'Title');
    link[4] = this.generateLink('words', 'Words');
    link[5] = this.generateLink('wpc', 'Words per chapter');
    link[6] = this.generateLink('chapter', 'Chapters');
    link[7] = this.generateLink('reviews', 'Reviews');
    link[8] = this.generateLink('rpc', 'Reviews per chapter');
    link[9] = this.generateLink('status', 'Status');

    $(el).html('Sort: ');
    for (i in link)
    {
        $(el).append(link[i]);
        $(el).append(' . ');
    }
};
sortLinks.prototype.generateLink = function (sortType, name)
{
    var link = $('<a></a>')
               .attr('href','#'+sortType)
               .attr('id', this.type+sortType)
               .addClass('gray')
               .addClass(this.type+'slinks')
               .click( function (e) {
                   e.preventDefault();

                   id = $(this).attr('id');

                   handler = id.substr(0, 2);
                   type = id.substr(2);
                   if (handler === 'fs')
                   {
                        favouriteStories.sortList(type);
                   }
                   else
                   {
                       authorStories.sortList(type);
                   }
               })
               .html(name);

    return link;

};
