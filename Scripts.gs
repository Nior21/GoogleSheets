function onEdit(event) {
// Функция реагирует на события редактирования в ячейках
// Судя по тестам переименовывать функцию нельзя - 'onEdit(event)'
  
  // Начало функции onEdit()
  Logger.log("START onEdit()")
  
  /*
  ОПРЕДЕЛЕНИЕ ПЕРЕМЕННЫХ
  */
  
  // Имя листа на котором происходит событие (для фильтра)
  var Sheet = event.source.getActiveSheet().getSheetName()
  // Logger.log("Sheet=" + Sheet)
  
  // Вкладка 'Основная'
  var Main = SpreadsheetApp.getActive().getSheetByName('Основная')
  Logger.log("Main=" + Main)
  
  // Текущая ячейка (ссылка)
  var Cell = SpreadsheetApp.getActive().getCurrentCell()
  // Logger.log("Cell=" + Cell)
  
  // Строка в которой происходит событие редактирования (число)
  var Row = Cell.getRow()
  // Logger.log("Row=" + Row)
  
  // Столбец в котором происходит событие редактирования (число)
  var Column = Cell.getColumn()
  // Logger.log("Column=" + Column)
  
  Logger.log("Cell (" + Cell + " : Row=" + Row + ", Column=" + Column + ") = " + Cell.getValue())
  
  // Номер столбца содержащего индекс поиска значений в справочнике
  var Col_RowInLib = 9 // TODO: Заменить на функцию поиска номера колонки по названию
  // Logger.log("Col_RowInLib=" + Col_RowInLib)
  
  // Индекс поиска значений в справочнике (значение ячейки)
  var RowInLib = SpreadsheetApp.getActive().getActiveSheet().getRange(Row, Col_RowInLib).getValue()
  Logger.log("RowInLib (" + Row + "," + "Col_RowInLib=" + Col_RowInLib + ") = " + RowInLib) 
  
  // Расчет номера последней строки на вкладке 'Основная'
  var LastRowInMain = SpreadsheetApp.getActive().getSheetByName('Основная').getLastRow()
  Logger.log('LastRowInMain=' + LastRowInMain)
  
  // Расчет номера последней строки в именованном диапазоне 'ОсновнаяТаблица'
  var LastRowInNamedMain = SpreadsheetApp.getActiveSpreadsheet().getRange('ОсновнаяТаблица').getLastRow()
  Logger.log('LastRowInNamedMain=' + LastRowInNamedMain)
  
  /*
  ЗАПУСК ФУНКЦИЙ (ПРОВЕРКА УСЛОВИЙ)
  */
  
  // NewData()
  if (Sheet == 'Основная' && Row > 1 && Column >= 2 && Column <= 3 && RowInLib == -1) {
    Logger.log("If for NewData() = True")
    NewData()
  }
  
  // ChangeData()
  else if (Sheet == 'Основная' && Row > 1 && Column >= 2 && Column <= 3 && RowInLib > 0) {
    Logger.log("If for ChangeData() = True")
    ChangeData()
  }
  // NewRowInMain()
  else if (Sheet == 'Основная' && Row > 1 && Column == 1 && LastRowInMain > LastRowInNamedMain) {
    Logger.log("If for NewRowInMain() = True")
    NewRowInMain()
  }
  
  // Если условия не выполнены - вывод ошибки
  else {
    Logger.log("Условия всех функций не выполнены")
  }
  
  // Конец функции onEdit()
  Logger.log("END onEdit()")
}

/*
*/

function NewData() {
// Функция реагирует на события указания новых значений на вкладке 'Основная' для отсутствующих в справочнике ингридентов
  
  // Начало функции NewData()
  Logger.log("START NewData()")
  
  // Вкладка 'Основная'
  var Main = SpreadsheetApp.getActive().getSheetByName('Основная')
  Logger.log("Main=" + Main)
  
  // Вкладка 'Цены'
  var Prices = SpreadsheetApp.getActive().getSheetByName('Цены')
  Logger.log("Prices=" + Prices)

  // Расчет номера последней строки в справочнике
  var NewRowInPrices = Prices.getLastRow() + 1
  Logger.log("Prices.getLastRow()=" + Prices.getLastRow() + '; NewRowInPrices=' + NewRowInPrices)
  
  // Текущая ячейка (ссылка)
  var Cell = SpreadsheetApp.getActive().getCurrentCell()
  // Logger.log("Cell=" + Cell)
  
  // Столбец в котором происходит событие редактирования (число)
  var Column = Cell.getColumn()
  // Logger.log("Column=" + Column)
  
  // Строка в которой происходит событие редактирования (число)
  var Row = Cell.getRow()
  // Logger.log("Row=" + Row)
  
  // Сводная информация по выделенной ячейке
  Logger.log("Cell (" + Cell + " : Row=" + Row + ", Column=" + Column + ") = " + Cell.getValue())
  
  // Ячейка (расположение) в которой находится 'Наименование' ингредиента
  var Name = Main.getRange(Row, 1)
  Logger.log("Name=" + Name)
  
  // Копирую 'Наименование' нового ингредиента в справочник в новую строку
  Name.copyTo(Prices.getRange(NewRowInPrices, 1), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false)
  Logger.log("Data (Name=" + Name.getValue() + ") copy in a new cell (" + Prices.getRange(NewRowInPrices, 1) + ")")
  
  // Копирую значение активной ячейки в соответствующую ячейку справочника
  Cell.copyTo(Prices.getRange(NewRowInPrices, Column), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false)
  Logger.log("Data (Cell=" + Cell.getValue() + ") copy in a new cell {(NewRowInPrices, Column)=(" + NewRowInPrices + "," + Column + ")}")
  
  // Увеличиваем именнованные диапазоны
  SpreadsheetApp.getActive().setNamedRange('Цены', Prices.getRange('A2:C' + NewRowInPrices))
  SpreadsheetApp.getActive().setNamedRange('Ингредиенты', Prices.getRange('A2:A' + NewRowInPrices))
  Logger.log('В именованные диапазоны добавлены новые строки (NamedRange=' + NewRowInPrices + ')')
  
  // Восстанавливаем исходную формулу в ячейке
  Cell.setFormula('=IF(ISERROR(VLOOKUP($A' + Row + ';Цены;' + Column + ';FALSE));"";VLOOKUP($A' + Row + ';Цены;' + Column + ';FALSE))')
  Logger.log('Формула в ячейке (' + Row + ',' + Column + ') восстановлена: ' + '=IF(ISERROR(VLOOKUP($A' + Row + ';Цены;' + Column + ';FALSE));"";VLOOKUP($A' + Row + ';Цены;' + Column + ';FALSE))')
  
  // Конец функции NewData()
  Logger.log("END NewData()")
}

/*
*/

function ChangeData(event) {
// Функция реагирует на события изменения данных в определенных колонках на вкладке 'Основная'
  
  // Начало функции ChangeData()
  Logger.log("START ChangeData()")
  
  //TODO: Найти способ передачи значений из родительской функциию onEdit в дочернюю ChangeData, чтобы устранить задвоение определения переменных
  // Текущая ячейка (ссылка)
  var Cell = SpreadsheetApp.getActive().getCurrentCell()
  // Logger.log("Cell=" + Cell)
  
  // Строка в которой происходит событие редактирования (число)
  var Row = Cell.getRow()
  // Logger.log("Row=" + Row)
  
  // Столбец в котором происходит событие редактирования (число)
  var Column = Cell.getColumn()
  // Logger.log("Column=" + Column)
  
  Logger.log("Cell (" + Cell + " : Row=" + Row + ", Column=" + Column + ") = " + Cell.getValue())
  
  // Номер столбца содержащего индекс поиска значений в справочнике
  var Col_RowInLib = 9 // TODO: Заменить на функцию поиска номера колонки по названию
  // Logger.log("Col_RowInLib=" + Col_RowInLib)
  
  // Индекс поиска значений в справочнике (значение ячейки)
  var RowInLib = SpreadsheetApp.getActive().getActiveSheet().getRange(Row, Col_RowInLib).getValue()
  Logger.log("RowInLib (" + Row + "," + "Col_RowInLib=" + Col_RowInLib + ") = " + RowInLib)
  
  // Вкладка 'Цены'
  var Prices = SpreadsheetApp.getActive().getSheetByName('Цены')
  Logger.log("Prices=" + Prices)
  
  var Value = Cell.getValue()
  
  // Копирую значение активной ячейки в найденную в справочнике каточку ингридиента
  Cell.copyTo(Prices.getRange('Цены').getCell(RowInLib, Column), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
  Logger.log("Data (Cell=" + Value + ") copy in a availible cell {(RowInLib, Column)=(" + RowInLib + "," + (Column) + ")}")
  
  // Восстанавливаем исходную формулу в ячейке
  Cell.setFormula('=IF(ISERROR(VLOOKUP($A' + Row + ';Цены;' + Column + ';FALSE));"";VLOOKUP($A' + Row + ';Цены;' + Column + ';FALSE))')
  Logger.log('Формула в ячейке (' + Row + ',' + Column + ') восстановлена: ' + '=IF(ISERROR(VLOOKUP($A' + Row + ';Цены;' + Column + ';FALSE));"";VLOOKUP($A' + Row + ';Цены;' + Column + ';FALSE))')

  // Конец функции ChangeData()
  Logger.log("END ChangeData()")
}

/*
*/

function NewRowInMain(event) {
// Функция реагирует на события добавления новых строк на вкладке 'Основная'
  
  // Начало функции NewRowInMain()
  Logger.log("START NewRowInMain()")
  
  // Вкладка 'Основная'
  var Main = SpreadsheetApp.getActive().getSheetByName('Основная')
  Logger.log("Main=" + Main)
  
  // Расчет номера последней строки на вкладке 'Основная'
  var indexLastRowInMain = SpreadsheetApp.getActive().getSheetByName('Основная').getLastRow()
  Logger.log('indexLastRowInMain=' + indexLastRowInMain)
  
  // Увеличиваем именнованные диапазоны таблица 'Основная'
  SpreadsheetApp.getActive().setNamedRange('ОсновнаяТаблица', Main.getRange('A2:E' + indexLastRowInMain))
  SpreadsheetApp.getActive().setNamedRange('RowInLib', Main.getRange('I2:I' + indexLastRowInMain))
  Logger.log('В именованные диапазоны добавлены новые строки (NamedRange=' + indexLastRowInMain + ')')
  
  // Копируем данные из старой строки в новую 

  var LastRowInMain = SpreadsheetApp.getActive().getSheetByName('Основная').getRange(indexLastRowInMain-1, 1, 1, 9) // Диапазон старой строки  
  Logger.log('LastRowInMain=' + LastRowInMain)
  var NewRowInMain = SpreadsheetApp.getActive().getSheetByName('Основная').getRange(indexLastRowInMain, 1, 1, 9) // Диапазон новой строки
  Logger.log('NewRowInMain=' + NewRowInMain)
  LastRowInMain.copyTo(NewRowInMain, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false) // Копируем формат
  Logger.log('В новой строке установлен как в предыдущей строке ФОРМАТ')
  
  // Копируем доплнительные диапазоны из старой и новой строки, т.к. формула копирования формул так же переносит значения из некоторых ячеек
  var LastRowInMain2 = SpreadsheetApp.getActive().getSheetByName('Основная').getRange(indexLastRowInMain-1, 2, 1, 2) // Диапазоны из старой строки
  var LastRowInMain3 = SpreadsheetApp.getActive().getSheetByName('Основная').getRange(indexLastRowInMain-1, 5, 1, 2) // Диапазоны из старой строки
  var LastRowInMain4 = SpreadsheetApp.getActive().getSheetByName('Основная').getRange(indexLastRowInMain-1, 9, 1, 1) // Диапазоны из старой строки
  var NewRowInMain2 = SpreadsheetApp.getActive().getSheetByName('Основная').getRange(indexLastRowInMain, 2, 1, 2) // Диапазоны из новой строки
  var NewRowInMain3 = SpreadsheetApp.getActive().getSheetByName('Основная').getRange(indexLastRowInMain, 5, 1, 2) // Диапазоны из новой строки
  var NewRowInMain4 = SpreadsheetApp.getActive().getSheetByName('Основная').getRange(indexLastRowInMain, 9, 1, 1) // Диапазоны из новой строки
  LastRowInMain2.copyTo(NewRowInMain2, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false) // Копируем формулы из доп диапазона 2
  LastRowInMain3.copyTo(NewRowInMain3, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false) // Копируем формулы из доп диапазона 3
  LastRowInMain4.copyTo(NewRowInMain4, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false) // Копируем формулы из доп диапазона 4
  Logger.log('В новой строке установлен как в предыдущей строке ФОРМУЛЫ')
  
  // Переносим проверку данных на следующую строку, т.к. проверка нужна уже в начале ввода данных
  var NextRowInMain = SpreadsheetApp.getActive().getSheetByName('Основная').getRange(indexLastRowInMain+1, 1, 1, 9) // Диапазон старой строки  
  Logger.log('NextRowInMain=' + NextRowInMain)
  NewRowInMain.copyTo(NextRowInMain, SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false) // Копируем проверку данных
  Logger.log('В новой строке установлен как в предыдущей строке ПРОВЕРКА ДАННЫХ')
  
  // Делаем активной вторую ячейку в таблице
  //SpreadsheetApp.getActive().getCurrentCell().offset(0, 3).activate()

  // Конец функции NewRowInMain()
  Logger.log("END NewRowInMain()")
}
