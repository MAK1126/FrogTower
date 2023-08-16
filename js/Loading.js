import MainScene from "./MainScene.js";

export default class Loading extends Phaser.Scene{
    constructor(){
        super("loading");

        // 전역 변수로 사용할 사운드 객체들
        this.bgmSound = null;
        this.eatBugSound = null;
        this.frogArraySound = null;
        this.frogClickSound = null;
        this.frogFallSound = null;
        this.gameOverSound = null;

        this.isSoundPlaying = false;

    }
    preload(){
        //이미지
        this.load.image("background","assets/images/타이틀전체배경.png");
        this.load.image("button", "assets/images/플레이 버튼.png");
        this.load.image("soundon", "assets/images/사운드 켜짐.png");
        this.load.image("soundoff", "assets/images/사운드 꺼짐.png");
        this.load.image("help", "assets/images/도움말 버튼.png");
        //도움말 이미지
        this.load.image("xbutton", "assets/images/xbutton.png");
        this.load.image("control", "assets/images/control.png");
  
        //사운드
        this.load.audio("bgm", 'assets/sounds/bgm.wav');
        
    }
    create(){

        const b1 = this.add.sprite(360,640,'background');
        const b2 = this.add.sprite(360,1100,'button');
        const s1 = this.add.sprite(670,50,'soundon');
        const help = this.add.sprite(585,50,'help');

        // 도움말 이미지가 보이는지 여부를 나타내는 변수
        this.isHelpVisible = false; 
        let con, xb, s2; // 도움말 이미지와 버튼


        // 전역 변수에 사운드 객체들 할당
        this.bgmSound = this.sound.add("bgm", { loop: true });
     

        // 배경음악 재생 
        this.bgmSound.play();
        // 볼륨 값 설정 (0.0 ~ 1.0 사이의 값)
        this.bgmSound.setVolume(0.5); // 50% 볼륨으로 설정
        
        //button 클릭 이벤트
        b2.setInteractive({ useHandCursor: true }); // 버튼에 인터랙션 추가
        b2.on("pointerdown", () => {
            this.scene.transition({
                target: "mainScene",
                duration: 500,
                data: this.isSoundPlaying ? 100 : 200,
                // data: this.scene.bgmSound = this.bgmSound,
            });
            console.log("button click");
            
        });

        //sound 클릭 이벤트
        s1.setInteractive({ useHandCursor: true });
        s1.on("pointerup", () => {
            if(!this.isHelpVisible){
                //누르면 꺼지고 다시 누르면 켜지고
                if(this.isSoundPlaying){
                    this.bgmSound.play();
                    this.add.sprite(670,50,'soundon');
                }else{
                    this.sound.stopAll(); // 전체 사운드 정지
                    s2 = this.add.sprite(670,50,'soundoff');
                
                }
                // 사운드 상태 변경
                this.isSoundPlaying = !this.isSoundPlaying;
            }
            console.log("sound click");
        });

        //help 클릭 이벤트
        help.setInteractive({ useHandCursor: true });
        help.on("pointerdown", () => {
        console.log("help this.isHelpVisible : "+ this.isHelpVisible);

        if(!this.isHelpVisible){
            // 버튼 클릭 가능 여부를 업데이트
            this.isHelpVisible = !this.isHelpVisible;

            if (this.isHelpVisible) {
                con = this.add.sprite(360, 640, 'control');
                xb = this.add.sprite(610, 80, 'xbutton');
                
                // 도움말 이미지가 보일 때 기존 버튼들을 비활성화
                s1.setInteractive(false);
                help.setInteractive(false);
                console.log("this.isHelpVisible : "+ this.isHelpVisible);
            } 
        }else {
            console.log("else this.isHelpVisible : "+ this.isHelpVisible);
            // 도움말 이미지가 숨겨질 때 기존 버튼들을 다시 활성화
            s1.setInteractive(true);
            help.setInteractive(true);
            
            // 이미지 비활성화
            con.setVisible(false);
            xb.setVisible(false);

            // 버튼 클릭 가능 여부를 업데이트
            this.isHelpVisible = !this.isHelpVisible;
        }
        
            console.log("help click");
        });
    }

    update(){
        //console.log("update");
    }

}