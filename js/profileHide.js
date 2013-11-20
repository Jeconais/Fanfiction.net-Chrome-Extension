// get the URL type
URL = new urlParse();

if(config.get('startWithBioClosed') && URL.type === 'profile') {

    var c = $('<style></style>').attr('type', 'text/css').text('#bio {display: none}');

    $('head').append(c);
}