if (typeof L != 'undefined') {

  L = (function(L) {

    L.lae = {}

    //Tile Layer par defaut
    L.lae.defaultTileLayer = function (options) {
      return L.tileLayer('https://cdn.laetis.fr/i/leaflet/tiles/https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
        attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia maps</a> | Map data © <a href="http://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      });
    };

    return L
  })(L)
}
