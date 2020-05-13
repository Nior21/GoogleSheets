// Source:
// https://habitica.com/apidoc/#api-Task-UpdateTask
// https://habitica.fandom.com/ru/wiki/Google_Apps_Script

var text = "Test task";
var notes = "![progress](https://progress-bar.dev/XXX/ \"progress\")";  // XXX - the desired percentage (progress bar)

function updateHabiticaTask(text, notes) {

  var habId = "<x-api-user>";
  var habToken = "<x-api-key>";
  
  var taskId = "<taskID>";
  
  var url = "https://habitica.com/api/v3/tasks/" + taskId;
 
  // PUT
  
  var options = {
    method: "PUT",
    contentType: "application/json",
    headers: {
      "x-api-user": habId, 
      "x-api-key": habToken,
    },
    payload: JSON.stringify({
      "text": text,
      "notes": notes
    })
  };
  
  var put_request = UrlFetchApp.getRequest(url, options);
  Logger.log(put_request);
  
  var put_response = UrlFetchApp.fetch(url, options);
  Logger.log(put_response.getContentText());
  
}
