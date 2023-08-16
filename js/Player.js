import ranking from "./Ranking.js";


export default class Player extends Phaser.Physics.Matter.Sprite {

    constructor(data){
        let { scene, x, y, texture, frame } = data;
        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.rectangle(this.x, this.y, 55, 165, {
            isSensor: true, 
            label: "playerCollider",
            isStatic: true,
        });
        
        // 디버그 랜더러 비활성화
        playerCollider.render.visible = false;
        this.scene.matter.world.drawDebug = false;

        const compoundBody = Body.create({
            parts: [playerCollider],
            frictionAir: 0.35
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation(true); //충돌해도 안돌아가게

        this.isJumping = false; // 점프 중인지 여부
        this.isFall = false;

        this.jumpDistance = 700; // 점프 거리 (위로 이동할 거리)
        this.jumpSpeed = 20; // 점프 속도
        this.landingSpeed = 8; // 랜딩 속도
        this.JumpStartSpeed = -60;
        this.DownSpeed = 2; // 떨어지는 속도

        this.Init();

        this.mainScene = scene;
        this.playerColliderS = false; 
        this.isConditionMet = false;

        this.isSoundPlaying = false;


    }
    static preload(scene)
    {   
        // this.mainScene = scene;
    }
    get velocity() 
    {
        return this.body.velocity; // 속도 반환
    }
    Init()
    {
        this.x = 150;
        this.y = 1030;

        this.minX = 150; 
        this.maxX = 560;
        this.speed = 13;
    
        // 20점마다 속도 3씩 증가
        if (this.scene.score >= 20 && this.scene.score < 40) {
            this.speed = 20;
        } else if (this.scene.score >= 40 && this.scene.score < 60) {
            this.speed = 23;
        } else if (this.scene.score >= 60 && this.scene.score < 80) {
            this.speed = 26;
        }else if (this.scene.score >= 80 && this.scene.score < 100) {
            this.speed = 29;
        }else if (this.scene.score >= 100 && this.scene.score < 120) {
            this.speed = 32;
        }else if (this.scene.score >= 120 ) {
            this.speed = 36;
        }

        this.isSoundPlaying = this.scene.isSoundPlaying;

        this.JumpSpeed = this.JumpStartSpeed;
        this.isFall = false;
        this.DownSpeed = 2;
        this.isJumping = false;
        this.setVelocityY(0);

        this.setTexture("sleepfrog");
        this.anims.play("sleepfrog_idle", true);
    }
    Gameover(){
        this.x = 360;
        this.y = 350;
        this.speed = 0;
        this.setVelocityY(0);

        this.gameover = this.setTexture("gameover").setDepth(4);
        this.anims.play("gameover_idle", true).setDepth(4);
        this.gameover.setScrollFactor(0);
        
        
        // 게임오버 음악 재생 
        if(this.isSoundPlaying)
        {
            this.gameOver = this.mainScene.sound.add("gameOver");
            this.gameOver.play();
        }
        
        // 1.8초 후에 다른 씬으로 전환하기 위해 타이머 설정
        this.scene.time.delayedCall(1800, this.GameoverChangeScene, [], this);
        
    }
    // --------------------------게임오버 씬 전환을 위한 콜백 함수---------------------------
    GameoverChangeScene(){

        if (this.scene.isSoundPlaying) {
            this.scene.sound.stopAll();
        }

        let data = {
            score : this.scene.score,
        }
        // 씬 전환
        this.scene.scene.start("ranking", data);

    }
    create(){
        // 카메라 이동을 위해 추가
        this.isScrolling = false;
    }
    update()
    {
        if(this.isJumping )
        {
            this.JumpSpeed = this.JumpSpeed +  this.DownSpeed;

            // 이동
            this.setVelocityY(this.JumpSpeed);
        
            // -------------------충돌 없이 하강하는 플레이어 목숨 감소-------------------------------
            if (this.y > (1280 + 80 + 1000) && !this.isConditionMet1 && this.scene.life1.visible) {
                // 개구리 떨어질 때 음악 재생 
                if(this.isSoundPlaying)
                {
                    this.frogFall = this.mainScene.sound.add("frogFall");
                    this.frogFall.play();
                }
                this.Init();
                this.scene.characterMng.player.y = this.scene.characterMng.basicFrog.y + 150; // 다시 생기는 자리
                this.scene.life1.setVisible(false);
                this.scene.isLifeCnt1 = true;
                // 프로그레스 바를 계속 진행하도록 설정
                this.scene.isPaused = false;
                //게이지바 다시 시작
                this.scene.progressBarTimer.remove();
                this.scene.startProgressBar(10);

                this.isConditionMet1 = true; // 첫 번째 조건이 충족되었을 때 isConditionMet1을 true로 설정
            }
          
            if (this.y > (1280 + 80 + 1100) && this.isConditionMet1 
            && !this.isConditionMet2 && this.scene.life2.visible) {
                // 개구리 떨어질 때 음악 재생 
                if(this.isSoundPlaying)
                {
                    this.frogFall = this.mainScene.sound.add("frogFall");
                    this.frogFall.play();
                }
                this.Init();
                this.scene.characterMng.player.y = this.scene.characterMng.basicFrog.y + 150;
                this.scene.life2.setVisible(false);
                this.scene.isLifeCnt2 = true;
                // 프로그레스 바를 계속 진행하도록 설정
                this.scene.isPaused = false;
                //게이지바 다시 시작
                this.scene.progressBarTimer.remove();
                this.scene.startProgressBar(10);
                
                this.isConditionMet2 = true; // 두 번째 조건이 충족되었을 때 isConditionMet2를 true로 설정
            }
          
            if (this.y > (1280 + 80 + 1200) && this.isConditionMet2) {
                // 개구리 떨어질 때 음악 재생 
                if(this.isSoundPlaying)
                {
                    this.frogFall = this.mainScene.sound.add("frogFall");
                    this.frogFall.play();
                }
                this.Init();
                this.scene.life3.setVisible(false); // 세 번째 조건이 충족되었을 때 원하는 동작 수행
                this.Gameover();
            }
            
            //
            if(this.isFall == false && this.JumpSpeed > 0)
            {
                this.isFall = true;
                this.scene.characterMng.player.anims.stop(); // 애니메이션이 멈추도록
            }
        }
        else
        {   //---------------잠자는 개구리 좌우 이동-----------------------------

            if (!this.moveLeft && this.x >= this.maxX) {
                // 오른쪽으로 이동 중인데 maxX에 도달하면 이동 방향을 바꿈
                this.moveLeft = true;
            } else if (this.moveLeft && this.x <= this.minX) {
                // 왼쪽으로 이동 중인데 minX에 도달하면 이동 방향을 바꿈
                this.moveLeft = false;
            }
            // 이동 방향에 따라 속도를 설정
            const velocityX = this.moveLeft ? -this.speed : this.speed;
            // 이동
             this.setVelocityX(velocityX);
        }       
    }

    // CharacterMng.js에서 wakeupfrog 애니 실행되고 호출되는 함수. 
    onAnimationComplete(animation, frame) {
        
        this.characterMng.player.setTexture("jumpfrog");
        this.characterMng.player.anims.play("jumpfrog_idle",true);
        
        this.characterMng.player.isJumping = true; // 점프 시작
        this.characterMng.player.setVelocityY(this.characterMng.player.JumpStartSpeed);

    }
    
    onLandingComplete(animation, frame)
    {
        this.Init();

        // 충돌 후에 프로그레스 바를 계속 진행하도록 설정
        this.scene.isPaused = false;

        //게이지바 다시 시작
        this.scene.progressBarTimer.remove();
        this.scene.startProgressBar(10);
    }

}