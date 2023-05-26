function getEnvironment() {
 var environment = {
   spreadsheetID: "spreadsheetID",
   firebaseUrl: “databaseURL”
 };
 return environment;
}


function writeDataToSheet() {
 var sheet = SpreadsheetApp.getActiveSheet();
 var range = sheet.getDataRange();
 range.clearContent();
 var data = range.getValues();


 var firebaseUrl = getEnvironment().firebaseUrl + "contactForm.json";
 var response = UrlFetchApp.fetch(firebaseUrl);
 var json = JSON.parse(response.getContentText());
 var values = [];


 var headerRow = ["Date","Name","Email", "Our Services", "Phone", "Message Content"];
 values.push(headerRow);


 for (var key in json) {
   var row = [];
   row.push(json[key]['date']);
   row.push(json[key]['name']);
   row.push(json[key]['emailid']);
   row.push(json[key]['oursServices']);
   row.push(json[key]['phone']);
   row.push(json[key]['msgContent']);
   var fields = json[key].fields;
   for (var field in fields) {
     row.push(fields[field].stringValue);
   }
   values.push(row);
 }


 if (values.length > 0) {
   range.offset(1, 0, values.length, values[0].length).setValues(values);
 }
}


function createTrigger() {
 var triggers = ScriptApp.getProjectTriggers();
 var triggerExists = false;
 for (var i = 0; i < triggers.length; i++) {
   if (triggers[i].getHandlerFunction() == "writeDataToSheet") {
     triggerExists = true;
     break;
   }
 }


 if (!triggerExists) {
   ScriptApp.newTrigger("writeDataToSheet")
     .timeBased()
     .everyMinutes(5)
     .create();
 }
}
