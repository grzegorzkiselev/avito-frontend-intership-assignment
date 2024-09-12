## Devlog

### Подготовка

#### Как управлять стором?

Скорее всего, мне будет достаточно tanstack

#### Персистенс сортировок и фильтров

Первично буду использовать параметры, во вторую очередь localStorage.

#### Компоненты

Скорее всего буду использовать на mantine, потому что она содержит всё, что мне сейчас нужно

#### Архитектура

Попробую поглубже вникнуть в FSD, отличный повод

### Объявления

- [x] Отображается список всех объявлений продавца

- [x] Реализована пагинация показа объявлений
  - [x] Результаты запросов кэшируются
  - [x] Добавлены префетчи для предыдущей и следующей страницы, чтобы сократить ожидание пользователя
  - [x] Есть возможнсть сохранять состояние в параметрах ссылки

- [x] Реализован выбор количества объявлений для показа на странице (по умолчанию должно быть 10)
  - [x] Eсть возможность сохранять результат в ссылке

- [x] Реализован поиск по названию объявления
  - [x] В версии json server, используемой на проекте, нет возможности делать поиск подстрок — только полное соответствие. Я проработал этот вариант, но это не слишком real-world.
  - [x] Поэтому я добавил поиск на клиенте
  - [x] Поиск работает при вводе больше минимум трёх символов
  - [x] История поисков сохраняется в localStorage, пользователь получает подсказки по мере ввода. Сохраняется 5 последних уникальных ненулевых значения
  - [x] Использую нативное событие ончейндж, чтобы не заниматься дебаунсом
  - [ ] Применение подсказки работает странно, нужно потрейсить поведение, если хватит времени

- [x] На странице всех объявлений реализована фильтрация выдачи по:
  - [x] цене;
  - [x] просмотрам;
  - [x] лайкам
    - [ ] Компонент не очень удобен на больших значениях. Если останется время — переделать

- [x] Добавил сортировку на страницу объявлений
  - [x] цене;
  - [x] просмотрам;
  - [x] лайкам
    - [x] При смене сортировки возвращаю пользователя на первую страницу. Мне кажется, это ожидаемое поведение

- [x] На странице объявлений при клике на кнопку “Заказы” на карточке товара происходит переход в раздел Заказы, где показаны заказы, которые содержат это объявление в товарах.
  - [x] Фильтрую на клиенте, нужно проверять на больших данных
    - [x] Кажется, работает

- [x] Можно перейти на страницу объявления (по клику на карточку)
- [x] В карточке объявления есть следующая информация о нем:
  - [x] Картинка
  - [x] Название;
  - [x] Стоимость;
  - [x] Количество просмотров;
  - [x] Количество лайков;

- [x] Есть возможность создавать новые объявления (Модальное окно с input):
  - [x] Картинка (текстовое поле для ввода URL);
  Заметил контракт для картинки в файле с типам, но не увидел, где он применяется. Пока что остаюсь в парадигме прямого обновления ссылки внутри объявления без связывания с отдельным хранилищем ассетов
  - [x] Название (текстовое поле);
  - [x] Описание (текстовое поле)
  - [x] Стоимость (числовое поле);
    - [x] Пользователь видит превью картинки по мере ввода
    - [x] Добавил валидацию с использованием zod
    - [x] Черновик карточки сохраняется в localStorage
    - [x] Добавлены уведомления успешного / неуспешного создания карточки с текстом ошибки (пока что не юзерфрендли)
    - [x] Черновик и форма сбрасываются после успешного создания объявления

### Навигация

- [x] Вкладка “Объявления” - реализован переход на страницу объявлений
- [x] Вкладка “Заказы” - реализован переход на страницу заказов

### Страница объявления

- [] Есть возможность просмотра объявления

- [x] В редактировании объявления есть возможность:
  - [x] Менять картинку;
  - [x] Менять название;
  - [x] Менять цену;
  - [x] Менять описание.
  - [x] Хочу добавить удаление, если хватит времени
    - [x] Баг: при возвращении на страницу всех объявлений, в ссылке остаются query, которые уже могут устареть. Например, если у нас есть диапазон цен, но при редактировании карточки мы указали цену вне этого диапазона — тогда карточка будет скрыта и пользователь будет недоволен.
 Решил костылём — использую обычный `<a>`, он для этой задачи подошёл лучше.

### Страница заказов

- [x] Возможность сделать сортировку по сумме заказа
- [x] Отображается список заказов с фильтрами по статусу
Должна ли у пользователя быть возможность выбрать несоклько желаемых статусов? Бэкенд не предлагает такой возможности, останусь пока что на единичных
- [x] На карточке заказа изображена следующая информация:
  - [x] Количество товаров;
    - [x] Добавил хелпер для склонения по падежам
  - [x] Возможность завершения заказа;
          Какой статус отвечает за завершение? Буду использовать "Received"
          - [x] Кнопки со статусами выше должны быть выключены
  - [x] Стоимость заказа;
  - [x] Дата создания заказа;
    - [x] Добавил хелпер для форматирования даты
  - [x] Статус (текстом);
  - [x] Номер заказа;
  - [x] Кнопка “Показать все товары”, показывающая все товары в данном заказе (можно отображать их в этой же карточке или сделать модальное окно)
  - [x] Решил этот блок чуть-чуть иначе, надеюсь, что именно кнопка и модальное окно были не принципиальны
  Объявления можно обновить, но оно останется в изначальном виде в карточке заказа. Решения может быть 2: запрашивать карточку по id, либо просить бэкенд всё же отдавать актуальную версию карточки. Буду считать это условностью, и что в реальности бэкенд будет следить за актуальностью.
- [x] При клике на товар в заказе есть возможность перейти в объявление продавца по этому товару
- [x] На странице заказов реализована пагинация показа заказов.

### todo

- [x] Заставил макет занимать страницу целиком, футер не должен появляться в середине экрана
- [x] Адаптировал под мобильную и десктопную версию
- [x] Протестировал руками в основных операционных системах и браузерах
- [x] Lazy для необязательных роутов
- [~] Рефакторинг
- [x] Сделал базовую обработку сетевых ошибок без претензий на человекочитаемость
- [x] Протестировать на абсурдных размерах контента
- [x] Глобальный еррор-бандри
  - [ ] Добавить человекочитабельные сообщения
- [ ] Проверить семантику компонентов
- [ ] Кнопка reset для форм
- [ ] Тесты
- [ ] Прерывание (отмена/прекращение) запросов переходе со страницы на страницу
  - [ ] Кажется, tanstack делает это по умолчанию
- [ ] Стоит ли обновлять значения фильтров при обновлении поиска? Например, у нас 2 результата поиска с 500 и 1000, но выбирать цену мы может от 0 до 100000. Зачем?
