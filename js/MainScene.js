import CharacterMng from "./CharacterMng.js";
import player from "./Player.js";


export default class MainScene extends Phaser.Scene{

    constructor(){
        super({ key: 'mainScene' });

        // 배경 이미지를 전역 변수로 선언
        this.bgskySprites = [];
        this.characterMoveCnt = 0;

    }

    preload(){
        CharacterMng.preload(this);

        //이미지
        this.load.image("back", "assets/images/연못 이미지.png");
        this.load.image("life", "assets/images/하트.png.png");
        this.load.image("bgsky", "assets/images/bgSky.png");

        //사운드
        this.load.audio("eatBug", 'sound/eatBug.wav');
        this.load.audio("frogArray", 'sound/frogArray.wav');
        this.load.audio("frogClick", 'sound/frogClick.wav');
        this.load.audio("frogFall", 'sound/frogFall.wav');
        this.load.audio("gameOver", 'sound/gameOver.wav');

        //폰트
        this.load.bitmapFont('myFont', 'font/myfont.ttf');
    }

    create(){
        this.bg2 = this.add.sprite(360,640,'back').setDepth(-2); // 메인 배경
        this.bgsky1 = this.add.sprite(360, 1920, 'bgsky').setDepth(-2); //하늘 배경
        this.bgsky3 = this.add.sprite(360, -640, 'bgsky').setDepth(-2); //하늘 배경

        this.bgskySprites.push(this.bgsky1);
        this.bgskySprites.push(this.bg2);
        this.bgskySprites.push(this.bgsky3);


        this.bgBottom = this.bgsky1;
        this.bgTop = this.bgsky3;

        this.life3 = this.add.sprite(670,40,'life'); //목숨
        this.life2 = this.add.sprite(600,40,'life');
        this.life1 = this.add.sprite(530,40,'life');


        //폰트스타일
        const fontStyle = {
            font: '60px myfont',
            fill: 'green',
            align: 'center',
            stroke: 'green', // 두껍게 효과를 주기 위해 stroke 속성 추가
            strokeThickness: 2.5,
            // letterSpacing: 100, //폰트 간격 늘리기.
        };
    
        // 목숨 이미지 위치 화면에 고정
        this.life1.setScrollFactor(0);
        this.life2.setScrollFactor(0);
        this.life3.setScrollFactor(0);

        //점수
        this.score = 0; 
        this.scoreText = this.add.text(20, 5, '0',fontStyle);

        this.characterMng = new CharacterMng(  
        {
            scene: this
        });

        this.characterMng.Init();

        // 화면 클릭하면 pointerdownF 함수 호출
        this.input.on('pointerdown', this.pointerdownF, this);


        this.anims.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "jumpfrog_idle",
        function()
        {
           console.log("jumpfrog_idle end");
        }, this.scene);

    }

    // 화면 클릭하면 호출되는 pointerdownF 함수
    pointerdownF() {
        // 개구리 클릭 음악 재생 
        this.frogClick = this.sound.add("frogClick");
        this.frogClick.play();

        // characterMng.js로 이동.
        this.characterMng.changeSleepFrog();
        
    }

    update(){
        this.characterMng.update();
    }

}