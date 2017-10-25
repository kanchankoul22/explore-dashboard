// Collections service used to communicate Collections REST endpoints
(function () {
  'use strict';

  angular
    .module('collections')
    .factory('CollectionsService', CollectionsService);

  CollectionsService.$inject = ['$resource'];

  function CollectionsService($resource) {
    return $resource('api/collections/:collectionId', {
      collectionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      vendorWithPayment: {
        method: 'GET',
        url: 'https://in-public.foodapi.io/api/v5/vendors?payment_type=adyen,cod,hosted&include=cuisines,discounts,food_characteristics,payment_types&area_id=432174',
        headers: { 'X-FP-API-KEY': 'android' }
      }
    });
  }
}());
