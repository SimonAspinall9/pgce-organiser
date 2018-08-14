app.controller("OrganiserController", [
  "$scope",
  "$http",
  "$q",
  "$timeout",
  function($scope, $http, $q, $timeout) {
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
        $scope.blah = blah;
      });
    };

    var something = function(values) {
      document.getElementById("exampleModalCenterTitle").innerHTML =
        values.title || "Create new event";
      document.getElementById("eventId").value = values.id || "";
      document.getElementById("eventName").value = values.name || "";
      document.getElementById("eventDesc").value = values.desc || "";
      document.getElementById("eventDate").value = values.date;
      document.getElementById("eventType").value = values.type || "";
      document.getElementById("eventNotes").value = values.notes || "";
      document.getElementById("exampleEvent").innerText =
        values.example || "Example Event";
      $("#eventColor").spectrum("set", values.color || "#ffffff");
      $("#eventTextColor").spectrum("set", values.textColor || "#000000");
      $("#exampleEvent").css({
        "background-color": values.color || "#ffffff",
        color: values.textColor || "#000000"
      });
    };

    $scope.initModal = function() {
      $scope.event = {};
    };

    $scope.click = function(myDate) {
      something({
        date: moment(myDate).format("YYYY-MM-DDThh:mm")
      });
      $scope.event = {};
    };

    $scope.clearForm = function() {
      something({
        title: "",
        id: "",
        name: "",
        desc: "",
        type: "",
        notes: "",
        example: "Example Event",
        color: "#ffffff",
        textColor: "#000000"
      });
    };

    $scope.eventClicked = function(event) {
      $("#exampleModalCenter").modal("show");
      something({
        title: "Edit event",
        id: event.id,
        name: event.name,
        desc: event.description,
        date: moment(event.dateTime).format("YYYY-MM-DDThh:mm"),
        type: event.eventType,
        notes: event.additionalNotes,
        example: event.name,
        color: event.color,
        textColor: event.textColor
      });
      $scope.event = event;
    };

    $scope.onTypeChange = function(eventType) {
      var colors = defaultColors[eventType];
      if (colors) {
        $("#eventColor").spectrum("set", colors.color);
        $("#eventTextColor").spectrum("set", colors.textColor);
        $("#exampleEvent").css({
          "background-color": colors.color,
          color: colors.textColor
        });
      }
    };

    $scope.saveEvent = function() {
      saveEvent({
        id: document.getElementById("eventId").value,
        name: document.getElementById("eventName").value,
        description: document.getElementById("eventDesc").value,
        dateTime: document.getElementById("eventDate").value,
        eventType: document.getElementById("eventType").value,
        additionalNotes: document.getElementById("eventNotes").value,
        color: $("#eventColor").spectrum("get").toHexString(),
        textColor: $("#eventTextColor").spectrum("get").toHexString()
      }).then(function(event) {
        window.location.reload();
      });
    };
  }
]);
