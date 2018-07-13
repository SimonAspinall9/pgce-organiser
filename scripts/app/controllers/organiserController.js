app.controller("OrganiserController", [
  "$scope",
  function($scope) {
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

    $scope.init = function() {
      this.dates = getDates("2018-09-01", "2019-08-31");
      console.log(this.dates);
      $scope.dates = this.dates;
      $scope.weeks = this.dates.reduce(function(acc, date) {
        var yearWeek =
          moment(date).isoWeekYear() + "-" + moment(date).isoWeek();
        if (typeof acc[yearWeek] === "undefined") {
          acc[yearWeek] = [];
        }

        acc[yearWeek].push(date);

        return acc;
      }, {});
    };

    $scope.months = [
      { id: 9, name: "September" },
      { id: 10, name: "October" },
      { id: 11, name: "November" },
      { id: 12, name: "December" }
    ];
  }
]);

app.filter("filterByMonth", function() {
  return function(items, month) {
    if (!month) {
      return items;
    }

    return items;
  };
});
