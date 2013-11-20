/*!
 * Fanfiction.net Extension v@VERSION
 * https://github.com/Jeconais/Fanfiction.net-Chrome-Extension
 *
 * Copyright 2011, Tim Joy
 * Licensed under the MIT license.
 *
 * Date: @DATE
 */
function storageHandler(config)
{
    this.isConfig = config;
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
    if (this.isConfig)
    {
        key = 'config_'+key;
    }
    else if (URL.type === 'profile')
    {
        key = "author_"+URL.authorId+key;
    }
    else if (URL.type === 'story')
    {
        key = "story_"+URL.storyId+key;
    }

    return key;
}
storageHandler.prototype.getConfig = function()
{
    return this.isConfig;
}

storage = new storageHandler();