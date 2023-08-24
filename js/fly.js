export default class fly extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let { scene, x, y, texture, frame } = data;
        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);
        
        // 충돌 설정
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var flyCollider = Bodies.circle(this.x, this.y,105, {
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
    static preload(scene)
    {   
       
    }
    Init(posX,posY)
    {
        this.x = posX;
        this.y = posY;
    }
    
}