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
    this.total = 0;

    // where we are on the list
    this.currentLimit = 0;

    // variable
    if (targetDiv === 'fs')
    {
        this.withAuthor = true;
    }
    else
    {
        this.withAuthor = false;
    }
    this.targetDiv = targetDiv;
}

/**
 * Handle a story object and record it as a sortable array, and as a div of a story
 * for fast gabdluing
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
}

storySorter.prototype.setSortVal = function(obj, value, refId)
{
    // if this is the first time for a value in this object, we assign it an emppty
    // array.  This is because several items might have the same index.
    if (typeof obj[value] == 'undefined')
    {
        obj[value] = [];
    }

    // move to a local variable, for readability
    c = obj[value];
    // assign a new array to it
    c[c.length] = refId;
}
storySorter.prototype.sortList = function (sType)
{
    target = $('#'+this.targetDiv+'_inside');

    target.html('');

    this.currentLimit = 20;

    this.sort(sType, 0, 20);
}
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
    for (key in arr)
    {
        if (this.isNumeric(key))
        {
            key = parseInt(key);
            numeric = true;
        }
        
        keys.push(key);
    }

    // as we don't have mixed arrays
    // we can be assured that if we have one, they are all numeric
    // so we sort numerically
    if (numeric)
    {
        keys.sort( function (a, b) {return a - b});
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
}
storySorter.prototype.updateScroll = function()
{
    offset = this.currentLimit;

    limit = 20;

    this.currentLimit = offset + limit;

    type = storage.getItem(this.targetDiv);

    this.sort(type, offset, limit);
}
storySorter.prototype.isNumeric = function(str)
{
    return !isNaN(parseFloat(str)) && isFinite(str);
}
