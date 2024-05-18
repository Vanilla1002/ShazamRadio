class RadioToHebrewNames{
    hebrewName: string;
    link: string;

    public constructor(hebrewName: string,link: string){
        this.hebrewName = hebrewName;
        this.link = link
    }
}



let isRadio: boolean = false;
const radioMap: {[key: string]: RadioToHebrewNames} = {
    "glglz":new RadioToHebrewNames("גלגלצ" , "https://glzwizzlv.bynetcdn.com/glglz_mp3?awCollectionId=misc&awEpisodeId=glglz"),
    "glz":new RadioToHebrewNames("גלי צהל","https://glzwizzlv.bynetcdn.com/glz_mp3?awCollectionId=misc&awEpisodeId=glz"),
    "darom":new RadioToHebrewNames("רדיו דרום","https://cdn.cybercdn.live/Darom_97FM/Live/icecast.audio"),
    "darom101.5FM":new RadioToHebrewNames("רדיו דרום 101.5","https://cdn.cybercdn.live/Darom_1015FM/Live/icecast.audio"),
    "kan88":new RadioToHebrewNames("כאן 88","https://27873.live.streamtheworld.com/KAN_88.mp3?dist=coolsite"),
    "kanBet":new RadioToHebrewNames("כאן רשת ב","https://22533.live.streamtheworld.com/KAN_BET.mp3?dist=coolsite"),
    "kanGimmel":new RadioToHebrewNames("כאן רשת ג","https://25583.live.streamtheworld.com/KAN_GIMMEL.mp3?dist=coolsite"),
    "kanMoreshet":new RadioToHebrewNames("כאן מורשת","https://25483.live.streamtheworld.com/KAN_MORESHET.mp3?dist=coolsite"),
    "kanKolHamusica":new RadioToHebrewNames("כאן קול המוזיקה","https://27873.live.streamtheworld.com/KAN_KOL_HAMUSICA.mp3?dist=coolsite"),
    "kanReka":new RadioToHebrewNames("כאן רקע","https://25483.live.streamtheworld.com/KAN_REKA.mp3?dist=coolsite"),
    "kanTarbut":new RadioToHebrewNames("כאן תרבות","https://25483.live.streamtheworld.com/KAN_REKA.mp3?dist=coolsite"),
    "eco99FM":new RadioToHebrewNames("אקו 99fm" , "https://eco01.livecdn.biz/ecolive/99fm_aac/icecast.audio"),
    "kolUniversity":new RadioToHebrewNames("קול האוניברסיטה","https://1062onair.runi.ac.il/idc123.mp3"),
    "bgu":new RadioToHebrewNames("אוניברסיטת בן-גוריון","https://bguradio.co/listen/bguradio/radio.mp3"),
    "103FM":new RadioToHebrewNames("רדיו 103FM", "https://cdn.cybercdn.live/103FM/Live/icecast.audio"),
    "tzafon104.5":new RadioToHebrewNames("צפון 104.5","https://cdn.cybercdn.live/Tzafon_NonStop/Live_Audio/icecast.audio"),
    "ivriShesh":new RadioToHebrewNames("עברי שש","https://streaming.radio.co/sa06221901/listen"),
    "radius":new RadioToHebrewNames("רדיו רדיוס","https://cdn.cybercdn.live/Radios_100FM/Audio/icecast.audio"),
    "r90":new RadioToHebrewNames("רדיו 90","https://cdn.cybercdn.live/Emtza_Haderech/Live_Audio/icecast.audio"),
    "telAviv102FM":new RadioToHebrewNames("רדיו תל אביב ","https://102.livecdn.biz/102fm_mp3"),
    "shiridikaon":new RadioToHebrewNames("שירי דיכאון","https://diki.mediacast.co.il/diki"),
    "shiriAhava":new RadioToHebrewNames("שירי אהבה","https://liveradio.co.il/radiolove"),
    "kezevMizrahi":new RadioToHebrewNames("קצב מזרחי","https://liveradio.co.il/radio_i"),
    "kezevYamTichoni":new RadioToHebrewNames("קצב ים-תיכוני","https://liveradio.co.il:1040/;"),
    "kolRamatHasharon":new RadioToHebrewNames("קול רמת השרון","https://radio.streamgates.net/stream/1036"),
    "kolBarama":new RadioToHebrewNames("קול ברמה","https://cdn.cybercdn.live/Kol_Barama/Live_Audio/icecast.audio"),
    "kolHagolan":new RadioToHebrewNames("קול הגולן","https://liveradio.co.il/kolhagolan"),
    "kolHagalilTop":new RadioToHebrewNames("קול הגליל","https://radio.streamgates.net/stream/galil"),
    "kolHayamHaadom":new RadioToHebrewNames("קול הים התיכון","https://cdn.cybercdn.live/Eilat_Radio/Live/icecast.audio"),
    "kolHaKinneret":new RadioToHebrewNames("קול הכינרת","https://radio.streamgates.net/stream/kinneret"),
    "kolHamizrah":new RadioToHebrewNames("קול המזרח","https://mzr.mediacast.co.il/mzradio"),
    "kolHamerkaz":new RadioToHebrewNames("קול המרכז","https://liveradio.co.il:9050/;"),
    "kolHashfela":new RadioToHebrewNames("קול השפלה","https://radio.streamgates.net/stream/1036kh"),
    "kolHai":new RadioToHebrewNames("קול חי","https://live.kcm.fm/live-new"),
    "kolYezreel":new RadioToHebrewNames("קול יזרעאל","https://radio.streamgates.net/stream/yezreel"), 
    "kolNatanya":new RadioToHebrewNames("קול נתניה","https://radio.streamgates.net/stream/netanya"),
    "kolHanachal":new RadioToHebrewNames("קול הנחל","https://cast.ereznet.co.il/radio/8070/radio.mp3"),
    "kolRega":new RadioToHebrewNames("קול רגע","https://cdn.cybercdn.live/Kol_Rega/Live_Audio/icecast.audio"),
    "sol":new RadioToHebrewNames("רדיו סול","https://radio.streamgates.net/stream/sol"),
    "sahar":new RadioToHebrewNames("רדיו סהר","https://live.ecast.co.il/stream/sahar"),
    "neto":new RadioToHebrewNames("רדיו נטו","https://live.ecast.co.il/stream/radioneto1"),
    "noshmimMizrahit":new RadioToHebrewNames("נושמים מזרחית","https://mzr.mediacast.co.il/mzradio"),
    "nostalgiaIsraeli":new RadioToHebrewNames("נוסטלגיה ישראלי","http://194.213.4.197:8000/;stream/1"),
    "martitMeitarBalev":new RadioToHebrewNames("רדיו מרטיט מיתר בלב","https://liveradio.co.il/wet"),
    "mizrahit":new RadioToHebrewNames("רדיו מזרחית","https://mzr.mediacast.co.il/mzradio"),
    "mahotHachaim":new RadioToHebrewNames("רדיו מהות-החיים","https://eol-live.cdnwiz.com/eol/eolsite/icecast.audio"),
    "levHamedina":new RadioToHebrewNames("רדיו לב המדינה","https://cdn.cybercdn.live/Lev_Hamedina/Audio/icecast.audio"),
    "KaholYavan":new RadioToHebrewNames("רדיו כחול-יוון","https://icecast.live/proxy/livegreece/livegreece"),
    "jerusalem":new RadioToHebrewNames("רדיו ירושלים","https://cdn.cybercdn.live/JerusalemRadio/Live/icecast.audio"),
    "101.5":new RadioToHebrewNames("רדיו 101.5","https://cdn.cybercdn.live/Hatahana_1015/Live_Audio/icecast.audio"),
    "hakatze":new RadioToHebrewNames("רדיו הקצה","https://kzradio.mediacast.co.il/kzradio_live/kzradio/icecast.audio"),
    "galiIsrael":new RadioToHebrewNames("רדיו גלי-ישראל","https://cdn.cybercdn.live/Galei_Israel/Live/icecast.audio"),
    "oranim":new RadioToHebrewNames("רדיו אורנים","https://radio.streamgates.net/stream/oranim")
}




//for (let stationId in radioMap) {
//    let radioButtons = document.getElementsByClassName(stationId) as HTMLCollectionOf<HTMLButtonElement>;
//    let audioStation = new Audio(radioMap[stationId].link);
//    radioButtons[0].addEventListener('click', () => {
//        if (!isRadio) {
//            audioStation.play();
//            isRadio = true;
//        } else {
//            audioStation.pause();
//            isRadio = false;
//        }
//    });
//    radioButtons[1].addEventListener('click', () => {
//        if (!isRadio) {
//            audioStation = new Audio(radioMap[stationId].link);
//            audioStation.play();
//            isRadio = true;
//        }
//    });    
//}
const main = document.querySelector(".main");
for (const radioName in radioMap){

    const imgSource = `Photos/${radioName}.png`;

    const element = document.createElement('img');
    element.src = imgSource;
    
    element.classList.add('pictures');

    element.addEventListener('click', () => {
        const stationId = radioName;
        const audioStation = new Audio(radioMap[stationId].link);
        if (!isRadio) {
            audioStation.play();
            isRadio = true;
        } else {
            audioStation.pause();
            isRadio = false;
        }
    });

    const elementDiscription = document.createElement('figcaption');
    elementDiscription.classList.add('discription');
    elementDiscription.appendChild(document.createTextNode(radioMap[radioName].hebrewName));
    
    const figure = document.createElement('figure');

    figure.appendChild(element);
    figure.appendChild(elementDiscription);
    main?.appendChild(figure);
}