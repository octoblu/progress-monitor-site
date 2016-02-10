$(document).ready(function(){
  var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
  };
  var getFileProgress = function(name, progressInfo){
    var progress = progressInfo.progress;
    var title = progressInfo.title;
    var classes = ['progress-bar'];
    var progressText = progress + '%';
    if(!progress){
      classes.push('progress-bar-striped');
      progress = 100
      progressText = 'Initializing...'
    }
    if(progress >= 100){
      classes.push('progress-bar-success');
    }else{
      classes.push('progress-bar-info');
    }

    return '<div>' +
      '<h3>'+name+'<small>'+title+'</small></h3>' +
      '<div class="progress">' +
        '<div class="' + classes.join(' ') + '" role="progressbar" '+
          'aria-valuenow="'+progress+'" aria-valuemin="0" aria-valuemax="100" ' +
          'style="width: '+progress+'%;">' +
          progressText +
        '</div>' +
      '</div>' +
    '</div>';

  };
  var noProgresses = function(){
    return '<div>' +
      '<h3>No active transfers</h3>' +
    '</div>';
  };
  var loading = function(){
    return '<div>' +
      '<h3>Loading...</h3>' +
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
  progressStatuses = $('#progress-statuses');
  progressStatuses.html(loading());

  conn.on('ready', function(){
    console.log('Connected to meshblu');

    var refresh = function(){
      conn.devices({type:'progress:status', 'progress.done': false}, function(result){
        if(!_.size(result.devices)) return progressStatuses.html(noProgresses());
        _.each(result.devices, function(device){
          progressStatuses.append(getFileProgress(device.name, device.progressInfo));
        });
      });
    }
    setInterval(refresh, 2000);
  });

});
