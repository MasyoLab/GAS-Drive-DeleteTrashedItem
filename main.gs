function onFunction() {
  // ゴミ箱内のフォルダを取り出す
  deleteTrashedItem(DriveApp.getTrashedFolders());
  // ゴミ箱内のファイルを取り出す
  deleteTrashedItem(DriveApp.getTrashedFiles());
}

/**
 * ゴミ箱内のアイテムを完全に削除
 * @param {DriveApp.FileIterator | DriveApp.FolderIterator} contents
 */
function deleteTrashedItem(contents) {
  while (contents.hasNext()) {
    var item = contents.next();
    var id = item.getId();

    if (item == null) {
      continue;
    }

    try {
      Logger.log(item.getName());
      Drive.Files.remove(id);
    }
    catch (error) {
      Logger.log(error);
    }
  }
}
