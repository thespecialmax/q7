(function (window, $) {

    /*
    pouvoir ajouter plusieurs galerie dans une même page
    */
    var galleryIdPrefix = 'galerie-medias'; // prefixe d'identifiant des galeries

    var FancyGallery = function(galleryId='galerie-medias') {
        this.galleryId = galleryId;
        this.mediasClass = '.galerie__media';
        this.btnAllClass = '.display-all-medias';
        this.btnMediaMapClass = '.display-media-map';

        this.boxOptions = {
            baseClass: '', // Custom CSS class for layout
            slideClass: '', // Custom CSS class for slide element

            speed: 330,

            /* box buttons */
            slideShow: true,
            fullScreen: true,
            thumbs: false,
            closeBtn: true,

            /* image options */
            image: {
                protect: true
            },
            /* videos options */
            youtube: {
                controls: 0,
                showinfo: 0
            },
            vimeo: {
                color: 'f00'
            }
        };

        this.initialize();
    };

    /**
     * initialise la galerie
     */
    FancyGallery.prototype.initialize = function() {

        var that = this,
            vignette = null;

        $.fancybox.defaults.hash = false;

        this.$gallery = $('#' + this.galleryId);
        this.$medias = this.$gallery.find(that.mediasClass);
        this.$btnAll = this.$gallery.find(that.btnAllClass);
        this.$vignette2 = this.$gallery.find('.lae-col:eq(2)');

        /* Affichage des 3 premieres vignettes au bon format (premiere differente */
        this.$medias.each(function(index) {
            if (index<3) {
                var $media = $(this),
                    $img = $media.find('img');
            }

            if ( index == 0 && (vignette=$img.attr('data-vignette1')) ) {
                $img.attr('src', vignette);
            } else if (index <= 2 && (vignette=$img.attr('data-vignette')) ) {
                $img.attr('src', vignette);
            }
        });

        /* Initialise automatiquement fancybox lors de l'ajout de data-fancybox */
        this.$medias.attr('data-fancybox', this.galleryId);

        /* On récupère l'instance de fancybox */
        this.fancyInstance = this.$medias.fancybox(that.boxOptions);

        this.manageEvents();

        this.$gallery.addClass('gallery-initialized');

    };

    /**
     * gestion des événements
     */
    FancyGallery.prototype.manageEvents = function() {

        var that = this,
            $body = $('body');

        /* Clic sur bouton carte*/
        $body.on('click', that.btnMediaMapClass, function (e) {
            e.preventDefault();
            var $lien = $(this);
            that.buildMapContainer($lien)
        });


        /* Clic sur voir plus/moins d'images */
        that.$btnAll.on('click', function (e) {
            e.preventDefault();

            if (that.$btnAll.hasClass('all-visible')) {
                that.showFewer();
            } else {
                that.viewMore();
            }
        });


    };



    /**
     * Affichage de toutes les images
     */
    FancyGallery.prototype.viewMore = function() {
        var that = this,
            $medias_cache = $('.media--cache'),
            $toggle = this.$btnAll.find('.text-toggle'),
            text = $toggle.text(),
            anim_duration = 300; // durée d'animation de chaque media

        $('html, body').animate({
            scrollTop: that.$vignette2.offset().top - 8
        }, anim_duration);

        $medias_cache.each(function (index, element) {
            var $media = $(this),
                $img = $media.find('img');
            /* Vérifie si media initialisé */
            if ($img.attr('data-vignette') != '') {
                /* initialisation */
                $img.attr('src', $img.attr('data-vignette')).attr('data-vignette', '');
            }
            $media.removeClass('animated--exit');
            $media.addClass('invisible  media--affiche');
            setTimeout(function () {
                $media.removeClass('invisible');
                $media.addClass('animated--entrance');
            }, index * anim_duration);
        });

        /* Gestion intitulé bouton */
        this.$btnAll.addClass('all-visible  invisible');
        setTimeout(function () {
            that.$btnAll.removeClass('invisible');
        }, $medias_cache.length * anim_duration);
        $toggle.html($toggle.attr('data-text')).attr('data-text', text);
    };

    /**
     * Masque les images supplémentaires progressivement avec animation
     */
    FancyGallery.prototype.showFewer = function() {
        var that = this,
            $medias_visible = $($('.media--affiche.animated--entrance').get().reverse()),
            $toggle = this.$btnAll.find('.text-toggle'),
            text = $toggle.text(),
            anim_duration = 250; // durée d'animation de chaque media

        $('html, body').animate({
            scrollTop: that.$vignette2.offset().top - 8 // -8 de marge blanche
        }, $medias_visible.length * anim_duration);

        $medias_visible.each(function (index, element) {
            var media = $(this);
            media.removeClass('animated--entrance');
            setTimeout(function () {
                media.addClass('animated--exit');
            }, index * anim_duration);
            setTimeout(function () {
                media.removeClass('media--affiche');
            }, $medias_visible.length * anim_duration + 200);
        });

        /* Gestion intitulé bouton */
        $toggle.html($toggle.attr('data-text')).attr('data-text', text);
        this.$btnAll.removeClass('all-visible').addClass('invisible');
        setTimeout(function () {
            that.$btnAll.removeClass('invisible');
        }, $medias_visible.length * 200);
    };

    /**
     * Construction du dom qui contiendra la carte
     * La carte s'affiche dans une lightbox par dessus la lightbox de la galerie
     * @param $lien contient la géoloc en attributs
     */
    FancyGallery.prototype.buildMapContainer = function($lien) {
        var that = this;
        $.fancybox.open(
            '<div class="responsive-map-container"><div id="fancyMap" class="media-map"></div></div>',
            {
                baseClass: 'fancy-map',
                closeClickOutside: false,
                touch: false,
                afterLoad: function (instance, slide) {
                    that.setFancyMap($lien.attr('data-lat'), $lien.attr('data-lng'))
                }
            }
        );
    };

    /**
     * Affiche la carte
     */
    FancyGallery.prototype.setFancyMap = function(lat, lng) {

        var that = this,
            $mapContainer = $('#fancyMap'),
            center = {lat: Number(lat), lng: Number(lng)};

        this.map = new google.maps.Map(document.getElementById('fancyMap'), {
            center: center,
            scrollwheel: true,
            zoom: 8
        });

        var marker = new google.maps.Marker({
            position: center,
            map: that.map,
            icon: '/themes/theme_tourisme_aveyron/img/picto-marker.png'
        });


    };

    window.FancyGallery = FancyGallery;

    // var gallery = new FancyGallery();

    $(function() {
        $('div[id^="' + galleryIdPrefix + '"]').each(function() {
            var id = $(this).attr('id');
            new FancyGallery(id);
        });
    });



    /**
     * Cas particulier : theme mobile
     * Chargement page details en ajax sur vue liste
     */
    var dsioDetail = document.querySelector("#dsioDetailWrapper");
    if (dsioDetail) {
        var mut = new MutationObserver(function(mutations, mut){
            if ($('#galerie-medias:not(.gallery-initialized)').length>0) {
                gallery = new FancyGallery();
            }
        });
        mut.observe(dsioDetail,{
            'attributes': true
        });
    }

})(window, jQuery);

;
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright В© 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright В© 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */;
// JavaScript Document
if(lae==null){ var lae={}; }
if(lae.dsio==null){ lae.dsio={}; }

//object
lae.dsio.RoyalPlayer=function(argsArray) {
	this.divPlayerIhm=argsArray.divIdPlayerIhm;
	this.normalPlayerPrms=argsArray.normalPlayerPrms;
	
	this.divBackgroundZoom=null;
	if(argsArray.divBackgroundZoom)
	{
		this.divBackgroundZoom=argsArray.divBackgroundZoom;
		this.zoomPlayerPrms=argsArray.zoomPlayerPrms;
	}
	
}


//image collection = array : pair = img, impair = legende
lae.dsio.RoyalPlayer.prototype.loadWithImages=function(imageCollection)
{
	var that=this;
	var nb = imageCollection.length/2;
	var tmpHtml='';

	for (var i = 0; i < nb; i++) {
		tmpHtml+='<div class="item"><img src="'+imageCollection[i*2]+'" title="'+imageCollection[i*2+1]+'" alt="'+imageCollection[i*2+1]+'" class="rsImg"><p class="rsCaption">'+(i+1)+'/'+nb+' '+imageCollection[i*2+1]+'</p></div>';	
	}
	if(nb>0){
		$(this.divPlayerIhm).html(tmpHtml);
		$(this.divPlayerIhm).addClass('royalSlider rsDefault contentSlider');
				
		var sliderInstance = $(this.divPlayerIhm).royalSlider(that.normalPlayerPrms).data('royalSlider');
			/*sliderInstance.slides[0].holder.on('rsAfterContentSet', function() {//apres le chargement de la 1ere image
				$(that.divPlayerIhm+' .rsNavItem').each(function(index) {
						this.innerHTML='<span>'+(index+1)+'</span>';
				});
		});*/
		//full screen
	
		if(this.divBackgroundZoom)
		{
			$(this.divBackgroundZoom).html('<div id="dsioOiDetailPlayerMediaListFullScreen" class="royalSlider rsDefault contentSlider">'+tmpHtml+'</div>');
	
				var sliderInstanceFull = $('#dsioOiDetailPlayerMediaListFullScreen').royalSlider(that.zoomPlayerPrms).data('royalSlider');
				sliderInstanceFull.slides[0].holder.on('rsAfterContentSet', function() {//apres le chargement de la 1ere image
						$('#dsioOiDetailPlayerMediaListFullScreen .rsNavItem').each(function(index) {
								this.innerHTML='<span>'+(index+1)+'</span>';
						});	
						$('#dsioOiDetailPlayerMediaListFullScreen').append('<div id="cboxClose"></div>');
						$('#cboxClose').click(function (event) {
							$('#dsioOiDetailPlayerMediaListFullScreen').css('display','none');
							$(that.divBackgroundZoom).css('display','none');
							sliderInstance.startAutoPlay();
						});
						$(that.divBackgroundZoom).click(function (event) {
							event.stopImmediatePropagation();
							if(('#'+$(event.target).attr('id'))==that.divBackgroundZoom)
							{
								$('#dsioOiDetailPlayerMediaListFullScreen').css('display','none');
								$(that.divBackgroundZoom).css('display','none');
								sliderInstance.startAutoPlay();
							}
						});
						
			});
			
			sliderInstance.enterFullscreen = function(preventNative) {
				sliderInstance.stopAutoPlay();
				$(that.divBackgroundZoom).css('display','block');
				$('#dsioOiDetailPlayerMediaListFullScreen').css('display','block');
			};
		}
	}
};
var toGeoJSON = (function() {
    'use strict';

    var removeSpace = /\s*/g,
        trimSpace = /^\s*|\s*$/g,
        splitSpace = /\s+/;
    // generate a short, numeric hash of a string
    function okhash(x) {
        if (!x || !x.length) return 0;
        for (var i = 0, h = 0; i < x.length; i++) {
            h = ((h << 5) - h) + x.charCodeAt(i) | 0;
        } return h;
    }
    // all Y children of X
    function get(x, y) { return x.getElementsByTagName(y); }
    function attr(x, y) { return x.getAttribute(y); }
    function attrf(x, y) { return parseFloat(attr(x, y)); }
    // one Y child of X, if any, otherwise null
    function get1(x, y) { var n = get(x, y); return n.length ? n[0] : null; }
    // https://developer.mozilla.org/en-US/docs/Web/API/Node.normalize
    function norm(el) { if (el.normalize) { el.normalize(); } return el; }
    // cast array x into numbers
    function numarray(x) {
        for (var j = 0, o = []; j < x.length; j++) { o[j] = parseFloat(x[j]); }
        return o;
    }
    // get the content of a text node, if any
    function nodeVal(x) {
        if (x) { norm(x); }
        return (x && x.textContent) || '';
    }
    // get the contents of multiple text nodes, if present
    function getMulti(x, ys) {
        var o = {}, n, k;
        for (k = 0; k < ys.length; k++) {
            n = get1(x, ys[k]);
            if (n) o[ys[k]] = nodeVal(n);
        }
        return o;
    }
    // add properties of Y to X, overwriting if present in both
    function extend(x, y) { for (var k in y) x[k] = y[k]; }
    // get one coordinate from a coordinate array, if any
    function coord1(v) { return numarray(v.replace(removeSpace, '').split(',')); }
    // get all coordinates from a coordinate array as [[],[]]
    function coord(v) {
        var coords = v.replace(trimSpace, '').split(splitSpace),
            o = [];
        for (var i = 0; i < coords.length; i++) {
            o.push(coord1(coords[i]));
        }
        return o;
    }
    function coordPair(x) {
        var ll = [attrf(x, 'lon'), attrf(x, 'lat')],
            ele = get1(x, 'ele'),
        // handle namespaced attribute in browser
            heartRate = get1(x, 'gpxtpx:hr') || get1(x, 'hr'),
            time = get1(x, 'time'),
            e;
        if (ele) {
            e = parseFloat(nodeVal(ele));
            if (!isNaN(e)) {
                ll.push(e);
            }
        }
        return {
            coordinates: ll,
            time: time ? nodeVal(time) : null,
            heartRate: heartRate ? parseFloat(nodeVal(heartRate)) : null
        };
    }

    // create a new feature collection parent object
    function fc() {
        return {
            type: 'FeatureCollection',
            features: []
        };
    }

    var serializer;
    if (typeof XMLSerializer !== 'undefined') {
        /* istanbul ignore next */
        serializer = new XMLSerializer();
        // only require xmldom in a node environment
    } else if (typeof exports === 'object' && typeof process === 'object' && !process.browser) {
        serializer = new (require('xmldom').XMLSerializer)();
    }
    function xml2str(str) {
        // IE9 will create a new XMLSerializer but it'll crash immediately.
        // This line is ignored because we don't run coverage tests in IE9
        /* istanbul ignore next */
        if (str.xml !== undefined) return str.xml;
        return serializer.serializeToString(str);
    }

    var t = {
        kml: function(doc) {

            var gj = fc(),
            // styleindex keeps track of hashed styles in order to match features
                styleIndex = {}, styleByHash = {},
            // stylemapindex keeps track of style maps to expose in properties
                styleMapIndex = {},
            // atomic geospatial types supported by KML - MultiGeometry is
            // handled separately
                geotypes = ['Polygon', 'LineString', 'Point', 'Track', 'gx:Track'],
            // all root placemarks in the file
                placemarks = get(doc, 'Placemark'),
                styles = get(doc, 'Style'),
                styleMaps = get(doc, 'StyleMap');

            for (var k = 0; k < styles.length; k++) {
                var hash = okhash(xml2str(styles[k])).toString(16);
                styleIndex['#' + attr(styles[k], 'id')] = hash;
                styleByHash[hash] = styles[k];
            }
            for (var l = 0; l < styleMaps.length; l++) {
                styleIndex['#' + attr(styleMaps[l], 'id')] = okhash(xml2str(styleMaps[l])).toString(16);
                var pairs = get(styleMaps[l], 'Pair');
                var pairsMap = {};
                for (var m = 0; m < pairs.length; m++) {
                    pairsMap[nodeVal(get1(pairs[m], 'key'))] = nodeVal(get1(pairs[m], 'styleUrl'));
                }
                styleMapIndex['#' + attr(styleMaps[l], 'id')] = pairsMap;

            }
            for (var j = 0; j < placemarks.length; j++) {
                gj.features = gj.features.concat(getPlacemark(placemarks[j]));
            }
            function kmlColor(v) {
                var color, opacity;
                v = v || '';
                if (v.substr(0, 1) === '#') { v = v.substr(1); }
                if (v.length === 6 || v.length === 3) { color = v; }
                if (v.length === 8) {
                    opacity = parseInt(v.substr(0, 2), 16) / 255;
                    color = '#' + v.substr(6, 2) +
                        v.substr(4, 2) +
                        v.substr(2, 2);
                }
                return [color, isNaN(opacity) ? undefined : opacity];
            }
            function gxCoord(v) { return numarray(v.split(' ')); }
            function gxCoords(root) {
                var elems = get(root, 'coord', 'gx'), coords = [], times = [];
                if (elems.length === 0) elems = get(root, 'gx:coord');
                for (var i = 0; i < elems.length; i++) coords.push(gxCoord(nodeVal(elems[i])));
                var timeElems = get(root, 'when');
                for (var j = 0; j < timeElems.length; j++) times.push(nodeVal(timeElems[j]));
                return {
                    coords: coords,
                    times: times
                };
            }
            function getGeometry(root) {
                var geomNode, geomNodes, i, j, k, geoms = [], coordTimes = [];
                if (get1(root, 'MultiGeometry')) { return getGeometry(get1(root, 'MultiGeometry')); }
                if (get1(root, 'MultiTrack')) { return getGeometry(get1(root, 'MultiTrack')); }
                if (get1(root, 'gx:MultiTrack')) { return getGeometry(get1(root, 'gx:MultiTrack')); }
                for (i = 0; i < geotypes.length; i++) {
                    geomNodes = get(root, geotypes[i]);
                    if (geomNodes) {
                        for (j = 0; j < geomNodes.length; j++) {
                            geomNode = geomNodes[j];
                            if (geotypes[i] === 'Point') {
                                geoms.push({
                                    type: 'Point',
                                    coordinates: coord1(nodeVal(get1(geomNode, 'coordinates')))
                                });
                            } else if (geotypes[i] === 'LineString') {
                                geoms.push({
                                    type: 'LineString',
                                    coordinates: coord(nodeVal(get1(geomNode, 'coordinates')))
                                });
                            } else if (geotypes[i] === 'Polygon') {
                                var rings = get(geomNode, 'LinearRing'),
                                    coords = [];
                                for (k = 0; k < rings.length; k++) {
                                    coords.push(coord(nodeVal(get1(rings[k], 'coordinates'))));
                                }
                                geoms.push({
                                    type: 'Polygon',
                                    coordinates: coords
                                });
                            } else if (geotypes[i] === 'Track' ||
                                geotypes[i] === 'gx:Track') {
                                var track = gxCoords(geomNode);
                                geoms.push({
                                    type: 'LineString',
                                    coordinates: track.coords
                                });
                                if (track.times.length) coordTimes.push(track.times);
                            }
                        }
                    }
                }
                return {
                    geoms: geoms,
                    coordTimes: coordTimes
                };
            }
            function getPlacemark(root) {
                var geomsAndTimes = getGeometry(root), i, properties = {},
                    name = nodeVal(get1(root, 'name')),
                    address = nodeVal(get1(root, 'address')),
                    styleUrl = nodeVal(get1(root, 'styleUrl')),
                    description = nodeVal(get1(root, 'description')),
                    timeSpan = get1(root, 'TimeSpan'),
                    timeStamp = get1(root, 'TimeStamp'),
                    extendedData = get1(root, 'ExtendedData'),
                    lineStyle = get1(root, 'LineStyle'),
                    polyStyle = get1(root, 'PolyStyle'),
                    visibility = get1(root, 'visibility');

                if (!geomsAndTimes.geoms.length) return [];
                if (name) properties.name = name;
                if (address) properties.address = address;
                if (styleUrl) {
                    if (styleUrl[0] !== '#') {
                        styleUrl = '#' + styleUrl;
                    }

                    properties.styleUrl = styleUrl;
                    if (styleIndex[styleUrl]) {
                        properties.styleHash = styleIndex[styleUrl];
                    }
                    if (styleMapIndex[styleUrl]) {
                        properties.styleMapHash = styleMapIndex[styleUrl];
                        properties.styleHash = styleIndex[styleMapIndex[styleUrl].normal];
                    }
                    // Try to populate the lineStyle or polyStyle since we got the style hash
                    var style = styleByHash[properties.styleHash];
                    if (style) {
                        if (!lineStyle) lineStyle = get1(style, 'LineStyle');
                        if (!polyStyle) polyStyle = get1(style, 'PolyStyle');
                    }
                }
                if (description) properties.description = description;
                if (timeSpan) {
                    var begin = nodeVal(get1(timeSpan, 'begin'));
                    var end = nodeVal(get1(timeSpan, 'end'));
                    properties.timespan = { begin: begin, end: end };
                }
                if (timeStamp) {
                    properties.timestamp = nodeVal(get1(timeStamp, 'when'));
                }
                if (lineStyle) {
                    var linestyles = kmlColor(nodeVal(get1(lineStyle, 'color'))),
                        color = linestyles[0],
                        opacity = linestyles[1],
                        width = parseFloat(nodeVal(get1(lineStyle, 'width')));
                    if (color) properties.stroke = color;
                    if (!isNaN(opacity)) properties['stroke-opacity'] = opacity;
                    if (!isNaN(width)) properties['stroke-width'] = width;
                }
                if (polyStyle) {
                    var polystyles = kmlColor(nodeVal(get1(polyStyle, 'color'))),
                        pcolor = polystyles[0],
                        popacity = polystyles[1],
                        fill = nodeVal(get1(polyStyle, 'fill')),
                        outline = nodeVal(get1(polyStyle, 'outline'));
                    if (pcolor) properties.fill = pcolor;
                    if (!isNaN(popacity)) properties['fill-opacity'] = popacity;
                    if (fill) properties['fill-opacity'] = fill === '1' ? properties['fill-opacity'] || 1 : 0;
                    if (outline) properties['stroke-opacity'] = outline === '1' ? properties['stroke-opacity'] || 1 : 0;
                }
                if (extendedData) {
                    var datas = get(extendedData, 'Data'),
                        simpleDatas = get(extendedData, 'SimpleData');

                    for (i = 0; i < datas.length; i++) {
                        properties[datas[i].getAttribute('name')] = nodeVal(get1(datas[i], 'value'));
                    }
                    for (i = 0; i < simpleDatas.length; i++) {
                        properties[simpleDatas[i].getAttribute('name')] = nodeVal(simpleDatas[i]);
                    }
                }
                if (visibility) {
                    properties.visibility = nodeVal(visibility);
                }
                if (geomsAndTimes.coordTimes.length) {
                    properties.coordTimes = (geomsAndTimes.coordTimes.length === 1) ?
                        geomsAndTimes.coordTimes[0] : geomsAndTimes.coordTimes;
                }
                var feature = {
                    type: 'Feature',
                    geometry: (geomsAndTimes.geoms.length === 1) ? geomsAndTimes.geoms[0] : {
                        type: 'GeometryCollection',
                        geometries: geomsAndTimes.geoms
                    },
                    properties: properties
                };
                if (attr(root, 'id')) feature.id = attr(root, 'id');
                return [feature];
            }
            return gj;
        },
        gpx: function(doc) {
            var i,
                tracks = get(doc, 'trk'),
                routes = get(doc, 'rte'),
                waypoints = get(doc, 'wpt'),
            // a feature collection
                gj = fc(),
                feature;
            for (i = 0; i < tracks.length; i++) {
                feature = getTrack(tracks[i]);
                if (feature) gj.features.push(feature);
            }
            for (i = 0; i < routes.length; i++) {
                feature = getRoute(routes[i]);
                if (feature) gj.features.push(feature);
            }
            for (i = 0; i < waypoints.length; i++) {
                gj.features.push(getPoint(waypoints[i]));
            }
            function getPoints(node, pointname) {
                var pts = get(node, pointname),
                    line = [],
                    times = [],
                    heartRates = [],
                    l = pts.length;
                if (l < 2) return {};  // Invalid line in GeoJSON
                for (var i = 0; i < l; i++) {
                    var c = coordPair(pts[i]);
                    line.push(c.coordinates);
                    if (c.time) times.push(c.time);
                    if (c.heartRate) heartRates.push(c.heartRate);
                }
                return {
                    line: line,
                    times: times,
                    heartRates: heartRates
                };
            }
            function getTrack(node) {
                var segments = get(node, 'trkseg'),
                    track = [],
                    times = [],
                    heartRates = [],
                    line;
                for (var i = 0; i < segments.length; i++) {
                    line = getPoints(segments[i], 'trkpt');
                    if (line) {
                        if (line.line) track.push(line.line);
                        if (line.times && line.times.length) times.push(line.times);
                        if (line.heartRates && line.heartRates.length) heartRates.push(line.heartRates);
                    }
                }
                if (track.length === 0) return;
                var properties = getProperties(node);
                extend(properties, getLineStyle(get1(node, 'extensions')));
                if (times.length) properties.coordTimes = track.length === 1 ? times[0] : times;
                if (heartRates.length) properties.heartRates = track.length === 1 ? heartRates[0] : heartRates;
                return {
                    type: 'Feature',
                    properties: properties,
                    geometry: {
                        type: track.length === 1 ? 'LineString' : 'MultiLineString',
                        coordinates: track.length === 1 ? track[0] : track
                    }
                };
            }
            function getRoute(node) {
                var line = getPoints(node, 'rtept');
                if (!line.line) return;
                var prop = getProperties(node);
                extend(prop, getLineStyle(get1(node, 'extensions')));
                var routeObj = {
                    type: 'Feature',
                    properties: prop,
                    geometry: {
                        type: 'LineString',
                        coordinates: line.line
                    }
                };
                return routeObj;
            }
            function getPoint(node) {
                var prop = getProperties(node);
                extend(prop, getMulti(node, ['sym']));
                return {
                    type: 'Feature',
                    properties: prop,
                    geometry: {
                        type: 'Point',
                        coordinates: coordPair(node).coordinates
                    }
                };
            }
            function getLineStyle(extensions) {
                var style = {};
                if (extensions) {
                    var lineStyle = get1(extensions, 'line');
                    if (lineStyle) {
                        var color = nodeVal(get1(lineStyle, 'color')),
                            opacity = parseFloat(nodeVal(get1(lineStyle, 'opacity'))),
                            width = parseFloat(nodeVal(get1(lineStyle, 'width')));
                        if (color) style.stroke = color;
                        if (!isNaN(opacity)) style['stroke-opacity'] = opacity;
                        // GPX width is in mm, convert to px with 96 px per inch
                        if (!isNaN(width)) style['stroke-width'] = width * 96 / 25.4;
                    }
                }
                return style;
            }
            function getProperties(node) {
                var prop = getMulti(node, ['name', 'cmt', 'desc', 'type', 'time', 'keywords']),
                    links = get(node, 'link');
                if (links.length) prop.links = [];
                for (var i = 0, link; i < links.length; i++) {
                    link = { href: attr(links[i], 'href') };
                    extend(link, getMulti(links[i], ['text', 'type']));
                    prop.links.push(link);
                }
                return prop;
            }
            return gj;
        }
    };
    return t;
})();

if (typeof module !== 'undefined') module.exports = toGeoJSON;;
/**
 * Created by vib on 13/11/2016.
 * ce script, chargé en fin de page, a besoin de jquery
 * il peut avoir des dépendances mutiples
 * <script src="/lae/public1.0/plugins/vendor/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.min.js"></script>
 <script src="/lae/public1.0/js/vendor/moment.min.js"></script>
 <script src="/lae/public1.0/plugins/vendor/kalendae/kalendae.min.js"></script>
 <script src="/lae/public1.0/js/vendor/underscore-1.8.3.min.js"></script>
 <script src="/lae/public1.0/js/vendor/lazysizes.min.js"></script>
 <link rel="stylesheet" type="text/css" href="/lae/public1.0/plugins/vendor/jquery-ui-1.10.3.custom/css/ui-lightness/jquery-ui-1.10.3.custom.min.css">
 <link rel="stylesheet" type="text/css" href="/lae/public1.0/plugins/vendor/kalendae/kalendae.css">
 <link rel="stylesheet" type="text/css" href="/lae/public1.0/fonts/font-awesome-4.4.0/css/font-awesome.min.css">
 */

(function (jQuery) {

  $=jQuery;

  function loadApi()
  {
    var dsioLangSettingDetail = typeof dsioLangSetting !== 'undefined' ? dsioLangSetting : document.documentElement.lang;
    var dsioJsApi='/lae/services1.0/plugins/laetis/diffusio-258/api/js.php?';
    var dsioLang='codeLangue=' +dsioLangSettingDetail;
    var dsioOutputType='&jsLibraries=CORE,All&output=raw';
    var dsioExtendedFolder='&ext=/ext-cdt12_site_SQL3c';
    var scriptSrc=dsioJsApi+dsioLang+dsioOutputType+dsioExtendedFolder;

    $.ajax({
      url: scriptSrc,
      dataType: 'script',
      cache:true,
      error:function(ev,err1,err2){
        console.log('Error API', err1,err2);
      },
      success: function (data, textStatus, jqxhr)
      {
        var myDsioApp=lae.dsio.App.mainloadOiDetailFromCms(lae.dsio.PrmsApp.approotDetail);

        $.each(dsioAppLayerDetailSettings, function(ind, val) {
          myDsioApp.loadOneLayerOiDetailFromCms(val);
        });

      }
    });
  }


  //charger les variables serveur sans cache !!! à chaque requête
  var serverVarsJsApi='/lae/services1.0/plugins/laetis/diffusio-258/api/lae.dsio.ServerVars.js.php';
  $.ajax({
    url: serverVarsJsApi,
    dataType: 'script',
    cache:false,
    success:function()
    {
      loadApi();
    }
  });



})(jQuery);
;
/**
 * Created by qug on 27/04/2017.
 */

(function ($) {

    var carouselSelector = '#carouselReviews',
        $carousel;

    var CarouselAvisFiltre = function() {

        this.filtersMenuSelector = '.avis__filtres';
        this.activeFilterClass = 'is-active';

        this.carouselOptions = {
            slidesToShow: 2,
            slidesToScroll: 1,
            // autoplay: true,
            autoplaySpeed: 5000,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        };

        this.initialize();
    };

    CarouselAvisFiltre.prototype.initialize = function() {
        var that = this;

        $carousel.slick(that.carouselOptions);

        this.$menu = $(that.filtersMenuSelector);
        this.$filters = this.$menu.find('a[data-filter]');


        this.manageEvents();
    };

    CarouselAvisFiltre.prototype.manageEvents = function() {

        var that = this;

        this.$filters.on('click', function() {
            var $a = $(this);
            that.applyFilter($a.attr('data-filter'));
            that.$filters.not($a).removeClass(that.activeFilterClass);
            $a.addClass(that.activeFilterClass);
        });

    };



    CarouselAvisFiltre.prototype.applyFilter = function(filter) {
        console.log(filter);
        $carousel.slick('slickUnfilter');
        if (filter!='all') {
            $carousel.slick('slickFilter','.'+filter).slick('slickGoTo',0, true);
        }

    };

    $(function() {

        $carousel = $(carouselSelector);
        if ($carousel.length>0) {
            new CarouselAvisFiltre();
        }

    });


})(jQuery);
;
