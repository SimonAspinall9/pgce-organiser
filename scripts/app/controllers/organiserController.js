app.controller("OrganiserController", [
  "$scope",
  "$http",
  "$q",
  function($scope, $http, $q) {
    var getDates = function(startDate, stopDate) {
      var dateArray = [];
      var currentDate = moment(startDate);
      var stopDate = moment(stopDate);
      while (currentDate <= stopDate) {
        dateArray.push({
          month: moment(currentDate).month() + 1,
          date: moment(currentDate).format("YYYY-MM-DD"),
          dayOfWeek: moment(currentDate).isoWeekday()
        });
        currentDate = moment(currentDate).add(1, "days");
      }
      return dateArray;
    };

    function weekCount(year, month_number) {
      var firstOfMonth = new Date(year, month_number - 1, 1);
      var lastOfMonth = new Date(year, month_number, 0);

      var used = firstOfMonth.getDay() + 6 + lastOfMonth.getDate();

      return Math.ceil(used / 7);
    }

    var getCalendarEvents = function() {
      return $http.get(
        "https://pgce-organiser-api.azurewebsites.net/api/calendardates"
      );
    };

    var saveCalendarEvent = function(event) {
      console.log(event);
      return $http.post(
        "https://pgce-organiser-api.azurewebsites.net/api/calendardates",
        event
      );
    };

    var saveEvent = function(event) {
      return $q(function(resolve, reject) {
        if (!event.datetime) {
          var momentMyDate = moment(
            document.getElementById("eventDate").value,
            "YYYY-MM-DDThh:mm"
          ).toDate();
          event.datetime = momentMyDate;
        }
        saveCalendarEvent(event).then(function() {
          resolve(event);
        });
      });
    };

    var months = [
      { id: 9, name: "September", year: 2018 },
      { id: 10, name: "October", year: 2018 },
      { id: 11, name: "November", year: 2018 },
      { id: 12, name: "December", year: 2018 },
      { id: 1, name: "January", year: 2019 },
      { id: 2, name: "February", year: 2019 },
      { id: 3, name: "March", year: 2019 },
      { id: 4, name: "April", year: 2019 },
      { id: 5, name: "May", year: 2019 },
      { id: 6, name: "June", year: 2019 },
      { id: 7, name: "July", year: 2019 },
      { id: 8, name: "August", year: 2019 }
    ];

    var defaultColors = {
      Assignment: {
        color: "#d4edda",
        textColor: "#155724"
      },
      "Key Date": {
        color: "#cce5ff",
        textColor: "#004085"
      },
      Other: {
        color: "#fff3cd",
        textColor: "#856404"
      }
    };

    var monthWeeks = {};
    var dates = getDates("2018-09-01", "2019-08-31");
    var blah = {};

    $scope.init = function() {
      getCalendarEvents().then(function(resp) {
        resp.data.forEach(function(e) {
          dates.find(
            d =>
              moment(d.date).format("YYYY-MMM-DD") ===
              moment(e.date).format("YYYY-MMM-DD")
          ).events = e.events;
        });

        months.forEach(function(m) {
          blah[m.name] = [];
          blah[m.name].push(dates.filter(d => d.month === m.id));
        });
        console.log(months);
        $scope.blah = blah;
      });
    };

    $scope.click = function(myDate) {
      var el = document.getElementById("eventDate");
      var momentMyDate = moment(myDate).format("YYYY-MM-DDThh:mm");
      el.value = momentMyDate;
    };

    $scope.initModal = function() {
      $scope.event = {};
    };

    $scope.getPaddingLength = function(dayOfWeek) {
      return new Array(dayOfWeek - 1);
    };

    $scope.onTypeChange = function(eventType) {
      var colors = defaultColors[eventType];
      if (colors) {
        $("#eventColor").spectrum("set", colors.color);
        $("#eventTextColor").spectrum("set", colors.textColor);
        $("#exampleEvent").css({
          "background-color": colors.color
        });
        $("#exampleEvent").css({
          color: colors.textColor
        });
      }
    };

    $scope.saveEvent = function() {
      saveEvent($scope.event).then(function(event) {
        window.location.reload();
      });
    };
  }
]);
