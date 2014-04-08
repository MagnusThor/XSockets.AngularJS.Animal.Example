
var Animal = (function () {
    function animal(name, description) {
        this.Id = (new Date()).getTime();
        this.Name = name;
        this.Description = description;
    }
    return animal;
})();


animalApp.controller('DummyController', ['$scope', '$xsCommunication', function ($scope, $xsCommunication) {


    $scope.say = "Connecting...";

    // i will only fire once
    $xsCommunication.open.then(function () {
        $scope.say = "Connected";
    });
    

}]);

animalApp.controller('AnimalsController', ['$scope', '$xsCommunication', function ($scope, $xsCommunication) {
    
    // Prepare the list by hust add an example a 'Animal'
    $scope.animals = [
    { Id: 0, Name: "Lion", Descriptions: "Can be nice animals?" }
    ];
    // Just a simple model

    $scope.animal = {
        Name: "Gorilla",
        Description: "...."
    };

    //  $xsCommunication methods
    //
    //  .one(topic).delagate(fn)
    //  .many(topic,count).delagate(fn)
    //  .subscribe(topic).delagate(fn)
    //  
    //  .publish(topic,data,cb)
    //  
    //
    // .unsubscribe(topic,cb);

    // Something has gone wrong, what to do then?
    

    $xsCommunication.error.then(function (err) {
        $scope.errorMessage = err.CustomMessage;
    });
    // When we got a connectionm what to do then?
    $xsCommunication.open.then(function () {
        $scope.removeAnimal = function (animalId) {
            $xsCommunication.publish("removeAnimal", { Id: animalId }); // tell others and me that the animal is removed.
        };
        // If someone adds and animal, add it to the list
        $xsCommunication.subscribe("addAnimal", function () {
            console.log("Server confirms subscription!");
        }).delagate(function (added) {
            $scope.animals.unshift(added); // add the animal to the "list"
        });
        
        // Some has removed a animal, lets get rid of it from the list...
        $xsCommunication.subscribe("removeAnimal").delagate(function (remove) {
            var removedAnimal = $scope.animals.filter(function (a) {
                return a.Id == remove.Id;
            });
            var index = $scope.animals.indexOf(removedAnimal[0]);
            if (index > -1)
                $scope.animals.splice(index, 1);
        });
        $scope.stopListen = function () {
           
            $xsCommunication.unsubscribe("addAnimal", function (a, state) {
                console.log(a, state);
            });
        };
        $scope.createAnimal = function () {
            $xsCommunication.publish("addAnimal", new Animal($scope.animal.Name, $scope.animal.Description), function () {
                console.log("addeed an animal");
            });
        };
    });

}]);








