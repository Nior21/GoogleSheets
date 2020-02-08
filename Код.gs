function onEdit(event) {
// Функция реагирует на события редактирования в ячейках
// Судя по тестам переименовывать функцию нельзя - 'onEdit(event)'
  
  // Начало функции onEdit()
  Logger.log("START onEdit()")
  
  // Имя листа на котором происходит событие (для фильтра)
  var Sheet = event.source.getActiveSheet().getSheetName()
  Logger.log("Sheet=" + Sheet)
  
  // Текущая ячейка (ссылка)
  var Cell = SpreadsheetApp.getActive().getCurrentCell()
  Logger.log("Cell=" + Cell)
  
  // Строка в которой происходит событие редактирования (число)
  var Row = Cell.getRow()
  Logger.log("Row=" + Row)
  
  // Столбец в котором происходит событие редактирования (число)
  var Column = Cell.getColumn()
  Logger.log("Column=" + Column)
  
  // Номер столбца содержащего индекс поиска значений в справочнике
  var Col_RowInLib = 9 // TODO: Заменить на функцию поиска номера колонки по названию
  Logger.log("Col_RowInLib=" + Col_RowInLib)
  
  // Индекс поиска значений в справочнике (значение ячейки)
  var RowInLib = SpreadsheetApp.getActive().getActiveSheet().getRange(Row, Col_RowInLib).getValue()
  Logger.log("RowInLib (" + Row + "," + Col_RowInLib + ")=" + RowInLib)
  
  if (Sheet == 'Основная' && Row > 1 && Column >= 2 && Column <= 3 && RowInLib == -1) {
    Logger.log("If (Sheet=='Основная'&&Row>1&&Column>=5&&Column<=6&&RowInLib==-1)=True, NewData")
    ChangeData() // TODO: Создать новую функцию
  }
  else if (Sheet == 'Основная' && Row > 1 && Column >= 2 && Column <= 3 && RowInLib > 0) {
    Logger.log("If (Sheet=='Основная'&&Row>1&&Column>=5&&Column<=6&&RowInLib>0)=True, ChangeData")
    ChangeData()
  }
  
  // Конец функции onEdit()
  Logger.log("END onEdit()")
}

function NewRowInMain(event) {
// Функция реагирует на события добавления новых строк на вкладке 'Основная'
  
  // Начало функции NewRowInMain()
  Logger.log("START NewRowInMain()")
  
  // Конец функции NewRowInMain()
  Logger.log("END NewRowInMain()")
}

function ChangeData(event) {
// Функция реагирует на события изменения данных в определенных колонках на вкладке 'Основная'
  
  // Начало функции ChangeData()
  Logger.log("START ChangeData()")
  
  // Конец функции ChangeData()
  Logger.log("END ChangeData()")
}
