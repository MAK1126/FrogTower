export default class Help extends Phaser.Scene{
    constructor(){
        super("help");
    }
    preload(){

        this.load.image("xbutton", "assets/images/xbutton.png");
        this.load.image("control", "assets/images/control.png");
    }
    create(){

        const con = this.add.image(360, 640, 'control');
        const xb = this.add.image(610, 80,'xbutton');

        //xbutton 클릭 이벤트
        xb.setInteractive({ useHandCursor: true }); // 버튼에 인터랙션을 추가합니다.
        xb.on("pointerdown", () => {
            this.scene.transition({
                target: "loading",
                duration: 100,
            });
            
            console.log("xbutton");
        });

    }

}