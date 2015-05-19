// Google Calendar OAUTH setup

var CLIENT_ID = '789117793641-vks6tg17t0asgv04o8nrgfcnk1o3v35j.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

/**
       * Check if current user has authorized this application.
       */
function checkAuth() {
    gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': true
      }, handleAuthResult);
}

/**
* Handle response from authorization server.
*
* @param {Object} authResult Authorization result.
*/
function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    var containerDiv = document.getElementById('container');
    if (authResult && !authResult.error) {
        authorizeDiv.style.display = 'none';
        containerDiv.style.display = 'block';
        loadCalendarApi();
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
      authorizeDiv.style.display = 'block';
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize(
      {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
      handleAuthResult);
    return false;
    
}

function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', getCalendars);
}

function getCalendars(when) {
    var request = gapi.client.calendar.calendarList.list({
        'showDeleted' : true
    })
    request.execute(function(resp) {
        calendars = resp.items;
        for (var i=0;i<calendars.length; i++) {
            calendar = calendars[i];
            displayEvents(calendar, when);
        }
    })
}

function displayEvents(calendar, when) {
    if (when == undefined) {
        when = moment();
    }
    var color = calendar.backgroundColor;
    var startOfWeek = when.startOf('isoweek').format();
    var endOfWeek = when.endOf('isoweek').format();
    // update days
    for(var i = 0;i<7;i++) {
      $('.day>h2')[i].innerHTML = when.startOf('isoweek').add(i,'day').format('ddd D MMM');
    }
    var request = gapi.client.calendar.events.list({
          'calendarId': calendar.id,
          'timeMin': startOfWeek,
          'timeMax' : endOfWeek,
          'showDeleted': false,
          'singleEvents': true,
          'orderBy': 'startTime'
        });
        
    request.execute(function(resp) {
        var events = resp.items;
        // move to div of first event
        if (events.length > 0) {
            for (var i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              var allDay = false;
              if (!when) {
                when = event.start.date;
                var allDay = true;
              }
              when = moment(when);
              var dayDiv = $('#' + when.format('dddd').toLowerCase());
              if (allDay) {
                  var timeStr = '';
                  var style = 'background-color : ' + color;
              } else {
                  var timeStr = when.format('h') + (when.format('m')>0?when.format(':m'):'') + when.format('a');
                  var style = 'color : ' + color;
              }
              var liContent = "<li style='" + style + "'><a href='" + event.htmlLink + "' target='_blank'>" + timeStr + " " + event.summary + "</a></li>";
              dayDiv.find('ul').append(liContent)
            }
          }

        
    })
    
}

var weekOffset = 0;
$('#nextWeek').click(function() {
    weekOffset += 1;
    $('li').remove();
    getCalendars(moment().add(weekOffset, 'w'));
})

$('#prevWeek').click(function() {
    weekOffset -= 1;
    $('li').remove();
    getCalendars(moment().add(weekOffset, 'w'));
})