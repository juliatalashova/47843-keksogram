'use strict';

(function() {
  var container = document.querySelector('.hotels-list');
  var activeFilter = 'filter-all';
  var hotels = [];

  var filters = document.querySelectorAll('.hotel-filter');
  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function(evt) {
      var clickedElementID = evt.target.id;
      setActiveFilter(clickedElementID);
    };
  }

  getHotels();

  function renderHotels(hotelsToRender) {
    container.innerHTML = '';
    var fragment = document.createDocumentFragment();

    hotelsToRender.forEach(function(hotel) {
      var element = getElementFromTemplate(hotel);

      // Для каждого из 50 элементов вызывается отрисовка в DOM.
      // Потенциально, это замедляет производительность в старых браузерах,
      // потому что пересчет параметров страницы будет производиться после
      // каждой вставки элемента на страницу. Чтобы этого избежать, пользуются
      // фрагментами, нодами вида DocumentFragment, которые представляют
      // собой контейнеры для других элементов.
      fragment.appendChild(element);
    });

    container.appendChild(fragment);
  }

  /**
   * Установка выбранного фильтра
   * @param {string} id
   * @param {boolean=} force Флаг, при котором игнорируется проверка
   *     на повторное присвоение фильтра.
   */
  function setActiveFilter(id, force) {
    // Предотвращение повторной установки одного и того же фильтра.
    if (activeFilter === id && !force) {
      return;
    }

    // Отсортировать и отфильтровать отели по выбранному параметру и вывести на страницу
    // hotels будет хранить _изначальный_ список отелей, чтобы можно было отменить
    // фильтр и вернуться к изначальному состоянию списка. Array.sort изменяет
    // исходный массив, поэтому сортировку и фильтрацию будем производить на копии.
    var filteredHotels = hotels.slice(0); // Копирование массива

    switch (id) {
      case 'filter-expensive':
        // Для показа сначала дорогих отелей, список нужно отсортировать
        // по убыванию цены.
        filteredHotels = filteredHotels.sort(function(a, b) {
          return b.price - a.price;
        });
        break;

      case 'filter-cheap':
        filteredHotels = filteredHotels.sort(function(a, b) {
          return a.price - b.price;
        });
        break;

      case 'filter-2stars':
        // Формирование списка отелей минимум с двумя звездами производится
        // в два этапа: отсеивание отелей меньше чем с двумя звездами
        // и сортировка по возрастанию количества звезд.
        filteredHotels = filteredHotels.sort(function(a, b) {
          return a.stars - b.stars;
        }).filter(function(item) {
          return item.stars > 2;
        });

        break;
    }

    renderHotels(filteredHotels);

    activeFilter = id;
  }

  /**
   * Загрузка списка отелей
   */
  function getHotels() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/hotels.json');
    xhr.onload = function(evt) {
      var rawData = evt.target.response;
      var loadedHotels = JSON.parse(rawData);
      updateLoadedHotels(loadedHotels);
    };

    xhr.send();
  }

  /**
   * Сохранение списка отелей в переменную hotels, обновление счетчика отелей
   * и вызов фильтрации и отрисовки.
   * @param {Array.<Object>} loadedHotels
   */
  function updateLoadedHotels(loadedHotels) {
    hotels = loadedHotels;
    document.querySelector('.hotels-title-count-number').innerText = hotels.length;

    // Обработка загруженных данных (например отрисовка)
    // NB! Важный момент не освещенный в лекции — после загрузки отрисовка
    // дожна производиться не вызовом renderHotels а setActiveFilter,
    // потому что теперь механизм отрисовки работает через фильтрацию.
    setActiveFilter(activeFilter, true);
  }
})();
