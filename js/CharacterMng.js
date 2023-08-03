import Player from "./Player.js";
import BasicFrog from "./basicFrog.js";
import Fly from "./fly.js";
import MainScene from "./MainScene.js";

export default class CharacterMng extends Phaser.GameObjects.GameObject {

    constructor(data){
        console.log("constructor CharacterMng");
    
        let { scene} = data;
        super(scene);
        this.scene.add.existing(this);

        this.mainScene = scene; // MainScene.js의 인스턴스를 저장합니다.
    }
    static preload(scene)
    {
        Player.preload(scene);
        BasicFrog.preload(scene);
        Fly.preload(scene);

        this.scene = scene;

        // sleep frog
        scene.load.atlas(
            "sleepfrog",
            "assets/images/sleepfrog.png",
            "assets/images/sleepfrog_atlas.json"
        );
        scene.load.animation('sleepfrog_anim', 'assets/images/sleepfrog_anim.json');

        //wakeupfrog
        scene.load.atlas(
            "wakeupfrog",
            "assets/images/wakeupfrog.png",
            "assets/images/wakeupfrog_atlas.json"
        );
        scene.load.animation('wakeupfrog_idle', 'assets/images/wakeupfrog_anim.json');

         //jumpfrog
         scene.load.atlas(
            "jumpfrog",
            "assets/images/jumpfrog.png",
            "assets/images/jumpfrog_atlas.json"
        );
        scene.load.animation('jumpfrog_idle', 'assets/images/jumpfrog_anim.json');

        //landingfrog
         scene.load.atlas(
            "landingfrog",
            "assets/images/landingfrog.png",
            "assets/images/landingfrog_atlas.json"
        );
        scene.load.animation('landingfrog_idle', 'assets/images/landingfrog_anim.json');

        //게임오버
        scene.load.atlas(
            "gameover",
            "assets/images/gameover.png",
            "assets/images/gameover_atlas.json"
        );
        scene.load.animation('gameover_anim', 'assets/images/gameover_anim.json');
        
        // 위 화살표 
        scene.load.atlas(
            "up",
            "assets/images/up.png",
            "assets/images/up_atlas.json"
        );
        scene.load.animation('up_anim', 'assets/images/up_anim.json');
    }

    update()
    {
        this.player.update();
        this.basicFrog.update();

        // 개구리의 애니메이션이 완료되었을 때 상태를 업데이트합니다.
        if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === "jumpfrog_idle" && this.player.anims.currentAnim.isLastFrame) {
            this.player.onJumpComplete();
        }

        if (this.isActive) {
            this.anims.play("basicfrog_idle", true);
        }

        let aaa = this.basicFrog.y - this.fly.y;

         // 파리가 화면에 나타나면 화살표를 보이지 않도록 설정
         if (this.fly) {
            if (this.arrow) {
                this.arrow.setVisible(aaa < 1000 ? false : true);
            }
        }
        // 파리가 화면에 나타나지 않은 경우, 화살표를 계속해서 보여줍니다.
        else {
            if (this.arrow) {
                this.arrow.setVisible(true);

                if (this.fly) {
                    // 화살표의 위치를 파리의 위치로 설정
                    this.arrow.setPosition(this.fly.x, this.arrow.y);
                    // 화살표의 회전 중심을 설정하여 파리가 생성되는 방향으로 향하도록 합니다.
                    let angle = Phaser.Math.Angle.Between(this.arrow.x, this.arrow.y, this.fly.x, this.fly.y)-Phaser.Math.DegToRad(90);                    
                    this.arrow.setRotation(angle);
                }
            } else {
                if (this.scene.score >= 6) {
                    this.scene.characterMng.createArrow();
                    this.scene.characterMng.flyCreate();
                }
            }
        }
    }

    // MainScene.js에서 호출하고 있는 함수(클릭하면 호출)
    changeSleepFrog()
    {
        this.player.speed = 0;

        const currentAnimName = this.player.anims.currentAnim ? this.player.anims.currentAnim.key : null;
        if(currentAnimName !== "wakeupfrog_idle" &&
        currentAnimName !== "jumpfrog_idle" &&
        currentAnimName !== "basicfrog_idle" &&
        currentAnimName !== "landingfrog_idle")
        {
            this.player.setTexture("wakeupfrog");
            this.player.anims.play("wakeupfrog_idle",true);
            this.player.once("animationcomplete", this.player.onAnimationComplete, this.scene);
        }
    }

    createSleepFrog(frogX, frogY) 
    {
        if (this.sleepfrog) {
            this.sleepfrog.destroy(); // 기존의 SleepFrog 삭제
        }
        this.sleepfrog = new SleepFrog({
            scene: this.scene,
            x: frogX,
            y: frogY,
            texture: "sleepfrog",
            frame: "sleep0001",
        });
    }

    createBasicFrog(frogX,frogY)
    {
        console.log("createBasicFrog");

        this.basicFrog = new BasicFrog({
            scene: this.scene,
            x: frogX,
            y: frogY,
            texture: "basicfrog",
            frame: "basic0001",
        });
        
        this.basicFrog.setDepth(-1); // 플레이어보다 뒤에 나오게 깊이 설정함
    }

    createPlayer()
    {
        this.player = new Player({
            scene: this.scene,
            x: 150,
            y: 1030,
            texture: "wakeupfrog",
            frame: "wakeup0001",
        });
    }

    //--------------------basicfrog와 player 충돌 이벤트-------------------
    collisionCheck(event)
    {
        event.pairs.forEach(async (pair) => {

        if(this.scene.characterMng.player.isFall == false)
            return;

        const { bodyA, bodyB } = pair;
        if (
            (bodyA.label === "playerCollider" && bodyB.label === "basicfrogCollider") ||
            (bodyA.label === "basicfrogCollider" && bodyB.label === "playerCollider")
        ) 
        {

            const basicFrog = bodyA.label === "basicfrogCollider" ? bodyA.gameObject : bodyB.gameObject;

            if (!basicFrog.isActive) { // 이미 충돌한 개구리는 충돌 처리를 건너뜁니다.
                return;
            }

            this.scene.characterMng.player.setTexture("landingfrog");
            this.scene.characterMng.player.anims.play("landingfrog_idle",true);

            this.scene.characterMng.player.JumpSpeed = 0;
            this.scene.characterMng.player.DownSpeed = 0;
            this.scene.characterMng.player.setVelocityY(0);

            // 충돌 시 개구리의 상태를 업데이트합니다.
            basicFrog.onCollision();

            // 개구리 착지할 때 음악 재생 
            this.frogArray = this.scene.sound.add("frogArray");
            this.frogArray.play();

            // 충돌 시 점수 증가
            this.scene.score += 2;  
            //this.scene.score++;  //-- 이건 1점씩 오르기
                        
            
            this.scene.characterMoveCnt++;

            // 점수를 UI에 표시
            this.scene.scoreText.setText(`${this.scene.score}`);
            // 텍스트 위치 고정
            this.scene.scoreText.setScrollFactor(0);

            // 애니메이션의 onComplete 콜백 등록
            this.scene.characterMng.player.once("animationcomplete", () => {
                // 애니메이션이 완료된 후에 실행할 코드 작성

                // 카메라 이동 거리
                let aa = this.scene.characterMng.basicFrog.y;
                let bb = this.scene.characterMng.player.y;
                let cc = 300 + (bb - aa);
                console.log("onAnimationComplete cc : " + cc);

                this.scene.characterMng.createBasicFrog(
                    this.scene.characterMng.player.x, this.scene.characterMng.player.y
                );
                this.scene.characterMng.player.onLandingComplete();
                this.scene.characterMng.player.y = this.scene.characterMng.basicFrog.y + 150;

                // 카메라 이동
                this.scene.characterMng.startCameraMove(cc);

                if(this.scene.characterMoveCnt > 7)
                {
                    this.scene.bgskySprites[0].y = this.scene.bgskySprites[2].y - 1280;
                    this.scene.bg2.setTexture('bgsky');
                    console.log("########### b1 change ###############");
                    let bottmBG = this.scene.bgskySprites[0];
                    this.scene.bgskySprites.splice(0,1);
                    this.scene.bgskySprites.push(bottmBG);

                    this.scene.characterMoveCnt = 0;
                }


                console.log("this.scene.characterMoveCnt : " + this.scene.characterMoveCnt);


                console.log("this.scene.characterMng.player.y : " + this.scene.characterMng.player.y);

                console.log("bgsky1.y : " + this.scene.bgsky1.y);
                console.log("bgsky2.y : " + this.scene.bg2.y);
                console.log("bgsky3.y : " + this.scene.bgsky3.y);
                console.log("cameras.main.scrollY : " + this.scene.cameras.main.scrollY);
                console.log("game.config.height : " + this.scene.game.config.height);
            });
          }
        });
    }
    //-------------------- ↑↑ 충돌하는 동안 호출( ↓↓ 파리와 개구리 충돌)-----------------
    collisionActive(event){
        event.pairs.forEach(async (pair) => {    

          const { bodyA, bodyB } = pair;
        if (
            (bodyA.label === "flyCollider" && bodyB.label === "basicfrogCollider") ||
            (bodyA.label === "basicfrogCollider" && bodyB.label === "flyCollider")
          )
          {
            // 파리 먹을 때 음악 재생 
            this.eatBug = this.scene.sound.add("eatBug");
            this.eatBug.play();

            // 충돌 시 점수 증가
            this.scene.score += 10;  
            this.scene.scoreText.setText(`${this.scene.score}`);

            //파리 생성
            this.scene.characterMng.flyCreate();
          }
        });
         // 파리가 화면 아래로 벗어났을 때 다시 생성
         if (this.scene.characterMng.fly.y > this.scene.cameras.main.scrollY + this.scene.cameras.main.height) {
            this.scene.characterMng.flyCreate();
        }
    }

    Init()
    {
        console.log("characterMng init");
        this.createBasicFrog(360,1000);
        this.createPlayer();
        this.createArrow();
        this.flyCreate();

        this.scene.matter.world.on("collisionstart", this.scene.characterMng.collisionCheck); //충돌
        this.scene.matter.world.on("collisionactive", this.scene.characterMng.collisionActive); //충돌
    }

    // 카메라를 이동
    startCameraMove(range) 
    {
        this.scene.cameras.main.scrollY -= range;
    }

    // 파리 생성
    flyCreate()
    {
        let flyX = Phaser.Math.Between(150, 560); // x 좌표를 랜덤한 값으로 설정
        let flyY = this.player.y -1280; // player의 y 좌표에서 -1280만큼 위에 위치하도록 설정

        if(this.fly == null)
        {
            this.fly = new Fly({
                scene: this.scene,
                x: flyX,
                y: flyY,
                texture: "bug",
                frame: "bug0001",
            });
            this.fly.anims.play("bug_idle", true);
        }
        else
        {
            this.fly.Init(flyX,flyY);
        }

        this.arrow.setVisible(true); // 기존의 화살표를 보이도록 설정
        this.arrow.x = this.fly.x; // 화살표와 파리 x축 같게 설정.
        // this.fly.x = this.arrow.setOrigin(0.5,1);
    }

    // 화살표 생성
    createArrow() {
        if (this.arrow) {
            
        } else {
            // 화살표는 x축으로 360, y축으로 0에 고정되도록 생성
            this.arrow = this.scene.add.sprite(360, 60, "up");
            this.arrow.setOrigin(0.5, 1); // 회전 중심을 이미지의 맨 위 꼭짓점으로 변경
            this.arrow.anims.play("up_idle", true);
            this.arrow.setScrollFactor(0);
        }

    }
}