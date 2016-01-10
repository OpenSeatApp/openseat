var Q = require('q');
var PassengerRoutes = require('./passengerRoutesModel');
var DriverRoutes = require('./driverRoutesModel');
var User = require('./../users/usersModel');
var distanceCalculator = require('../../../algorithm/utility');

var findAllPassengerRoutes = Q.nbind(PassengerRoutes.find, PassengerRoutes);
var findPassengerRoutes = Q.nbind(PassengerRoutes.findOne, PassengerRoutes);
var createPassengerRoutes = Q.nbind(PassengerRoutes.create, PassengerRoutes);
var updatePassengerRoutes = Q.nbind(PassengerRoutes.update, PassengerRoutes);

var findAllDriverRoutes = Q.nbind(DriverRoutes.find, DriverRoutes);
var findDriverRoutes = Q.nbind(DriverRoutes.findOne, DriverRoutes);
var createDriverRoutes = Q.nbind(DriverRoutes.create, DriverRoutes);
var updateDriverRoutes = Q.nbind(DriverRoutes.update, DriverRoutes);

var findUser = Q.nbind(User.findOne, User);

module.exports = {

  userInterestedInDriverRoute: function(req, res, next){
    var passengerRouteId = req.body.passengerRouteId;
    var driverRouteId = req.body.driverRouteId;

    findDriverRoutes({ _id: driverRouteId })
      .then(function(driverRoute){

        findPassengerRoutes({ _id: passengerRouteId })
          .then(function(passengerRoute){

            if (passengerRoute.driverRoutesIAmInterestedIn.indexOf(driverRouteId) === -1)
              passengerRoute.driverRoutesIAmInterestedIn.push(driverRoute);

            if (driverRoute.prospectivePassengerRoutes.indexOf(passengerRouteId) === -1)
              driverRoute.prospectivePassengerRoutes.push(passengerRoute);

            passengerRoute.save();
            driverRoute.save();
            res.sendStatus(200);
          });

      })
      .fail(function(error) {
        next(error);
      });
  },

  driverConfirmsPassenger: function(req, res, next){
    var passengerRouteId = req.body.passengerRouteId;
    var driverRouteId = req.body.driverRouteId;

    findDriverRoutes({ _id: driverRouteId })
      .then(function(driverRoute){

        findPassengerRoutes({ _id: passengerRouteId })
          .then(function(passengerRoute){
            driverRoute.confirmedPassengerRoutes.push(passengerRoute);
            passengerRoute.confirmedDriverRoute = driverRoute;
            passengerRoute.save();
            driverRoute.save();

            updatePassengerRoutes({ _id: passengerRouteId },
              { $pull: { driverRoutesIAmInterestedIn: { _id: driverRouteId } } }
            );

            updateDriverRoutes({ _id: driverRouteId },
              { $pull: { prospectivePassengerRoutes: { _id: passengerRouteId } } }
            );

            res.sendStatus(200);
          });

      })
      .fail(function(error) {
        next(error);
      });
  },

  bestDriverRoutesForPassengerRouteId: function(req, res, next){
    var passengerRouteId = req.params.id;
    var results = [];

    findPassengerRoutes({ _id: passengerRouteId })
      .then(function(passengerRoute){
        if (!passengerRoute){
          return res.sendStatus(400);
        }

        DriverRoutes.find({})
          .populate('driverInformation')
          .exec(function(error, driverRoutes){
            if (error){
              return res.sendStatus(400);
            }
            
            for(var i=0; i<driverRoutes.length; i++){
              var driverRoute = driverRoutes[i];
              if (driverRoute.confirmedPassengerRoutes.length >= driverRoute.seats){
                continue;
              }

              var distance = distanceCalculator([passengerRoute.start, passengerRoute.end],
                [driverRoute.start, driverRoute.end],
                [[passengerRoute.fromHour, passengerRoute.fromMinutes],[passengerRoute.toHour, passengerRoute.toMinutes]],
                [[driverRoute.fromHour, driverRoute.fromMinutes],[driverRoute.toHour, driverRoute.toMinutes]],
                passengerRoute.days, driverRoute.days);

              if (distance || distance === 0){
                results.push({ driverRoute: driverRoute, distance: distance, driver: driverRoute.driverInformation });
              }
            }

            results.sort(function(a, b) {
              return a.distance - b.distance;
            });

            res.status(200).json(results);
          });
      })
      .fail(function(error) {
        next(error);
      });
  },

  insertPassengerRoute: function(req, res, next){
    var passengerRoute = req.body.route;
    var userId = req.body.userId;

    findUser({ _id: userId })
      .then(function(user){
        createPassengerRoutes({
          name: passengerRoute.name,
          start: passengerRoute.start,
          end: passengerRoute.end,
          startLabel: passengerRoute.startLabel,
          endLabel: passengerRoute.endLabel,
          days: passengerRoute.days,
          endLabel : passengerRoute.endLabel,
          startLabel : passengerRoute.startLabel,
          fromHour: passengerRoute.fromHour,
          fromMinutes: passengerRoute.fromMinutes,
          toHour: passengerRoute.toHour,
          toMinutes: passengerRoute.toMinutes,
          passengerInformation: user
        })
        .then(function(newRoute){
          user.PassengerRoutes.push(newRoute);
          user.IsDriver = false;
          user.save();
          res.status(200).json(newRoute);
        });
      })
      .fail(function(error) {
        next(error);
      });

  },

  getPassengerRoutes: function(req, res, next) {
    findAllPassengerRoutes()
      .then(function(routes) {
        res.status(200).json(routes);
      })
      .fail(function(error) {
        next(error);
      });
  },

  insertDriverRoute: function(req, res, next){
    var driverRoute = req.body.route;
    var userId = req.body.userId;

    findUser({ _id: userId })
      .then(function(user){
        createDriverRoutes({
          name : driverRoute.name,
          start: driverRoute.start,
          end: driverRoute.end,
          startLabel: driverRoute.startLabel,
          endLabel: driverRoute.endLabel,
          days: driverRoute.days,
          endLabel : driverRoute.endLabel,
          startLabel : driverRoute.startLabel,
          fromHour: driverRoute.fromHour,
          fromMinutes: driverRoute.fromMinutes,
          toHour: driverRoute.toHour,
          toMinutes: driverRoute.toMinutes,
          seats: driverRoute.seats,
          fee: driverRoute.fee,
          driverInformation: user
        })
        .then(function(newRoute){
          user.IsDriver = true;
          user.DriverRoutes.push(newRoute);
          user.save();
          res.status(200).json(newRoute);
        })
        .fail(function(error) {
          console.log(error);
          next(error);
        });
      })
      .fail(function(error) {
        console.log(error);
        next(error);
      });
  },

  getDriverRoutes: function(req, res, next) {
    DriverRoutes.find({})
      .populate({
        path: 'prospectivePassengerRoutes',
        model: 'passengerRoutes'
      })
      .exec(function(error, routes){
        if (error){
          return res.sendStatus(400);
        }
        
        res.status(200).json(routes);
      });
  },

  getPassengerRoutesForUserId: function(req, res, next){
    var passengerId = req.params.userId;
    User.findOne({ _id: passengerId })
      .populate({
        path: 'PassengerRoutes',
        populate: {
          path: 'confirmedDriverRoute',
          model: 'driverRoutes',
          populate: {
            path: 'driverInformation',
            model: 'users'
          }
        }
      })
      .exec(function(error, user){
        if (error){
          return res.sendStatus(400);
        }

        res.status(200).json(user.PassengerRoutes);
      });
  },

  getDriverRoutesForUserId: function(req, res, next){
    var driverId = req.params.userId;
    var numProspectivePassengerRoutes = 0;
    var current = 0;

    User.findOne({ _id: driverId })
      .populate({
            path: 'DriverRoutes',
            populate: {
              path: 'prospectivePassengerRoutes',
              model: 'passengerRoutes',
              populate: {
                path: 'passengerInformation',
                model: 'users'
              }
            }
          })
      .exec(function(error, user){
        if (error){
          return res.sendStatus(400);
        }

        res.status(200).json(user.DriverRoutes);
      });
  }
};
