//function NewRow(event) {
//  Logger.log("Start fn_NewRow")
//  Logger.log("End fn_NewRow")
//}

function onEdit(event) {
  //Logger.log("Start fn_ChangeLibrary")
  // Функция реагирует на события редактирования в ячейках

  // Имя листа на котором происходит событие (для фильтра)
  var Sheet = event.source.getActiveSheet().getSheetName()
  Logger.log("Sheet=" + Sheet)

  // Вкладка 'Основная'
  var Main = SpreadsheetApp.getActive().getSheetByName('Основная')
  Logger.log("Main=" + Main)

  // Вкладка 'Цены'
  var Prices = SpreadsheetApp.getActive().getSheetByName('Цены')
  Logger.log("Prices=" + Prices)

  // Ссылка на текущую ячейку
  var Cell = SpreadsheetApp.getActive().getCurrentCell()
  Logger.log("Cell=" + Cell)

  // Строка (номер) в которой происходит изменение
  var Row = Main.getActiveRange().getRow()
  Logger.log("Row=" + Row)

  // Столбец (номер) в котором происходит изменение
  var Column = Main.getActiveRange().getColumn()
  Logger.log("Column=" + Column)

  // Ячейка (расположение) в которой находится 'Наименование' ингредиента
  var Name = Main.getRange(Cell.getRow(), 1)
  Logger.log("Name=" + Name)

  // Столбец (значение, число) в котором формулой ищется значение в справочнике 'Цены' и возвращает номер строки если найдено значение
  var RowInLib = Main.getRange(Cell.getRow(), 8).getValue()
  Logger.log("RowInLib=" + RowInLib)

  // Расчет номера последней строки на вкладке 'Основная'
  var LastRowInMain = Main.getLastRow()
  Logger.log('LastRowInMain=' + LastRowInMain)

  // Расчет номера последней строки в именованном диапазоне 'ОсновнаяТаблица'
  var LastRowInNamedMain = Main.getNamedRanges('ОсновнаяТаблица').lastIndexOf()
  Logger.log('LastRowInNamedMain=' + LastRowInNamedMain)

  // Фильтр событий происходящих на вкладке 'Основная' и проверка на добавление строк вне ИменнованныхСписков
  if (Sheet == 'Основная' && Row > LastRowInMain) {
    Logger.log("Sheet==Основная&&Row>LastRowInMain)=TRUE")

    SpreadsheetApp.getActive().setNamedRange('ОсновнаяТаблица', Main.getRange('I2:I' + (LastRowInMain + 1)))
    Logger.log("Установлен новый диапазон NamedRange Main (" + 'I2:I' + (LastRowInMain + 1) + ")")
  }
  else {
    Logger.log("Sheet==Основная&&Row>LastRowInMain)=FALSE")
  }

  // Фильтр ячеек измения в которых учитываются скриптом
  if (Sheet == 'Основная' && Row > 1 && Column >= 2 && Column <= 3 && RowInLib == -1) {
    Logger.log("If (Sheet=='Основная'&&Row>1&&Column>=5&&Column<=6&&RowInLib==-1)=True")

    // Расчет номера последней строки в справочнике
    var NewRowInPrices = Prices.getLastRow() + 1
    Logger.log("Prices.getLastRow()=" + Prices.getLastRow() + '; NewRowInPrices=' + NewRowInPrices)

    // Копирую 'Наименование' нового ингредиента в справочник в новую строку
    Name.copyTo(Prices.getRange(NewRowInPrices, 1), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false)
    Logger.log("Data (Name=" + Name.getValue() + ") copy in a new cell (" + Prices.getRange(NewRowInPrices, 1) + ")")

    // Копирую значение активной ячейки в соответствующую ячейку справочника
    Cell.copyTo(Prices.getRange(NewRowInPrices, Column), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false)
    Logger.log("Data (Cell=" + Cell.getValue() + ") copy in a new cell {(NewRowInPrices, Column - 2)=(" + NewRowInPrices + "," + (Column - 2) + ")}")

    // Расчет номера последней строки в справочнике
    var NewRowInMain = Main.getLastRow() + 1
    Logger.log("Main.getLastRow()=" + Main.getLastRow() + '; NewRowInMain=' + NewRowInMain)

    // Увеличиваем именнованные диапазоны
    SpreadsheetApp.getActive().setNamedRange('Цены', Prices.getRange('A2:C' + NewRowInPrices))
    SpreadsheetApp.getActive().setNamedRange('Ингредиенты', Prices.getRange('A2:A' + NewRowInPrices))
    Logger.log('Именованные диапазоны увеличины на 1 строку (NamedRange=' + NewRowInPrices + ')')

    // Восстанавливаем исходную формулу в ячейке
    Cell.setFormula('=IF(ISERROR(VLOOKUP($A' + Row + ';Цены;' + Column + ';FALSE));"";VLOOKUP($A' + Row + ';Цены;' + Column + ';FALSE))')
    Logger.log('Формула в ячейке (' + Row + ',' + Column + ') восстановлена: ' + '=IF(ISERROR(VLOOKUP($A' + Row + ';Цены;' + Column + ';FALSE));"";VLOOKUP($A' + Row + ';Цены;' + Column + ';FALSE))')
  }
  else if (Sheet == 'Основная' && Row > 1 && Column >= 5 && Column <= 6 && RowInLib > 0) {
    Logger.log("If (Sheet==Основная&&Row>1&&Column>=5&&Column<=6&&RowInLib>0)=True")

    // Копирую значение активной ячейки в найденную в справочнике каточку ингридиента
    Cell.copyTo(Prices.getRange('Цены').getCell(RowInLib, Column), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
    Logger.log("Data (Cell=" + Cell.getValue() + ") copy in a availible cell {(RowInLib, Column - 3)=(" + RowInLib + "," + (Column - 3) + ")}")
  }
  else if (Sheet == 'Основная' && Row > 1 && Column == 9) {

  }
  else {
    Logger.log("If (Sheet==Основная&&Row>1&&Column>=5&&Column<=6&&RowInLib==-1)=False")
  }
  Logger.log("End fn_ChangeLibrary")
}
