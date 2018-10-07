controlRerquest("data/control.smr", main)

function main() {
    window.scrollTo(0, 0);
    window.sbig = false;
    var notplaypaysound = false;
    var jacflag;
    var kokutid;
    var kokuti;
    var lastControl;
    var rushcoin = 0;
    window.rt = {
        mode: null,
        game: 250
    }
    slotmodule.on("allreelstop", function(e) {
        if (e.hits != 0) {
            if (e.hityaku.length == 0)
                return
            var matrix = e.hityaku[0].matrix;
            var count = 0;
            slotmodule.once("bet", function() {
                slotmodule.clearFlashReservation()
            })
            if (e.hityaku[0].name.indexOf("代替リプレイ") != -1 ||
                e.hityaku[0].name.indexOf("リーチ目リプレイ") != -1 ||
                e.hityaku[0].name.indexOf("1枚役") != -1) {
                notplaypaysound = true;
            } else {
                notplaypaysound = false;
                slotmodule.setFlash(null, 0, function(e) {
                    slotmodule.setFlash(flashdata.default, 20)
                    slotmodule.setFlash(replaceMatrix(flashdata.default, matrix, colordata.LINE_F, null), 20, arguments.callee)
                })
            }
        }
        if (e.hits == 0 && jacflag && gamemode == "big") {
            slotmodule.setFlash(flashdata.syoto)
            slotmodule.once('bet', function() {
                slotmodule.clearFlashReservation()
            })
        }
        if (gamemode == "big") {
            changeBonusSeg()
        }

        if (gamemode == "jac" || gamemode == "reg") {
            bonusdata.jacgamecount--;
            changeBonusSeg()
        }

        replayflag = false;
        var nexter = true;

        e.hityaku.forEach(function(d) {
            var matrix = d.matrix;
            switch (gamemode) {
                case 'normal':
                    switch (d.name) {
                        case 'BIG':
                            setGamemode('REG');
                            bonusdata = {
                                bonusget: 195,
                                geted: 0
                            }
                            bonusflag = null;
                            changeBonusSeg()
                            clearLamp()
                            jacflag = false
                            kokuti = false;
                            kokutid = false;
                            break;
                        case 'REG':
                            setGamemode('REG');
                            bonusdata = {
                                bonusget: 90,
                                geted: 0
                            }
                            bonusflag = null;
                            changeBonusSeg()
                            clearLamp()
                            jacflag = false
                            kokuti = false;
                            kokutid = false;
                            break
                        case 'MB':
                            if(!kokutid){
                                $('#ebiwrap').addClass('display');
                                $('#ebi').addClass('display');
                                setTimeout(() => {
                                    $('#ebiwrap').removeClass('display');
                                    $('#ebi').removeClass('display');
                                }, 1000)
                                sounder.playSound('kokuti');
                                kokutid = true;
                            }
                            kokuti = false;
                            setGamemode('REG');
                            bonusdata = {
                                bonusget: 15,
                                geted: 0
                            }
                            bonusflag = null;
                            changeBonusSeg()
                            clearLamp()
                            jacflag = false
                            kokuti = false;
                            sounder.playSound('mb');
                            break
                        case '転落BB1':
                        case '転落BB2':
                            sounder.stopSound("bgm");
                            setGamemode('BIG');
                            bonusdata = {
                                bonusget: 252,
                                geted: 0
                            }
                            bonusflag = null;
                            changeBonusSeg()
                            clearLamp()
                            jacflag = false
                            kokuti = false;
                            kokutid = false;
                            $("#effect").show();
                            break
                        case "チェリー":
                            matrix = matrix.map((arr) => {
                                arr[1] = 0;
                                arr[2] = 0;
                                return arr;
                            })
                            slotmodule.setFlash(null, 0, function(e) {
                                slotmodule.setFlash(flashdata.default, 20)
                                slotmodule.setFlash(replaceMatrix(flashdata.default, matrix, colordata.LINE_F, null), 20, arguments.callee)
                            })
                            break
                        case "リプレイ":
                            replayflag = true;
                            break;
                        case '1枚役':
                            var t = 20;
                            slotmodule.setFlash(null, 0, function(e) {
                                if (!t--) {
                                    return
                                }
                                matrix = matrix.map((arr) => {
                                    arr[0] = rand(2);
                                    arr[1] = rand(2);
                                    arr[2] = rand(2);
                                    return arr;
                                })
                                // slotmodule.setFlash(flashdata.default, 20)
                                slotmodule.setFlash(replaceMatrix(flashdata.default, matrix, colordata.LINE_F, null), 2, arguments.callee)
                            })
                            break;
                        case '同色REG':
                        case '異色REG':
                            sounder.stopSound("bgm");
                            sounder.playSound('eight',true)
                            setGamemode('JAC');
                            bonusdata = {
                                mode: d.name,
                                jacgamecount: d.name === '同色REG' ? 10 : 1,
                                jacgetcount: 1
                            }
                            bonusflag = null;
                            changeBonusSeg()
                            clearLamp()
                            jacflag = false
                            kokuti = false;
                            kokutid = false;
                            $("#effect").hide();
                            sounder.playSound('eightStart')
                            break
                    }
                    break;
                case 'big':
                    switch (d.name) {
                        case '同色REG':
                        case '異色REG':
                            sounder.stopSound("bgm");
                            sounder.playSound('eight',true)
                            setGamemode('JAC');
                            bonusdata = {
                                mode: d.name,
                                jacgamecount: d.name === '同色REG' ? 10 : 1,
                                jacgetcount: 1
                            }
                            bonusflag = null;
                            changeBonusSeg()
                            clearLamp()
                            jacflag = false
                            kokuti = false;
                            kokutid = false;
                            $("#effect").hide();
                            sounder.playSound('eightStart')
                            break
                        case "チェリー":
                            matrix = matrix.map((arr) => {
                                arr[1] = 0;
                                arr[2] = 0;
                                return arr;
                            })
                            slotmodule.setFlash(null, 0, function(e) {
                                slotmodule.setFlash(flashdata.default, 20)
                                slotmodule.setFlash(replaceMatrix(flashdata.default, matrix, colordata.LINE_F, null), 20, arguments.callee)
                            })
                            break
                        case '1枚役':
                            var t = 20;
                            slotmodule.setFlash(null, 0, function(e) {
                                if (!t--) {
                                    return
                                }
                                matrix = matrix.map((arr) => {
                                    arr[0] = rand(2);
                                    arr[1] = rand(2);
                                    arr[2] = rand(2);
                                    return arr;
                                })
                                // slotmodule.setFlash(flashdata.default, 20)
                                slotmodule.setFlash(replaceMatrix(flashdata.default, matrix, colordata.LINE_F, null), 2, arguments.callee)
                            })
                            break;
                        case "リプレイ":
                            replayflag = true;
                            break;
                    }
                    break
                case 'reg':
                case 'jac':
                    if (d.name == 'リプレイ') {
                        replayflag = true;
                    }else{
						bonusdata.jacgetcount--;
                    }
                    changeBonusSeg()
                    // bonusdata.jacgamecount--;
            }
        })
        if (gamemode != 'normal' && bonusdata.geted + e.pay >= bonusdata.bonusget) {
            // sounder.stopSound("bgm")
            segments.effectseg.reset();
            if(gamemode == 'big'){
                slotmodule.freeze();
                Typewriter('エビゾリラッシュ<br>確定！',{
                    speed:150,
                    delay:5000,
                }).change((t)=>{
                    t!="\n"&&sounder.playSound('type');
                }).title(()=>{
                    sounder.playSound('title');
                }).finish((e)=>{
                    e.parentNode.removeChild(e);
                    setTimeout(()=>{
                        slotmodule.resume();
                    },1000)
                });
            }
            if(gamemode == 'big'){
				rushcoin = 0;
				slotmodule.once('bet',()=>{
					$('#panel').attr({src:`./img/ebirush.png`});
					$('#effect').hide();
					sounder.playSound('rushstart',false,()=>{
						sounder.playSound('RUSHBGM',true)
					})
					setTimeout(()=>{
						$('#panel').attr({src:`./img/uppanel.png`});
						$('#effect').show();
					},2000)
				})
            }
            setGamemode('normal');
        }
        if (gamemode == 'jac') {
            if (bonusdata.jacgamecount <= 0 || bonusdata.jacgetcount <= 0) {
	            setGamemode('normal');
	            sounder.stopSound('bgm')
	            if(bonusdata.jacgetcount <= 0){
					rushcoin = 0;
					slotmodule.once('bet',()=>{
						$('#panel').attr({src:`./img/ebirush.png`});
						$('#effect').hide();
						sounder.playSound('rushstart',false,()=>{
							sounder.playSound('RUSHBGM',true)
						})
						setTimeout(()=>{
							$('#panel').attr({src:`./img/uppanel.png`});
							$('#effect').show();
						},2000)
					})
				}
            }
        }
        if (nexter) {
            e.stopend()
        }
    })


    slotmodule.on("bet", function(e) {
        sounder.playSound("3bet")
        if ("coin" in e) {
            (function(e) {
                var thisf = arguments.callee;
                if (e.coin > 0) {
                    coin--;
                    e.coin--;
                    incoin++;
                    rushcoin --;
                    changeCredit(-1);
                    setTimeout(function() {
                        thisf(e)
                    }, 100)
                } else {
                    // if (kokuti) {
                    //     $('#ebiwrap').addClass('display');
                    //     $('#ebi').addClass('display');
                    //     slotmodule.freeze();
                    //     sounder.playSound('kokuti', false, () => {
                    //         $('#ebiwrap').removeClass('display');
                    //         $('#ebi').removeClass('display');
                    //         slotmodule.resume();
                    //     })
                    //     kokutid = true;
                    //     kokuti = false;
                    // }
                    e.betend();
                }
            })(e)
        }
        if (gamemode == "jac") {
            segments.payseg.setSegments(bonusdata.jacgamecount)
        } else {
            segments.payseg.reset();
        }
    })

    slotmodule.on("pay", function(e) {
        var pays = e.hityaku.pay;
        var arg = arguments;
        if (gamemode != "normal") {
            changeBonusSeg();
        }
        if (!("paycount" in e)) {
            e.paycount = 0
            e.se = "pay";
            if (gamemode != "normal" && pays) {
                e.se = "cherry"
                if (pays == 15) {
                    e.se = "bigpay"
                }
            }
            if (pays <= 4 && pays) e.se = "cherry";
            if (pays >= 14) e.se = "bigpay"
            if (gamemode === 'reg' || (pays == 15 && gamemode == 'normal')) e.se = 'mbpay'
            if (!replayflag && !notplaypaysound) {
                if(e.se == 'mbpay'){
                    sounder.playSound(e.se,true,()=>{},0,0.1);
                }else{
                    sounder.playSound(e.se, e.se != "cherry");
                }
            }
        }
        if (pays == 0) {
            if (replayflag && !notplaypaysound && e.hityaku.hityaku[0].name != "チェリー") {
                sounder.playSound("replay", false, function() {
                    e.replay();
                    slotmodule.emit("bet", e.playingStatus);
                });
            } else {
                if (replayflag) {
                    e.replay();
                    slotmodule.clearFlashReservation()
                } else {
                    e.payend()
                }
                sounder.stopSound(e.se)
            }
        } else {
            e.hityaku.pay--;
            coin++;
            e.paycount++;
            outcoin++;
            if (gamemode != "normal" && !bonusflag) {
                bonusdata.geted++;
            }
            if (e.se === 'mbpay'){
				rushcoin ++;
				showRushCoin();
            }
            changeCredit(1);
            segments.payseg.setSegments(e.paycount)
            setTimeout(function() {
                arg.callee(e)
            }, 60)
        }
    })

    var jacflag = false;

    slotmodule.on("lot", function(e) {
        var ret = -1;
        var lot;
        switch (gamemode) {
            case "normal":
                if (slotmodule.playControlData.betcoin === 2) {
                    ret = '2枚がけBIG';
                    break
                }
                lot = normalLotter.lot().name
                lot = window.power || lot;
                window.power = undefined
                switch (lot) {
                    case "リプレイ":
                        ret = 'リプレイ'
                        break;
                    case "ベル":
                        ret = "ベル";
                        break
                    case "チェリー":
                        ret = lot;
                        break;
                    case '1枚役':
                        switch (rand(8)) {
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                                ret = '1枚役1';
                                break
                            case 4:
                            case 5:
                                ret = '1枚役2';
                                break
                            case 6:
                            case 7:
                                ret = '1枚役3';
                                break
                        }
                        break
                    case '転落BB':
                    case '異色REG':
                    case '同色REG':
                        if (!bonusflag) {
                            bonusflag = lot;
                            ret = 'リプレイ';
                        } else {
                            ret = bonusflag;
                        }
                        break
                    case 'BIG':
                    case 'REG':
                        if (!bonusflag) {
                            bonusflag = lot;
                            ret = [
                                'リプレイ',
                                'チェリー',
                                lot
                            ][rand(3)]
                        } else {
                            ret = bonusflag;
                        }
                        break;
                    case 'MB':
                        if (!bonusflag) {
                            ret = bonusflag = lot;
                        } else {
                            ret = bonusflag;
                        }
                        break;
                    default:
                        ret = "はずれ"
                        switch (bonusflag) {
                            case null:
                                switch (rt.mode) {
                                    case 'リプレイ高確率':
                                        ret = 'リプレイ'
                                }
                                break
                            default:
                                ret = bonusflag;
                                if (rand(3)) {
                                    ret = 'リプレイ'
                                }
                                break
                        }
                }
                if (slotmodule.playControlData.betcoin == 2) {
                    ret = '2枚がけBIG'
                }
                break;
            case "big":
                lot = normalLotter.lot().name
                lot = window.power || lot;
                window.power = undefined
                switch (lot) {
                    case "リプレイ":
                        ret = 'リプレイ';
                        break
                    case "ベル":
                        ret = "ベル";
                        break
                    case "チェリー":
                        ret = lot;
                        break;
                    case '1枚役':
                        switch (rand(8)) {
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                                ret = '1枚役1';
                                break
                            case 4:
                            case 5:
                                ret = '1枚役2';
                                break
                            case 6:
                            case 7:
                                ret = '1枚役3';
                                break
                        }
                        break
                    case '転落BB':
                        ret = 'リプレイ';
                        break
                    case '異色REG':
                    case '同色REG':
                        if (!bonusflag) {
                            bonusflag = lot;
                            ret = [
                                'リプレイ',
                                lot
                            ][rand(2)]
                        } else {
                            ret = bonusflag;
                        }
                        break;
                    case 'MB':
                    default:
                        ret = "はずれ"
                        switch (bonusflag) {
                            case null:
                                break
                            default:
                                ret = bonusflag;
                                if (!rand(3)) {
                                    ret = 'リプレイ'
                                }
                                break
                        }
                }
                break;
            case "reg":
                ret = 'MB小役'
                break
            case "jac":
                if (rand(100) < 8) {
                    ret = '2枚がけ小役'
                } else {
                    ret = '2枚がけリプレイ'
                }
                break;
        }
        effect(ret, lot);
        lastControl = ret;
        console.log({ret,lot})
        return ret;
    })

    slotmodule.on("reelstop", function() {
        sounder.playSound("stop")
    })

    $("#saveimg").click(function() {
        SaveDataToImage();
    })

    $("#cleardata").click(function() {
        if (confirm("データをリセットします。よろしいですか？")) {
            ClearData();
        }
    })

    $("#loadimg").click(function() {
        $("#dummyfiler").click();
    })

    $("#dummyfiler").change(function(e) {

        var file = this.files[0];

        var image = new Image();
        var reader = new FileReader();
        reader.onload = function(evt) {
            image.onload = function() {
                var canvas = $("<canvas></canvas>")
                canvas[0].width = image.width;
                canvas[0].height = image.height;
                var ctx = canvas[0].getContext('2d');
                ctx.drawImage(image, 0, 0)
                var imageData = ctx.getImageData(0, 0, canvas[0].width, canvas[0].height)
                var loadeddata = SlotCodeOutputer.load(imageData.data);
                if (loadeddata) {
                    parseSaveData(loadeddata)
                    alert("読み込みに成功しました")
                } else {
                    alert("データファイルの読み取りに失敗しました")
                }
            }
            image.src = evt.target.result;
        }
        reader.onerror = function(e) {
            alert("error " + e.target.error.code + " \n\niPhone iOS8 Permissions Error.");
        }
        reader.readAsDataURL(file)
    })

    slotmodule.on("reelstart", function() {
        if (okure) {
            setTimeout(function() {
                sounder.playSound("start")
            }, 300)
        } else {
            if (!muon) {
                sounder.playSound("start")
            }
        }
        okure = false;
        muon = false;
    })
    var okure = false;
    var muon = false;
    var sounder = new Sounder();

    sounder.addFile("sound/stop.wav", "stop").addTag("se");
    sounder.addFile("sound/start.wav", "start").addTag("se");
    sounder.addFile("sound/bet.wav", "3bet").addTag("se");
    sounder.addFile("sound/pay.wav", "pay").addTag("se");
    sounder.addFile("sound/replay.wav", "replay").addTag("se");
    sounder.addFile("sound/BIG1.mp3", "BIG1").addTag("bgm")
    sounder.addFile("sound/rushbgm.mp3", "RUSHBGM").addTag("bgm")
    sounder.addFile("sound/eight.mp3", "eight").addTag("bgm")
    sounder.addFile("sound/title.wav", 'title').addTag("se");
    sounder.addFile("sound/type.mp3", 'type').addTag("se");
    sounder.addFile("sound/yokoku.wav", 'yokoku').addTag("se");
    sounder.addFile("sound/kokuti.mp3", 'kokuti').addTag("se");
    sounder.addFile("sound/syoto.mp3", "syoto").addTag("se");
    sounder.addFile("sound/syotoyokoku.mp3", "syotoyokoku").addTag("se");
    sounder.addFile("sound/cherry.mp3", "cherry").addTag("se");
    sounder.addFile("sound/bigpay.mp3", "bigpay").addTag("se");
    sounder.addFile("sound/bita.mp3", "bita").addTag("se");
    sounder.addFile("sound/mb.mp3", "mb").addTag("se");
    sounder.addFile("sound/mbpay.mp3", "mbpay").addTag("se");
    sounder.addFile("sound/rushstart.mp3", "rushstart").addTag("se");
    sounder.addFile("sound/eight_kokuti.mp3", "eightKokuti").addTag("se");
    sounder.addFile("sound/eight_start.mp3", "eightStart").addTag("se");
    sounder.addFile("sound/step1.mp3", "step1").addTag("se");
    sounder.addFile("sound/step2.mp3", "step2").addTag("se");
    sounder.addFile("sound/step3.mp3", "step3").addTag("se");
    sounder.addFile("sound/kakutei.mp3", "kakutei").addTag("se");

    sounder.setVolume("se", 0.2)
    sounder.setVolume("bgm", 0.1)
    sounder.loadFile(function() {
        window.sounder = sounder
        console.log(sounder)
    })

    var normalLotter = new Lotter(lotdata.normal);
    var bigLotter = new Lotter(lotdata.big);
    var jacLotter = new Lotter(lotdata.jac);


    window.gamemode = "big";
    window.bonusflag = null
    var coin = 0;

    window.bonusdata = {
        bonusget: 252,
        geted: 0
    }
    var replayflag;

    var isCT = false;
    var CTBIG = false;
    var isSBIG;
    var ctdata = {};
    var regstart;

    var afterNotice;
    var bonusSelectIndex;
    var ctNoticed;

    var playcount = 0;
    var allplaycount = 0;

    var incoin = 0;
    var outcoin = 0;

    var bonuscounter = {
        count: {},
        history: []
    };

    slotmodule.on("leveron", function() {

        if (gamemode == "big") {
            playcount++;
            allplaycount++;
        } else {
            if (playcount != 0) {
                bonuscounter.history.push({
                    bonus: gamemode,
                    game: playcount
                })
                playcount = 0;
            }
        }
        changeCredit(0)
    })

    function stringifySaveData() {
        return {
            coin: coin,
            playcontroldata: slotmodule.getPlayControlData(),
            bonuscounter: bonuscounter,
            incoin: incoin,
            outcoin: outcoin,
            playcount: playcount,
            allplaycount: allplaycount,
            name: "ツインセブン",
            id: "twinseven"
        }
    }

    function parseSaveData(data) {
        coin = data.coin;
        // slotmodule.setPlayControlData(data.playcontroldata)
        bonuscounter = data.bonuscounter
        incoin = data.incoin;
        outcoin = data.outcoin;
        playcount = data.playcount;
        allplaycount = data.allplaycount
        changeCredit(0)
    }

    window.SaveDataToImage = function() {
        SlotCodeOutputer.save(stringifySaveData())
    }

    window.SaveData = function() {
        // if (gamemode != "normal") {
        //     return false;
        // }
        var savedata = stringifySaveData()
        localStorage.setItem("savedata", JSON.stringify(savedata))
        return true;
    }

    window.LoadData = function() {
        if (gamemode != "normal" || isCT) {
            return false;
        }
        var savedata = localStorage.getItem("savedata")
        try {
            var data = JSON.parse(savedata)
            parseSaveData(data)
            changeCredit(0)
        } catch (e) {
            return false;
        }
        return true;
    }

    window.ClearData = function() {
        coin = 0;
        bonuscounter = {
            count: {},
            history: []
        };
        incoin = 0;
        outcoin = 0;
        playcount = 0;
        allplaycount = 0;

        SaveData();
        changeCredit(0)
    }


    var setGamemode = function(mode) {
        mode = mode.toLowerCase()
        switch (mode) {
            case 'normal':
                gamemode = 'normal'
                slotmodule.setLotMode(0)
                slotmodule.setMaxbet(3);
                isSBIG = false
                kokutid = false;
                break;
            case 'big':
                gamemode = 'big';
                slotmodule.once("payend", function() {
                    slotmodule.setLotMode(0)
                });
                slotmodule.setMaxbet(3);
                break;
            case 'reg':
                gamemode = 'reg';
                slotmodule.once("payend", function() {
                    slotmodule.setLotMode(2)
                });
                slotmodule.setMaxbet(1);
                break;
            case 'jac':
                gamemode = 'jac';
                slotmodule.once("payend", function() {
                    slotmodule.setLotMode(1)
                });
                slotmodule.setMaxbet(2);
                break;
        }
    }

    var segments = {
        creditseg: segInit("#creditSegment", 2),
        payseg: segInit("#paySegment", 2),
        effectseg: segInit("#effectSegment", 4)
    }

    var credit = 50;
    segments.creditseg.setSegments(50);
    segments.creditseg.setOffColor(80, 30, 30);
    segments.payseg.setOffColor(80, 30, 30);
    segments.creditseg.reset();
    segments.payseg.reset();


    var lotgame;

    function changeCredit(delta) {
        credit += delta;
        if (credit < 0) {
            credit = 0;
        }
        if (credit > 50) {
            credit = 50;
        }
        $(".GameData").text("差枚数:" + coin + "枚  ゲーム数:" + playcount + "G  総ゲーム数:" + allplaycount + "G")
        segments.creditseg.setSegments(credit)
    }

    function changeBonusSeg() {
        if (gamemode != 'normal') {
            var val = bonusdata.bonusget - bonusdata.geted;
            val = val < 0 ? 0 : val;
            segments.effectseg.setSegments("" + val);
        }

    }

    function changeCTGameSeg() {
        segments.effectseg.setOnColor(230, 0, 0);
        segments.effectseg.setSegments(ctdata.ctgame);
    }

    function changeCTCoinSeg() {
        segments.effectseg.setOnColor(50, 100, 50);
        segments.effectseg.setSegments(200 + ctdata.ctstartcoin - coin);
    }

    var LampInterval = {
        right: -1,
        left: -1,
        counter: {
            right: true,
            left: false
        }
    }

    function setLamp(flags, timer) {
        flags.forEach(function(f, i) {
            if (!f) {
                return
            }
            LampInterval[["left", "right"][i]] = setInterval(function() {
                if (LampInterval.counter[["left", "right"][i]]) {
                    $("#" + ["left", "right"][i] + "neko").css({
                        filter: "brightness(200%)"
                    })
                } else {
                    $("#" + ["left", "right"][i] + "neko").css({
                        filter: "brightness(100%)"
                    })
                }
                LampInterval.counter[["left", "right"][i]] = !LampInterval.counter[["left", "right"][i]];
            }, timer)
        })
    }

    function clearLamp() {
        clearInterval(LampInterval.right);
        clearInterval(LampInterval.left);
        ["left", "right"].forEach(function(i) {
            $("#" + i + "neko").css({
                filter: "brightness(100%)"
            })
        })

    }

    function effect(lot, orig) {
        switch (gamemode) {
            case 'normal':
                if (kokutid) return
                if (slotmodule.playControlData.betcoin === 2) return;
                var plot = lot;
                if (lot == 'REG' || bonusflag) { plot = 'BIG' }
                var eforig = /BIG|REG|MB/.test(lot) ? 'BIG' : orig;
                var effect = getEffect[eforig] && getEffect[eforig]();
                if (!effect || rand(4)) {
                    if(lot === 'MB'){
                        setTimeout(()=>{
                            if(!kokutid){
                                sounder.playSound('kokuti');
                                $('#ebiwrap').addClass('display');
                                $('#ebi').addClass('display');
                                setTimeout(() => {
                                    $('#ebiwrap').removeClass('display');
                                    $('#ebi').removeClass('display');
                                }, 1000)
                                kokutid = true;
                            }
                        },~~(Math.random()*3000))
                    }
                }
                if(effect){
					sounder.playSound('yokoku');
                }
                break
            case 'big':
                if (kokutid) return
                var plot = lot;
                if (lot == 'REG' || bonusflag) { plot = 'BIG' }
                var eforig = /色REG/.test(lot) ? 'BIG' : orig;
                var effect = getEffect[eforig] && getEffect[eforig]();
                if (!effect) return;
                sounder.playSound('yokoku');
                if(/色REG/.test(lot)){
                    kokutid = true;
                    slotmodule.once('bet',()=>{
						if(gamemode !== 'big') return;
						$('#panel').attr({src:`./img/eight_${bonusflag === '異色REG' ? 'wait1' : 'wait2'}.png`});
						sounder.playSound('eightKokuti');
						$('#effect').hide();
                    })
                }
                break
            case 'jac':
				var table = {
					'2枚がけリプレイ':[70,29,1],
					'2枚がけ小役':[20,60,20]
				}[lot];
				var r = rand(100);
				var idx = table.findIndex(d=>{
					r -= d;
					if(r<0){return true}
				});
				slotmodule.freeze();
				(async function(){
					for(var i=0;i<=idx;i++){
						sounder.playSound('step'+(i+1));
						var src = ['eight_blue','eight_green','eight_red'][i];
						$('#panel').attr({src:`./img/${src}.png`});
						await wait(1000);
					}
					$('#ebi').addClass('display');
					slotmodule.resume();
				})()
				if(lot == '2枚がけ小役'){
					slotmodule.once('reelstop',function kakuteion(e){
						// console.log(e)
						if(e.reel != 0){
							return slotmodule.once('stop',kakuteion);
						}
						sounder.playSound('kakutei');
						sounder.playSound('step3');
					})
				}
				slotmodule.once('allreelstop',()=>{
					$('#panel').attr({src:`./img/uppanel.png`})
					$('#ebi').removeClass('display');
				})
                break
            case 'reg':
                break
        }
    }
	function showRushCoin(){
		$('#rushinfo').text(rushcoin);
		slotmodule.once('bet',()=>{
			$('#rushinfo').text('');
		})
	}


    $(window).bind("unload", function() {
        SaveData();
    });

    LoadData();
    changeBonusSeg();
}


function and() {
    return Array.prototype.slice.call(arguments).every(function(f) {
        return f
    })
}

function or() {
    return Array.prototype.slice.call(arguments).some(function(f) {
        return f
    })
}

function rand(m) {
    return Math.floor(Math.random() * m);
}

function replaceMatrix(base, matrix, front, back) {
    var out = JSON.parse(JSON.stringify(base));
    matrix.forEach(function(m, i) {
        m.forEach(function(g, j) {
            if (g == 1) {
                front && (out.front[i][j] = front);
                back && (out.back[i][j] = back);
            }
        })
    })
    return out
}

function flipMatrix(base) {
    var out = JSON.parse(JSON.stringify(base));
    return out.map(function(m) {
        return m.map(function(p) {
            return 1 - p;
        })
    })
}

function segInit(selector, size) {
    var cangvas = $(selector)[0];
    var sc = new SegmentControler(cangvas, size, 0, -3, 79, 46);
    sc.setOffColor(120, 120, 120)
    sc.setOnColor(230, 0, 0)
    sc.reset();
    return sc;
}

async function wait(time){
	await new Promise(r=>setTimeout(r,time));
}