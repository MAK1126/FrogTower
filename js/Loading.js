import MainScene from "./MainScene.js";
export default class Loading extends Phaser.Scene{
    constructor(){
        super("loading");
    }
    preload(){
        this.load.image("background","assets/images/타이틀전체배경.png");
        this.load.image("button", "assets/images/플레이 버튼.png");
        this.load.image("soundon", "assets/images/사운드 켜짐.png");
        this.load.image("soundoff", "assets/images/사운드 꺼짐.png");
        this.load.image("help", "assets/images/도움말 버튼.png");
  
        this.load.audio("bgm", 'sound/bgm.wav');
    }
    create(){

        const b1 = this.add.sprite(360,640,'background');
        const b2 = this.add.sprite(360,1100,'button');
        const s1 = this.add.sprite(670,50,'soundon');
        const help = this.add.sprite(585,50,'help');

        this.isSoundPlaying = false;
        // 사운드 상태를 저장할 game 객체의 속성 생성
        this.game.soundOn = true;

        //button 클릭 이벤트
        b2.setInteractive({ useHandCursor: true }); // 버튼에 인터랙션을 추가합니다.
        b2.on("pointerdown", () => {
            this.scene.transition({
                target: "mainScene",
                duration: 500,
            });
            console.log("button click");
            
        });

        //sound 클릭 이벤트
        s1.setInteractive({ useHandCursor: true });
        s1.on("pointerup", () => {
            //누르면 꺼지고 다시 누르면 켜지고
            if(this.isSoundPlaying){
                this.bgmSound.play();
                this.add.sprite(670,50,'soundon');
            }else{
                this.sound.stopAll(); // 전체 사운드 정지
                this.isSoundPlaying = false; // 사운드 상태 변경

                this.add.sprite(670,50,'soundoff');
            }
            // 사운드 상태 변경
            this.isSoundPlaying = !this.isSoundPlaying;

            console.log("sound click");
        });

        //help 클릭 이벤트
        help.setInteractive({ useHandCursor: true });
        help.on("pointerdown", () => {
            this.scene.transition({
                target: "help",
                duration: 500,
            });
            this.bgmSound.stop();
            console.log("help click");
        });

        // 배경음악 재생 
        this.bgmSound = this.sound.add("bgm", { loop: true });
        this.bgmSound.play();
        // 볼륨 값 설정 (0.0 ~ 1.0 사이의 값)
        this.bgmSound.setVolume(0.5); // 60% 볼륨으로 설정

        // 사운드를 자동으로 재생하도록 설정
        // this.sound.context.resume().then(() => {
        //     const sound = this.sound.add("bgm");
        //     sound.play();
        //     console.log("auto sound");
        // });
    }
    update(){
        //console.log("update");
    }
}