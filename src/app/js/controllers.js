var Animal = (function () {
    function animal(name, description) {
        this.Id = (new Date()).getTime();
        this.Name = name;
        this.Description = description;
    }
    return animal;
})();

animalApp.controller('DummyController', ['$scope', 'xsockets',
    function ($scope, xsockets) {

        $scope.say = "Connecting...";

        // i will only fire once
        xsockets.onopen.then(function () {
            $scope.say = "Connected";
        });

    }
]);

animalApp.controller('AnimalsController', ['$scope', 'xsockets',
    function ($scope, xsockets) {

        // Prepare the list by hust add an example a 'Animal'
        $scope.animals = [{
            Id: 0,
            Name: "Lion",
            Descriptions: "Can be nice animals?"
        }];

        // Just a simple model
        $scope.animal = {
            Name: "Gorilla",
            Description: "...."
        };
        //  xsockets methods
        //
        //  .one(topic).delegate(fn)
        //  .many(topic,count).delegate(fn)
        //  .subscribe(topic).delegate(fn)
        //  
        //  .publish(topic,data,cb)
        //  
        //
        // .unsubscribe(topic,cb);

        // Something has gone wrong, what to do then?
        xsockets.onerror.then(function (err) {
            $scope.errorMessage = err.CustomMessage;
        });

        // When we got a connectionm what to do then?
        xsockets.onopen.then(function () {
            $scope.removeAnimal = function (animalId) {
                xsockets.publish("removeAnimal", {
                    Id: animalId
                }); // tell others and me that the animal is removed.
            };
            // If someone adds and animal, add it to the list
            xsockets.subscribe("addAnimal", function () {
                console.log("Server confirms subscription!");
            }).delegate(function (added) {
                $scope.animals.unshift(added); // add the animal to the "list"
            });

            // Some has removed a animal, lets get rid of it from the list...
            xsockets.subscribe("removeAnimal").delegate(function (remove) {
                var removedAnimal = $scope.animals.filter(function (a) {
                    return a.Id == remove.Id;
                });
                var index = $scope.animals.indexOf(removedAnimal[0]);
                if (index > -1)
                    $scope.animals.splice(index, 1);
            });
            $scope.stopListen = function () {

                xsockets.unsubscribe("addAnimal", function (a, state) {
                    console.log(a, state);
                });
            };
            $scope.createAnimal = function () {
                xsockets.publish("addAnimal", new Animal($scope.animal.Name, $scope.animal.Description), function () {
                    console.log("addeed an animal");
                });
            };
        });

    }
]);