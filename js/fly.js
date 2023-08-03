export default class fly extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let { scene, x, y, texture, frame } = data;
        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var flyCollider = Bodies.circle(this.x, this.y,100, {
            isSensor: true, 
            label: "flyCollider",
            isStatic: true,
            debug : true,
        });


        const compoundBody = Body.create({
            parts: [flyCollider],
            frictionAir: 0.35
        });
        this.setExistingBody(compoundBody);

        
    }
    static preload(scene){

       // 파리
       scene.load.atlas(
        "bug",
        "assets/images/bug.png",
        "assets/images/bug_atlas.json"
    );
    scene.load.animation('bug_anim', 'assets/images/bug_anim.json');

    }

    Init(posX,posY)
    {
        console.log("fly init");

        this.x = posX;
        this.y = posY;
    }
    
}