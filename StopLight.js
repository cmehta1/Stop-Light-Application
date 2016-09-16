/**
 * Created by Chetas on 8/4/2016.
 */
var appCityRoads = angular.module('cityRoads', []).run(function () { });

appCityRoads.controller('mainController', ["$scope", "$interval", "$timeout", "stopLightService", function ($scope, $interval, $timeout, stopLightService) {
    $scope.activeTrafficDirection = stopLightService.getDirection();

    //These two variables will decide which direction lights will be on.
    $scope.northSouthGo = true;
    $scope.eastWestGo = false;

    // This will toggle the visual stop lights.
    $scope.toggleStopLights = function () {
        if ($scope.interval) {
            alert("Press stop button to stop automatic 5 seconds interval");
        } else {
            $scope.toggleTrafficDirection();
            $scope.toggleLights();
        }
    };

    // Toggles the flow of traffic and sets the current active traffic direction using the service.
    $scope.toggleTrafficDirection = function () {
        stopLightService.toggleTrafficDirection($scope.activeTrafficDirection);
        $scope.activeTrafficDirection = stopLightService.getDirection();
    };

    // Toggles which lights will turn green or red.
    $scope.toggleLights = function () {
        if ($scope.activeTrafficDirection == "NS") {
            $scope.northSouthGo = true;
        } else {
            $scope.northSouthGo = false;
        }

        $scope.eastWestGo = !$scope.northSouthGo;
    };

    // Starts the interval traffic process.
    $scope.startIntervalTraffic = function () {
        $scope.interval = $interval(function () {
            // Switch the flow of traffic
            $scope.toggleTrafficDirection();

            // Onward traffic flow about to go and the opposite getting ready to stop.(for Yellow Light)
            $timeout(function () {
                if ($scope.activeTrafficDirection == "NS") {
                    $scope.northSouthReadyToStop = true;
                } else {
                    $scope.eastWestReadyToStop = true;
                }

                // Onward traffic went and the opposite stopped.
                $timeout(function () {
                    $scope.toggleLights();
                    $scope.eastWestReadyToStop = false;
                    $scope.northSouthReadyToStop = false;
                }, 2000);
            }, 1000);
        }, 5000);
    };

    // This will stop the interval traffice process.
    $scope.stopIntervalTraffic = function () {
        $interval.cancel($scope.interval);
        $scope.interval = false;
    }
}]);

appCityRoads.service('stopLightService', function() {

    //- should hold value that indicates the direction of traffic. North/South and East/West
    //- create a function that will toggle the value.
    // NS = North/South
    // EW = East/West
    // Initial direction is NS
    
    
    var trafficDirection = "NS";

    // This will toggle the traffic direction-
    var toggleTrafficDirection = function () {
        if (trafficDirection === "NS") {
            trafficDirection = "EW";
        } else {
            trafficDirection = "NS";
        }
    };

    // This will return the current direction of traffic-
    var getDirection = function() {
        return trafficDirection;
    };

    return {
        toggleTrafficDirection: toggleTrafficDirection,
        getDirection: getDirection
    }
});

appCityRoads.directive('stopLightDirective', function () {

    //- should change colors based on stopLightService.
    //- use an attribute to determine which direction the stop light will use.
    return {
        templateUrl: function (element, attribute) {
            return './stoplight-' + attribute.direction + '.html';
        }
    }
});

appCityRoads.directive('stopLightSwitchDirective', function () {
    //- should contain button that will toggle stopLightService.
    return {
        template: function (element, attribute) {
            var button = angular.fromJson(attribute.buttonInfo);
            return '<button class="btn btn-primary" ng-click="' + button.type + '();">' + button.name + '</button>'
        }
    }
});