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
 * Take the current URL and check what type of page it is
 * so that we can dispatch the correct handler
 */
function urlParse()
{
    this.url = '';
    this.type = '';
    this.storyId = 0;
    this.authorId = 0;
    this.init();
};

// initialise the variables
urlParse.prototype.init = function()
{
	// check if we've already called this
    if (this.url != '')
    {
        return;
    }

	// get the url
    this.url = document.location.toString();

    // look for a profile page
    matches = this.url.match(/\/u\/([\d]+)\//);
    if (matches !== null && matches.length > 1)
    {
        this.type='profile';
        this.authorId = parseInt(matches[1]);
    }

	// look for a story page
    matches = this.url.match(/\/s\/([\d]+)\//);
    if (matches !== null && matches.length > 1)
    {
        this.type='story';
        this.storyId = parseInt(matches[1]);
    }
};