/*!
 * Fanfiction.net Extension v@VERSION
 * https://github.com/Jeconais/Fanfiction.net-Chrome-Extension
 *
 * Copyright 2011, Tim Joy
 * Licensed under the MIT license.
 *
 * Date: @DATE
 */

 /**
  * Hold references to all stories, and sort them on command
  * @param string targetDiv
  */
function storySorter(targetDiv)
{
    // story holder
    this.stories = {};
    // indexes
    this.sortUpdated = {};
    this.sortWords = {};
    this.sortPublished = {};
    this.sortStatus = {};
    this.sortTitles = {};
    this.sortReviews = {};
    this.sortChapters = {};
    this.sortCategories = {};
    this.sortRPC = {};
    this.sortWPC = {};
    this.totals = 0;

    // where we are on the list
    this.currentLimit = 0;

    // Are we doing favourite stories or otherwise
    if (targetDiv === 'fs')
    {
        this.withAuthor = true;
    }
    else
    {
        this.withAuthor = false;
    }

    // save the target we're aiming for
    this.targetDiv = targetDiv;
}

/**
 * Handle a story object and record it as a sortable array, and as a div of a story
 * for fast calculating
 * @param Story story
 */
storySorter.prototype.buildStoryIndexes = function(story)
{
    // save one story container with the story id
    this.stories[story.data.id] = story.build(this.withAuthor);

    // store the sort varaibles
    this.setSortVal(this.sortUpdated,      story.data.date_updated,      story.data.id);
    this.setSortVal(this.sortPublished,    story.data.date_posted,       story.data.id);
    this.setSortVal(this.sortWords,        story.data.word_count,        story.data.id);
    this.setSortVal(this.sortCategories,   story.data.category,          story.data.id);
    this.setSortVal(this.sortTitles,       story.data.title.toLowerCase(),   story.data.id);
    this.setSortVal(this.sortReviews,      story.data.reviews,           story.data.id);
    this.setSortVal(this.sortStatus,       story.data.status,            story.data.id);
    this.setSortVal(this.sortChapters,     story.data.chapters,          story.data.id);
    this.setSortVal(this.sortRPC,          story.data.rpc,               story.data.id);
    this.setSortVal(this.sortWPC,          story.data.wpc,               story.data.id);

    this.totals++;
};
/**
 * Set the indexes, with the storyId, the value, and the relevant index
 * @param Object index
 * @param Mixed value
 * @param int storyId
 */
storySorter.prototype.setSortVal = function(index, value, storyId)
{
    // if this is the first time for a value in this object, we assign it an emppty
    // array.  This is because several items might have the same index.
    if (typeof index[value] == 'undefined')
    {
        index[value] = [];
    }

    // move to a local variable, for readability
    c = index[value];
    // assign a new array to it
    c[c.length] = storyId;
};

/**
 * General sorter, to create a standard list for first 20 items
 * called by a tab bging clicked
 * @param string sType
 */
storySorter.prototype.sortList = function (sType)
{
    target = $('#'+this.targetDiv+'_inside');

    target.html('');

    this.currentLimit = 20;

    this.sort(sType, 0, 20);
};
/**
 * Perform a sort and append the result to the existing code
 */
storySorter.prototype.sort = function (sType, start, limit)
{

    // remember what we've clicked
    storage.setItem(this.targetDiv, sType);

    // remove all the css from the links
    $('.'+this.targetDiv+'slinks').css({border: '', 'background-color':'', 'color':'', padding: ''});

    // get the todays css
    css = storyData.todayCss;

    // add a few more styles
    css['border-right'] = "1px solid black";
    css['padding'] = '3px';

    //set it to the new clicked place
    $('#'+this.targetDiv+sType).css(css);

    switch(sType)
    {
    case 'category':
        arr = this.sortCategories;
        reverse = false;
        break;
    case 'published':
        arr = this.sortPublished;
        reverse = true;
        break;
    case 'updated':
        arr = this.sortUpdated;
        reverse = true;
        break;
    case 'title':
        arr = this.sortTitles;
        reverse = false;
        break;
    case 'words':
        arr = this.sortWords;
        reverse = true;
        break;
    case 'chapters':
    case 'chapter':
        arr = this.sortChapters;
        reverse = true;
        break;
    case 'reviews':
        arr = this.sortReviews;
        reverse = true;
        break;
    case 'rpc':
        arr = this.sortRPC;
        reverse = true;
        break;
    case 'wpc':
        arr = this.sortWPC;
        reverse = true;
        break;
    case 'status':
        arr = this.sortStatus;
        reverse = true;
        break;
    }
    sortedArray = this.sortArrayByKey(arr, reverse, start, limit);


    stories = [];
    for (i = 0; i < sortedArray.length; i++)
    {
        key = sortedArray[i];
        k = i + 1 + start;
        // make a copy of it
        d = this.stories[key];

        story = $(d).clone();

        // get out the data and replace the varcnt variable
        html = story.html();
        html = html.replace(/VARCNT/, k);

        story.html(html);

        tempContainer = $('<div></div>').append(story);

        stories[stories.length] = tempContainer.html();

        k++;
    }
    target = $('#'+this.targetDiv+'_inside');

    current = target.html();
    target.html(current+stories.join("\n"));
};
storySorter.prototype.sortArrayByKey = function(arr, reverse, start, limit)
{
    var keys = [];
    // get the keys
    var numeric = false;
    for (var key in arr)
    {
        if (this.isNumeric(key))
        {
            key = parseInt(key, 10);
            numeric = true;
        }

        keys.push(key);
    }

    // as we don't have mixed arrays
    // we can be assured that if we have one, they are all numeric
    // so we sort numerically
    if (numeric)
    {
        keys.sort( function (a, b) {return a - b;});
    }
    else
    {
        // sort normally
        keys.sort();
    }

    // do the reverse
    if (reverse)
    {
        keys.reverse();
    }

    // assign them
    var storyIds = [];
    for (i=0; i < keys.length; i++)
    {
        key = keys[i];
        ids = arr[key];
        for (key in ids)
        {
            id = ids[key];
            storyIds.push(id);
        }

    }

    // only get what we need
    storyIds = storyIds.slice(start, start+limit);

    return storyIds;
};
storySorter.prototype.sortDefault = function()
{
    this.sortList('updated');
};
storySorter.prototype.updateScroll = function()
{
    offset = this.currentLimit;

    limit = 20;

    this.currentLimit = offset + limit;

    type = storage.getItem(this.targetDiv);

    this.sort(type, offset, limit);
};
storySorter.prototype.isNumeric = function(str)
{
    return !isNaN(parseFloat(str)) && isFinite(str);
};
