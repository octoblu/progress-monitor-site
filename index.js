$(document).ready(function(){
  var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
  };
  var code = getQueryString('code');
  if(!code){
    var redirect_uri = encodeURIComponent('http://progress-monitor.octoblu.com');
    window.location='https://oauth.octoblu.com/authorize?client_id=3269a0c6-1be9-481e-b6eb-1d6c8bcd59b2&redirect_uri=' + redirect_uri + '&response_type=code';
    return;
  }
  var parsedCode = _.tail(window.atob(code).split(':'));
  var uuid = parsedCode[0];
  var token = parsedCode[1];
  var config = {
    uuid: uuid,
    token: token,
    server: 'meshblu.octoblu.com',
    port: 443
  }
  var meshbluHttp = new MeshbluHttp(config);
  meshbluHttp.mydevices({type:'sharefile:status'}, function(error, result){
    if(error) return console.error('Error', error);
    progressStatuses = $('#progress-statuses');
    progressStatuses.empty();
    _.each(result.devices, function(device){
      progressStatuses.append('<h1>'+device.sharefile.link+' '+device.sharefile.progress+'%</h1>');
    });
  });
});
