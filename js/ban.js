(function (window, document) {
	
	window.mobileCheck = function() {
	  var check = false;
	  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	  return check;
	};
	
	var isHome = [ '/', '/fr' ].indexOf(window.location.pathname) >= 0;
	
	var forceMasque = false;
	var listeNoire = [
		'/fr/newsletter',
		'/fr/newsletter-confirmation-inscription',
		'/fr/concours-ailleurs-n-est-pas-loin'
	];
	listeNoire.forEach(function(url) {
		if (window.location.pathname.includes(url)) {
			forceMasque = true;
		}
	});
	
    var pEnaveyronCheck = function() {
        var pEnaveyron = sessionStorage.getItem('pEnaveyron');
        return pEnaveyron && pEnaveyron === 'true';
    };
	
	var pEnaveyronShow = function() {
		var pEnaveyronExps = ['sahara-rougier', 'ecosse-chateau-severac', 'norvege-lac-pareloup', 'bali-cascade-saint-rome-de-tarn', 'slovenie-eglise-sylvanes']; // , 'amazonie-canalettes'
		var pEnaveyronutmSrc = 'web-adt12';
		var pEnaveyronutmCmp = 'web-adt12';
		var pEnaveyronSuffix = window.mobileCheck() ? '_p' : '';
		var pEnaveyronIndExp = Math.floor(Math.random() * pEnaveyronExps.length);
		var pEnaveyronBan = document.createElement('a');
		var pEnaveyronImg = document.createElement('img');
		var pEnaveyronClose = document.createElement('span');
		pEnaveyronBan.style = 'display: block !important; text-align: center; text-decoration: none; outline: none;';
		pEnaveyronBan.href = 'https://www.enaveyron.com/?utm_source=' + pEnaveyronutmSrc + '&utm_medium=surmenu&utm_campaign=' + pEnaveyronutmCmp + '&utm_content=' + pEnaveyronExps[pEnaveyronIndExp];
		pEnaveyronBan.target = '_blank';
		pEnaveyronBan.classList.add('enaveyron-ban');
		pEnaveyronImg.src = '/enaveyron-ban/img/Aveyron_WeCanBreak_' + pEnaveyronExps[pEnaveyronIndExp] + pEnaveyronSuffix + '.jpg';
		pEnaveyronImg.style = 'max-width: 100%; width: auto; margin: 0 auto; display: block;';
		pEnaveyronBan.appendChild(pEnaveyronImg);
		pEnaveyronClose.innerHTML = 'x';
		pEnaveyronClose.classList.add('enaveyron-close');
		document.body.insertBefore(pEnaveyronBan, document.body.firstChild);
		document.body.insertBefore(pEnaveyronClose, pEnaveyronBan);
		pEnaveyronClose.onclick = function() {
			pEnaveyronBan.remove();
			pEnaveyronClose.remove();
		};
		sessionStorage.setItem('pEnaveyron', 'true');
	};
	
	if (!isHome && !pEnaveyronCheck() && !document.referrer.includes('enaveyron.com') && !forceMasque) {
		pEnaveyronShow();
	}
	

})(window, document);