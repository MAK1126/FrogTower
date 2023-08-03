import Loading from "./Loading.js";
import MainScene from "./MainScene.js";
import Help from "./Help.js";

const config = {
    width: 720,
    height: 1280,
    backgroundColor: '#333333',
    type: Phaser.AUTO,
    parent: 'FrogGame',
    scene: [Loading,Help,MainScene],
    scale: {
        mode:Phaser.Scale.FIT,//자동맞춤
                autoCenter:Phaser.Scale.CENTER_BOTH,//가로세로 모두맞춤
                width:720,//비율설정용 폭
                height:1280,//비율설정용 높이
    },
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: {y: 0},
        }
    },
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin,
                key: 'matterCollision',
                mapping: 'matterCollision'
            }
        ]
    }
}

new Phaser.Game(config);
