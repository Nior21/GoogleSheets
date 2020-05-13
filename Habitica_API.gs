function starter() {

  var x_api_user = "90003d80-0736-499c-9b5e-e72af8884e56";
  var x_api_key = "201ef4f7-fad0-4117-aaf1-2927a149177e";
  
  var taskId = "9ee4a86e-5ff1-4151-a87d-f32fa8b863d3";
  var text = "test10"
  var notes = "![progress](https://progress-bar.dev/10/ \"progress\")"
  
  habitica_PUT_request(taskId, text, notes, x_api_user, x_api_key)
  
}

function habitica_PUT_request(taskId, text, notes, x_api_user, x_api_key) {

  var url = "https://habitica.com/api/v3/tasks/" + taskId;
  
  var options = {
    method: "PUT",
    contentType: "application/json",
    headers: {
      "x-api-user": x_api_user, 
      "x-api-key": x_api_key,
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
  
  // Source:
  // https://habitica.com/apidoc/#api-Task-UpdateTask
  // https://habitica.fandom.com/ru/wiki/Google_Apps_Script
  
}
