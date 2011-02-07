function urlParse()
{
    this.url = '';
    this.type = '';
    this.storyId = 0;
    this.authorId = 0;
    this.init();
};
urlParse.prototype.init = function()
{
    if (this.url != '')
    {
        return;
    }

    this.url = document.location.toString();

    // look for a profile page
    matches = this.url.match(/\/u\/([\d]+)\//);
    if (matches !== null && matches.length > 1)
    {
        this.type='profile';
        this.authorId = parseInt(matches[1]);
    }

    matches = this.url.match(/\/s\/([\d]+)\//);
    if (matches !== null && matches.length > 1)
    {
        this.type='story';
        this.storyId = parseInt(matches[1]);
    }
};


