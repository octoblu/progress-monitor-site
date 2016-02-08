$(document).ready(function(){
  var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
  };
  var getFileProgress = function(sharefile){
    var progress = sharefile.progress;
    var link = sharefile.link;
    return '<div>' +
      '<h3>'+link+'</h3>' +
      '<div class="progress">' +
        '<div class="progress-bar" role="progressbar" '+
          'aria-valuenow="'+progress+'" aria-valuemin="0" aria-valuemax="100" ' +
          'style="width: '+progress+'%;">' +
          progress + '%' +
        '</div>' +
      '</div>' +
    '</div>';

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
  var conn = meshblu.createConnection(config);
  conn.on('ready', function(){
    console.log('Connected to meshblu');
    var refresh = function(){
      conn.devices({type:'sharefile:status', 'sharefile.done': false}, function(result){
        progressStatuses = $('#progress-statuses');
        progressStatuses.empty();
        _.each(result.devices, function(device){
          progressStatuses.append(getFileProgress(device.sharefile));
        });
      });
    }
    setInterval(refresh, 2000);
  });

});
