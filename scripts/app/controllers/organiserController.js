app.controller("OrganiserController", [
  "$scope",
  "$http",
  function($scope, $http) {
    var getDates = function(startDate, stopDate) {
      var dateArray = [];
      var currentDate = moment(startDate);
      var stopDate = moment(stopDate);
      while (currentDate <= stopDate) {
        dateArray.push({
          weekNumber: moment(currentDate).isoWeek(),
          weekYear: moment(currentDate).isoWeekYear(),
          month: moment(currentDate).month() + 1,
          date: moment(currentDate).format("YYYY-MM-DD")
        });
        currentDate = moment(currentDate).add(1, "days");
      }
      return dateArray;
    };

    var getCalendarEvents = function() {
      return $http.get(
        "http://pgce-organiser-api.azurewebsites.net/api/calendardates"
      );
    };

    var saveCalendarEvent = function(event) {
      return $http.post(
        "http://pgce-organiser-api.azurewebsites.net/api/calendardates",
        event
      );
    };

    $scope.months = [
      { id: 9, name: "September" },
      { id: 10, name: "October" },
      { id: 11, name: "November" },
      { id: 12, name: "December" },
      { id: 1, name: "January" },
      { id: 2, name: "February" },
      { id: 3, name: "March" },
      { id: 4, name: "April" },
      { id: 5, name: "May" },
      { id: 6, name: "June" },
      { id: 7, name: "July" },
      { id: 8, name: "August" }
    ];

    var monthWeeks = {};

    $scope.init = function() {
      var dates = getDates("2018-09-03", "2019-08-31");
      getCalendarEvents().then(function(resp) {
        resp.data.forEach(function(e) {
          dates.find(
            d =>
              moment(d.date).format("YYYY-MMM-DD") ===
              moment(e.date).format("YYYY-MMM-DD")
          ).events =
            e.events;
        });
      });

      $scope.months.forEach(function(m) {
        monthWeeks[m.name] = [];
        dates.filter(function(d) {
          if (m.id === d.month) {
            monthWeeks[m.name].push(d);
          }
        });
      });

      var results = {};
      $scope.months.forEach(function(m) {
        results[m.name] = [];
        results[m.name].push(
          monthWeeks[m.name].reduce(function(r, a) {
            r[a.weekNumber] = r[a.weekNumber] || [];
            r[a.weekNumber].push(a);
            return r;
          }, {})
        );
      });
      $scope.monthWeeks = results;
      console.log($scope.monthWeeks);
    };

    $scope.initModal = function(){
      $scope.event = {};
    }

    $scope.padWeek = function(weekLength) {
      console.log(weekLength);
      return new Array(7 - weekLength);
    };

    $scope.saveEvent = function() {
      console.log($scope.event);
      saveCalendarEvent($scope.event);
    };
  }
]);
