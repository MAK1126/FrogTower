export default class basicFrog extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let { scene, x, y, texture, frame } = data;
        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var basicfrogCollider = Bodies.rectangle(this.x, this.y, 55, 165, {
            isSensor: true, 
            label: "basicfrogCollider",
            isStatic: true
        });
        const compoundBody = Body.create({
            parts: [basicfrogCollider],
            frictionAir: 0.35
        });
        this.setExistingBody(compoundBody);

        this.isActive = true; // 기본값은 활성화 상태로 설정
        
    }
    static preload(scene){
        scene.load.atlas(
            "basicfrog",
            "assets/images/basicfrog.png",
            "assets/images/basicfrog_atlas.json"
        );
        scene.load.animation('basicfrog_anim', 'assets/images/basicfrog_anim.json');

    }
    onCollision() {
        this.isActive = false; // 충돌 시 비활성화
    }
    update()
    {
        if (this.isActive) {
            this.anims.play("basicfrog_idle", true);
        }
    }    
}