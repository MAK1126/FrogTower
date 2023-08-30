import CharacterMng from "./CharacterMng.js";
import player from "./Player.js";
import Loading from "./Loading.js";


export default class MainScene extends Phaser.Scene{

    constructor(){
        super({ key: 'mainScene' });

        // 배경 이미지를 전역 변수로 선언
        this.bgskySprites = [];
        this.characterMoveCnt = 0;
        this.isSoundPlaying;
        this.bgmSound;

        
        
    }
    init(message){

        console.log("init message : "+ message);
        if(message == 100)
        {
            this.isSoundPlaying= false;
        }
        else
        {
            this.isSoundPlaying= true;
        }
    }
    preload(){
        CharacterMng.preload(this);
        // player.preload(this);

        //이미지
        this.load.image("back", "assets/images/연못 이미지.png");
        this.load.image("life", "assets/images/하트.png.png");
        this.load.image("bgsky", "assets/images/bgSky.png");
        this.load.image("barCase", "assets/images/bar_case.png");
        this.load.image("barBg", "assets/images/bar_bg.png");
        this.load.image("barGG", "assets/images/bar_gg.png");
       
        //폰트
        this.load.bitmapFont('myFont', 'font/myfont.ttf');

        //사운드
        this.load.audio("eatBug", 'assets/sounds/eatBug.wav');
        this.load.audio("frogArray", 'assets/sounds/frogArray.wav');
        this.load.audio("frogClick", 'assets/sounds/frogClick.wav');
        this.load.audio("frogFall", 'assets/sounds/frogFall.wav');
        this.load.audio("gameOver", 'assets/sounds/gameOver.wav');

    }

    create(){
        // 전역 변수에 사운드 객체들 할당
        this.eatBugSound = this.sound.add("eatBug");
        this.frogArraySound = this.sound.add("frogArray");
        this.frogClickSound = this.sound.add("frogClick");
        this.frogFallSound = this.sound.add("frogFall");
        this.gameOverSound = this.sound.add("gameOver");

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

        // 타임바 이미지 / Container 생성  
        this.barContainer = this.add.container(675, 700);
        this.barBg = this.add.sprite(0, 0, 'barBg').setDepth(1);
        this.barGG = this.add.sprite(0, 320, 'barGG').setDepth(2);  // -- 컨테이너 위치(675, 700) 기준에서 위치 조정 
        this.barCase = this.add.sprite(0, 0, 'barCase').setDepth(3);

        this.barContainer.add(this.barBg);
        this.barContainer.add(this.barGG);
        this.barContainer.add(this.barCase);
        this.barContainer.setScale(1, 0.7); 

        // 타임바 이미지 위치 화면에 고정
        this.barCase.setScrollFactor(0);
        this.barBg.setScrollFactor(0);
        this.barGG.setScrollFactor(0);


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

        // 게임 시작 시 프로그레스 바를 보여주고 타이머를 시작 !!!
        this.startProgressBar(10); //10초간

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
        
        // 사운드가 켜져 있는 경우에만 개구리 클릭 음악을 재생합니다.
        if (this.isSoundPlaying) {
            this.frogClick = this.sound.add("frogClick");
            this.frogClick.play();
        }

        // 클릭 시 프로그레스 바 멈추기
        this.isPaused = true;

        // characterMng.js로 이동.
        this.characterMng.changeSleepFrog();
    }

    //타임 게이지 바
    startProgressBar(timeInSeconds) {
        // 프로그레스 바를 처음에 100%로 설정
        this.barGG.displayHeight = this.barGG.height;
        this.barGG.setOrigin(0.5, 1); // 프로그레스 바의 정렬을 설정

        const totalHeight = this.barGG.height;
        const decreasePerSecond = totalHeight / (timeInSeconds * 60);

        this.progressBarTimer = this.time.addEvent({
            delay: 16.67, // 1초를 60프레임으로 나눈 값, 각 프레임 간격
            repeat: timeInSeconds * 60, // 프레임 수 계산
            callback: () => {
                if (!this.isPaused){
                this.barGG.displayHeight -= decreasePerSecond;
                if(this.barGG.displayHeight < 2)
                    {
                        this.barGG.displayHeight = 0; // 프로그레스 바가 0%로 설정됩니다.

                        this.handleProgressLife();

                    }
                }
            },
        });
    }

    handleProgressLife() {

        if ( this.barGG.displayHeight == 0 && !this.isLifeCnt1 && this.life1.visible) {
            this.life1.setVisible(false); // life1 이미지 숨김
            this.barGG.displayHeight = this.barGG.height; // 프로그레스 바 초기화
            this.progressBarTimer.remove(); // 타이머 제거
            this.startProgressBar(10); // 프로그레스 바 시작
    
            this.isLifeCnt1 = true; // 첫 번째 조건이 충족되었을 때 isLifeCnt1 true로 설정
            this.characterMng.player.isConditionMet1 = true;
    
        } 
        if (this.barGG.displayHeight == 0 && this.isLifeCnt1 && !this.isLifeCnt2 && this.life2.visible) {
            this.life2.setVisible(false); // life2 이미지 숨김
            this.barGG.displayHeight = this.barGG.height;
            this.progressBarTimer.remove();
            this.startProgressBar(10);
    
            this.isLifeCnt2 = true; // 조건이 충족되었을 때 isLifeCnt1 true로 설정
            this.characterMng.player.isConditionMet2 = true;
    
        } 
        if(this.barGG.displayHeight == 0 && this.isLifeCnt2 && this.life3.visible) {
            this.life3.setVisible(false);
            this.characterMng.player.Gameover(); // 게임 오버 처리
            this.progressBarTimer.remove();
        }

    }

    update(){
        this.characterMng.update();
    }

}