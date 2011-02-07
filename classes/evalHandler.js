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
 * In order to get the story data, we need to eval() the inline javascript
 * @param storySorter h
 * @param string name 
 */
function evalHandler(h, name)
{
    this.handler = h;
    this.name = name;
}
/**
 * Take the result of a jquery .each, and run the containing javascript
 * @param Element el
 */
evalHandler.prototype.sort = function(el)
{
    // get the script
    scr = $(el).html();

    // replace the function call with a reference to this class
    scr = scr.replace(/story_set/g, this.name+".buildStory");

    // execute it
    eval(scr);

}

/**
 * Build a story from the data eval'd.  The variables supplied are taken from the ff.net pages
 * 
 */
evalHandler.prototype.buildStory = function(a, stitle,stitleu,summary,userid,penname,pennameu,
                                            category,storyid,genreid,subgenreid,datesubmit,
                                            dateupdate,ratingtimes,chapters,languageid,
                                            censorid,wordcount,statusid,verse,crossover,chars)
{
	// create an empty story object
    story = {};

	// populate he data
    story.title = stitle;
    story.safe_title = stitleu;
    story.desc = summary;
    story.author_id = userid;
    story.penname = penname;
    story.safe_penname = pennameu;
    story.category = category;
    story.id = parseInt(storyid);
    story.genre = storyData.genres[genreid];
    story.sub_genre = storyData.genres[subgenreid];
    story.date_posted = parseInt(datesubmit);
    story.date_updated = parseInt(dateupdate);
    story.reviews = parseInt(ratingtimes);
    story.chapters = parseInt(chapters);
    story.language = storyData.languages[languageid];
    story.rating = storyData.rating[censorid];
    story.word_count = parseInt(wordcount);
    story.status = storyData.statuses[statusid];
    story.verse = verse;
    story.crossover = crossover;
    story.characters = chars;
    story.rpc = Math.round(story.reviews / story.chapters);
    story.wpc = Math.round(story.word_count / story.chapters);

    // build a proper story object
    s = new Story(story);

    // Add it to the indexes for this story sorter
    this.handler.buildStoryIndexes(s);
}
