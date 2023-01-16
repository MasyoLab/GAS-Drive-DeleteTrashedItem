/** スクリプト実行時間（ミリ秒） */
const MAX_RUNNING_TIME = 300000;
/** トリガー実行までの時間（ミリ秒） */
const REASONABLE_TIME_TO_WAIT = 300000;
/** トリガーに登録する関数 */
const EXECUTION_FUNCTION = 'onContinueFunction';

/** 実行開始時間 */
var _startTime = 0;

function onFunction() {
  _startTime = getTime();

  // ゴミ箱内のフォルダを取り出す
  deleteTrashedItem(DriveApp.getTrashedFolders());
  // ゴミ箱内のファイルを取り出す
  deleteTrashedItem(DriveApp.getTrashedFiles());

  if (isExecutionOvertime()) {
    // 実行時間を超えたのでトリガーを登録
    setTrigger();
  }
}

/** トリガーに登録する関数 */
function onContinueFunction() {
  deleteTrigger();
  onFunction();
}

/**
 * ゴミ箱内のアイテムを完全に削除
 * @param {DriveApp.FileIterator | DriveApp.FolderIterator} contents
 */
function deleteTrashedItem(contents) {
  while (contents.hasNext()) {
    if (isExecutionOvertime()) {
      return;
    }

    var item = contents.next();
    if (item == null) {
      continue;
    }

    try {
      var id = item.getId();
      Logger.log(item.getName());
      Drive.Files.remove(id);
    }
    catch (error) {
      Logger.log(error);
    }
  }
}

/** Gets the time value in milliseconds */
function getTime() {
  return (new Date()).getTime();
}

/** 実行時間外か */
function isExecutionOvertime() {
  var currTime = getTime();
  return currTime - _startTime >= MAX_RUNNING_TIME;
}

/** トリガーを登録 */
function setTrigger() {
  var currTime = getTime();
  ScriptApp.newTrigger(EXECUTION_FUNCTION).timeBased().at(new Date(currTime + REASONABLE_TIME_TO_WAIT)).create();

  Logger.log('トリガーセット完了');
}

/** トリガー削除 */
function deleteTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(v => {
    if (v.getHandlerFunction() == EXECUTION_FUNCTION) {
      ScriptApp.deleteTrigger(v);
    }
  });
}
