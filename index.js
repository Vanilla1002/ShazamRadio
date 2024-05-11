//const playRadio = document.getElementsByClassName("playButton");
let isRadio = false;
const radioMap = {
    "glglz":"https://glzwizzlv.bynetcdn.com/glglz_mp3?awCollectionId=misc&awEpisodeId=glglz",
    "glz":"https://glzwizzlv.bynetcdn.com/glz_mp3?awCollectionId=misc&awEpisodeId=glz",
    "darom":"https://cdn.cybercdn.live/Darom_97FM/Live/icecast.audio",
    "darom101.5FM":"https://cdn.cybercdn.live/Darom_1015FM/Live/icecast.audio",
    "kolUniversity":"https://1062onair.runi.ac.il/idc123.mp3",
    "kan88":"https://27873.live.streamtheworld.com/KAN_88.mp3?dist=coolsite",
    "kanBet":"https://22533.live.streamtheworld.com/KAN_BET.mp3?dist=coolsite",
    "kanGimmel":"https://25583.live.streamtheworld.com/KAN_GIMMEL.mp3?dist=coolsite",
    "kanMoreshet":"https://25483.live.streamtheworld.com/KAN_MORESHET.mp3?dist=coolsite",
    "kanKolHamusica":"https://27873.live.streamtheworld.com/KAN_KOL_HAMUSICA.mp3?dist=coolsite",
    "kanReka":"https://25483.live.streamtheworld.com/KAN_REKA.mp3?dist=coolsite",
    "kanTarbut":"https://25483.live.streamtheworld.com/KAN_REKA.mp3?dist=coolsite",
    "ivriShesh":"https://streaming.radio.co/sa06221901/listen",
    "ramatHasharon":"https://radio.streamgates.net/stream/1036",
    "eco99FM":"https://eco01.livecdn.biz/ecolive/99fm_aac/icecast.audio",
    "103FM":"https://cdn.cybercdn.live/103FM/Live/icecast.audio",
    "radius":"https://cdn.cybercdn.live/Radios_100FM/Audio/icecast.audio",
    "r90":"https://cdn.cybercdn.live/Emtza_Haderech/Live_Audio/icecast.audio",
    "telAviv102FM":"https://102.livecdn.biz/102fm_mp3",
    "shiridikaon":"https://diki.mediacast.co.il/diki",
    "shiriAhava":"https://liveradio.co.il/radiolove",
    "kezevMizrahi":"https://liveradio.co.il/radio_i",
    "kezevYamTichoni":"https://liveradio.co.il:1040/;",
    "kolBarama":"https://cdn.cybercdn.live/Kol_Barama/Live_Audio/icecast.audio",
    "kolHagolan":"https://liveradio.co.il/kolhagolan",
    "kolHagalilTop":"https://radio.streamgates.net/stream/galil",
    "kolHayamHaadom":"https://cdn.cybercdn.live/Eilat_Radio/Live/icecast.audio",//radio eilat
    "kolHaKinneret":"https://radio.streamgates.net/stream/kinneret",
    "kolHamizrah":"https://mzr.mediacast.co.il/mzradio",//נושמים מזרחית
    "kolHamerkaz":"https://liveradio.co.il:9050/;",
    "kolHashfela":"https://radio.streamgates.net/stream/1036kh",
    "kolHai":"https://live.kcm.fm/live-new",
    "kolYezreel":"https://radio.streamgates.net/stream/yezreel", //106fm
    "kolNatanya":"https://radio.streamgates.net/stream/netanya",//106fm
    "kolRega":"https://cdn.cybercdn.live/Kol_Rega/Live_Audio/icecast.audio",
    "tzafon104.5":"https://cdn.cybercdn.live/Tzafon_NonStop/Live_Audio/icecast.audio",
    "sol":"https://radio.streamgates.net/stream/sol",
    "sahar":"https://live.ecast.co.il/stream/sahar",//רדיו סהר
    "neto":"https://live.ecast.co.il/stream/radioneto1",//רדיו נטו
    "noshmimMizrahit":"https://mzr.mediacast.co.il/mzradio",
    "nostalgiaIsraeli":"http://194.213.4.197:8000/;stream/1",
    "bgu":"https://bguradio.co/listen/bguradio/radio.mp3",//בן גוריון רדיו
    "martitMeitarBalev":"https://liveradio.co.il/wet",
    "mizrahit":"https://mzr.mediacast.co.il/mzradio",
    "mahotHachaim":"https://eol-live.cdnwiz.com/eol/eolsite/icecast.audio",
    "levHamedina":"https://cdn.cybercdn.live/Lev_Hamedina/Audio/icecast.audio",
    "KaholYavan":"https://icecast.live/proxy/livegreece/livegreece",
    "jerusalem":"https://cdn.cybercdn.live/JerusalemRadio/Live/icecast.audio",
    "101.5":"https://cdn.cybercdn.live/Hatahana_1015/Live_Audio/icecast.audio",
    "hakatze":"https://kzradio.mediacast.co.il/kzradio_live/kzradio/icecast.audio",//הקצה
    "galiIsrael":"https://cdn.cybercdn.live/Galei_Israel/Live/icecast.audio",
    "breslev":"https://cast.ereznet.co.il/radio/8070/radio.mp3",
    "oranim":"https://radio.streamgates.net/stream/oranim",
}
for (let stationId in radioMap){
    let radioButtons = document.getElementsByClassName(stationId);
    let audioStation = new Audio(radioMap[stationId]);
    radioButtons[0].addEventListener('click', () => {
        if (!isRadio){
            audioStation.play(); 
            isRadio = true;
        }
        else{
            audioStation.pause();
            isRadio = false;
        }
    });
    radioButtons[1].addEventListener('click',()=>{
        if (!isRadio){
            audioStation = new Audio(radioMap[stationId]);
            audioStation.play(); 
            isRadio = true;
        }
    }); 
    
}


