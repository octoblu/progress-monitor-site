$(document).ready(function(){
  var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
  };
  var uuid = getQueryString('uuid');
  var token = getQueryString('token');
  if(!uuid || !token){
    var redirect_uri = encodeURIComponent('https://progress-monitor.octoblu.com');
    window.location='https://oauth.octoblu.com/authorize?client_id=3269a0c6-1be9-481e-b6eb-1d6c8bcd59b2&redirect_uri=' + redirect_uri + '&response_type=code';
    return;
  }
  var config = {
    uuid: uuid,
    token: token,
    server: 'meshblu.octoblu.com',
    port: 443
  }
  var meshbluHttp = new MeshbluHttp(config);
  meshbluHttp.devices({type:'sharefile:status'}, function(error, devices){
    if(error) return console.error('Error', error);
    progressStatuses = $('#progress-statuses');
    progressStatuses.empty();
    _.each(devices, function(device){
      progressStatuses.append('<h1>'+device.sharefile.link+' '+device.sharefile.progress+'%</h1>');
    });
  });
});
