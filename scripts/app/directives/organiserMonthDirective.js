app.directive('organiserMonth',
function() {
    return {
        restrict: 'EA',
        scope: {
            monthId: '='
        },
        templateUrl: '/scripts/app/templates/organiser-month.html',
        controller: 'OrganiserController'
    };
});