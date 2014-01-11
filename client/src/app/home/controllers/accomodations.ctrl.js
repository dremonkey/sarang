'use strict';

angular.module('home.controllers')
  .controller('AccomodationsCtrl', function ($scope) {
    $scope.hotels = [
      {
        name: 'The K-Seoul Hotel',
        link: 'http://www.agoda.com/asia/south_korea/seoul/the_k_seoul_hotel.html',
        img: '/images/hotels/kseoul.jpg',
        price: 'USD $106 - $119'
      },
      {
        name: 'Art Nouveau City',
        link: 'http://www.agoda.com/asia/south_korea/seoul/gangnam_artnouveaucity_residence.html',
        img: '/images/hotels/artnouveaucity.jpg',
        price: 'USD $147 - $161'
      },
      {
        name: 'Art Nouveau III Seoul Residence',
        link: 'http://www.agoda.com/asia/south_korea/seoul/seocho_artnouveaucity_residence.html',
        img: '/images/hotels/artnouveauIII.jpg',
        price: 'USD $95 - $100'
      },
      {
        name: 'Hotel Grammos',
        link: 'http://www.agoda.com/asia/south_korea/seoul/grammos_hotel.html',
        img: '/images/hotels/hotelgrammos.jpg',
        price: 'USD $98 - $110'
      },
      {
        name: 'Mercure Seoul Ambassador',
        link: 'http://www.agoda.com/asia/south_korea/seoul/mercure_seoul_ambassador_gangnam_sodowe.html',
        img: '/images/hotels/mercure-ambassador.jpg',
        price: 'USD $107 - $143'
      },
      {
        name: 'JW Marriot Hotel',
        link: 'http://www.agoda.com/asia/south_korea/seoul/jw_marriott_seoul_hotel.html',
        img: '/images/hotels/jwmarriot.jpg',
        price: 'USD $224 - $283'
      }
    ];
  });