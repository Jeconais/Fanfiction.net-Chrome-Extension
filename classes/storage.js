
function storageHandler()
{

}

storageHandler.prototype.setItem = function(key, value)
{
    key = this.getKey(key);
    localStorage[key] = value;
};

storageHandler.prototype.removeItem = function (key)
{
    key = this.getKey(key);

    localStorage.removeItem(key);
};

storageHandler.prototype.getItem = function(key)
{
    key = this.getKey(key);

    item = localStorage[key];

    if (typeof item == "undefined")
    {
        return null;
    }

    return item;
};
storageHandler.prototype.getKey = function(key)
{
    if (URL.type === 'profile')
    {
        key = "author_"+URL.authorId+key;
    }
    else if (URL.type === 'story')
    {
        key = "story_"+URL.storyId+key;
    }

    return key;
}

storage = new storageHandler();