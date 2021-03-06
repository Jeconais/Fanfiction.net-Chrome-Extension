/*!
 * Fanfiction.net Extension v@VERSION
 * https://github.com/Jeconais/Fanfiction.net-Chrome-Extension
 *
 * Copyright 2011, Tim Joy
 * Licensed under the MIT license.
 *
 * Date: @DATE
 */
function Story(s)
{
    this.data = s;
}

Story.prototype.build = function(withAuthor)
{
    // set the container with a replacable count variable later
    container = $('<div>VARCNT. </div>').addClass('z-list');
    container = this.buildContainer(container, withAuthor);
    container = this.buildDetails(container);

    return container;
};

Story.prototype.buildContainer = function(container, withAuthor)
{
    // set the basic links
    sLink = $('<a></a>')
            .attr('href','/s/'+this.data.id+'/1/'+this.data.safe_title)
            .html(this.data.title+' ');
    lLink = $('<a></a>')
            .attr('href','/s/'+this.data.id+'/'+this.data.chapters+'/'+this.data.safe_title)
            .html('»');
    aLink = $('<a></a>')
            .attr('href','/u/'+this.data.author_id+'/'+this.data.safe_penname)
            .html(this.data.penname);
    rLink = $('<a></a>')
            .attr('href','/r/'+this.data.id+'/')
            .html(' reviews')
            .addClass('reviews');

    if (withAuthor)
    {
        // append the links to the container
        container.append(sLink).append(lLink).append(' by ').append(aLink).append(rLink);
    }
    else
    {
        container.append(sLink).append(lLink).append(rLink);
    }

    return container;
};

Story.prototype.buildDetails = function(container)
{
    // build the summary div
    summaryDiv = $('<div></div>').addClass('z-indent').addClass('z-padtop');
    summaryDiv.html(this.data.desc);

    // and the details
    detailContainer = $('<div></div>').addClass('gray').addClass('z-padtop2');

    details = [];

    details[details.length] = this.data.category;
    details[details.length] = this.data.rating;
    details[details.length] = this.data.language;
    details[details.length] = "Chapters: "+this.data.chapters;
    details[details.length] = "Words: "+this.formatNumber(this.data.word_count);
    details[details.length] = "Words per chapter: "+this.formatNumber(this.data.wpc);
    details[details.length] = "Reviews: "+this.formatNumber(this.data.reviews);
    details[details.length] = "Reviews per chapter: "+this.formatNumber(this.data.rpc);

    // get the date posted string
    post = this.buildDateString(this.data.date_posted, 'Posted');
    // get the updated string
    updated = this.buildDateString(this.data.date_updated, 'Updated');

    // if (post[1] !== null)
    // {
    //     container.css(post[1]);
    // }

    if (updated[1] !== null)
    {
        container.css(updated[1]);
    }

    details[details.length] = post[0];
    // if we only have one chapter, we don't need the updated string
    if (this.data.chapters > 1)
    {
        details[details.length] = updated[0];
    }

    details[details.length] = this.data.characters;

    if (this.data.status === 'Complete')
    {
        details[details.length] = 'Completed';
    }

    // set the string tot hte deatils
    detailContainer.html(details.join(' - '));

    // append it to the summary
    summaryDiv.append(detailContainer);

    // append it to the container
    container.append(summaryDiv);

    // and return
    return container;
};
Story.prototype.buildDateString = function(time, matchText)
{

    time = parseInt(time, 10);

    // get today's date in yyyy-mm-dd format
    var tDate = new Date();
    tDate.setHours(0);
    tDate.setMinutes(0);
    tDate.setSeconds(0);
    tDate.setMilliseconds(0);

    // get yesterday as a time stamp
    var yesterday = tDate.getTime() - 86400000;
    var yDate = new Date();
    yDate.setTime(yesterday);
    yDate.setHours(0);
    yDate.setMinutes(0);
    yDate.setSeconds(0);
    yDate.setMilliseconds(0);

    // get the date Posted
    var matchDate = new Date(time);

    // was it today's date?
    if (matchDate.toDateString() == tDate.toDateString())
    {
        return [matchText+': Today', storyData.todayCss];
    }

    // see if it was posted yesterday
    if (matchDate.toDateString() === yDate.toDateString())
    {
        return [matchText+': Yesterday', storyData.yesterdayCss];
    }

    return [this.getDateString(matchDate.getFullYear(),
                               matchDate.getMonth()+1,
                               matchDate.getDate(),
                               matchText), null];


};
Story.prototype.formatNumber = function (num)
{
   // nasty hacky format a number
   // make it a string
    num = ""+num+"";

    numLen = num.length;

    if (numLen < 4)
    {
        return num;
    }

    if (numLen < 7)
    {
        startNum = numLen - 3;
        a = num.substr(0, startNum);
        b = num.substr(startNum, 3);

        return a+","+b;
    }

    if (numLen < 10)
    {
        a = num.substr(0, 3);
        b = num.substr(3, 3);
        c = num.substr(6, 3);

        return a+","+b+","+c;
    }
    // number to large for this shitty function
    return num;
};


/**
 * Build a new container from the string contained in a list on a Community type page
 * @param  {Element} el
 * @return {void}
 */
Story.prototype.fromString = function(el)
{
    html = $(el).html();

    // get the timespans
    timeSpans = $(el).find('span[data-xutime]');

    // check we have two valid ones
    if (timeSpans.length === 2)
    {

        // first handle the updated in hours code.
        var updated = timeSpans.get(0);

        var updatedTime = $(updated).attr('data-xutime');

        // get the date string
        r = this.buildDateString(updatedTime * 1000, 'Updated');

        // if we have css, apply it
        if (r[1] !== null)
        {
            // add a border to the right
            r[1]['border-right'] = "1px solid black";
            $(el).parent().parent().css(r[1]);
        }
    }

    // get the number of chapters and reviews
    c = html.match(/Chapters: ([0-9]+)/i);
    r = html.match(/Reviews: ([0-9,]+)/i);

    // if both numbers work, add a reviews per chapter to each one
    if (c !== null && r !== null)
    {
        cCount = c[1];
        rCount = r[1];
        rCount = rCount.replace(',', '');
        chapters = parseInt(cCount, 10);
        reviews  = parseInt(rCount, 10);

        rpc = Math.round(reviews / chapters);

        if (!html.match(/Reviews per/))
        {
            html += " - Reviews per chapter: <b>"+rpc+"</b>";
        }
    }

    // reset the html
    $(el).html(html);
};

Story.prototype.getDateString = function(year, month, day, t)
{
    // month to textural date
    months = ['', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // add a date extension
    switch(day)
    {
    case 1:
    case 21:
    case 31:
        ext = 'st';
        break;
    case 2: case 22:
        ext = 'nd';
        break;
    case 3: case 23:
        ext = 'rd';
        break;
    default:
        ext = 'th';
        break;
    }

    // return the date string
    return t+": "+day+'<sup>'+ext+'</sup> '+months[month] +' '+year;
};


var storyData = {
    // coloured css
    todayCss : {
                    'border-left': '1px solid black',
                    'border-top': '1px solid black',
                    'border-bottom': '1px solid black',
                    color: '#000',
                    'background-color': '#DFF2BF'
                },
    yesterdayCss :{
                    'border-top': '1px solid black',
                    'border-left': '1px solid black',
                    'border-bottom': '1px solid black',
                    color: '#000',
                    'background-color': '#FEEFB3'
                  },


    // the eval'd javascript has hardcoded ids that match hardcoded scripts in their js
    languages : ['0','English','Spanish','French','German','Chinese','Japanese',
                     'Dutch','Portuguese','Scandinavian','Russian','Italian',
                     'Bulgarian','Polish','Hungarian','Hebrew','Arabic','Swedish',
                     'Norwegian','Danish','Finnish','Filipino','Esperanto','Hindi',
                     'Punjabi','Farsi','Greek','Romanian','Albanian','Serbian',
                     'Turkish','Czech','Indonesian','Croatian','Catalan','Latin','Korean'],

    genres : ['None','General','Romance','Humor','Drama','Poetry','Action/Adventure',
                   'Mystery','Horror','Parody','Angst','Supernatural','Suspense','Sci-Fi',
                   'Fantasy','Spiritual','Tragedy','Western','Crime','Family','Hurt/Comfort',
                   'Friendship'],

    statuses : ['0','In-Progress','Complete'],

    rating : ['0','Fiction Rated: K','Fiction Rated: K+','Fiction Rated: T',
                  'Fiction Rated: M','Fiction Rated: MA']
};
