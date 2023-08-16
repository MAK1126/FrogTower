// import fetch from "node-fetch";
// import CDatabase from "./CDatabase.js";

// import { request, response } from 'express';
// import * as querystring from 'querystring';

export default class Ranking extends Phaser.Scene {
    constructor() {
        super("ranking");
        // this.database = new CDatabase;
    }
    preload() {
        //이미지
        this.load.image("ranking", "assets/images/Rank.png");
        this.load.image("xbutton", "assets/images/xbutton.png");
    }

    init(data)
    {
        this.score = data.score;
        console.log(this.score);
    }
    async create() {
        console.log("ranking");
        const rank = this.add.sprite(360,640,'ranking');
        const xb = this.add.sprite(610, 80, 'xbutton');

        //폰트스타일
        const fontStyle = {
            font: '60px myfont',
            fill: 'black',
            align: 'center',
            stroke: 'black', // 두껍게 효과를 주기 위해 stroke 속성 추가
            strokeThickness: 2.5,
        };

        // 마지막 점수를 표시할 텍스트 생성
        this.scene.scoreText = this.add.text(360, 1100, `${this.score}`,fontStyle );
        this.scene.scoreText.setOrigin(0.5, 0.5);


        try {
            console.log("dbcon");

            const response = await fetch('../DBphp/get-rank.php', //http://127.0.0.1:5500/DBphp/get-rank.php
            {                           
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                },
                
                // body: JSON.stringify({ key: 'value' }) // JSON 데이터 전송
            })
            // .then(function(response) {
            //     if (response.status >= 200 && response.status < 300) {
            //         return response.text()
            //     }
            //     throw new Error(response.statusText)
            // })
            // .then(function(response) {
            //     console.log(response);
            // })

            // const options = { //$enc_data 를 php 의 main 에서 가져오기 위한 옵션
            //     url: 'http://127.0.0.1:5500/DBphp/get-rank.php',
            //     method: 'POST',
            //     json: true,
            // };
            // request.get(options, function (error, response, body) { 
            //     var row_data = body; 
            //     var row_datas = row_data.split('|');
            //     if (row_datas[0]) {//실패한경우
            //       res.render('error_chk', {
            //         error_msg: row_datas[0]
            //       });
            //     } else { //정상적으로 가져온 경우
            //       res.render('index', {
            //         title: 'burning_camp',
            //         post: false,
            //         enc_data: row_datas[1],
            //       });
            //     }
            // });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // const data = await response.text();

            console.log(data); // 응답 데이터 출력

                
            // 동적으로 생성된 텍스트 추가하기
            const yPositions = [332, 465, 592, 720, 848];
            for (let i = 0; i < 5; i++) {

                const rankText = this.add.text(360, yPositions[i], data[i], fontStyle).setOrigin(0.5, 0.5);
                // data[i]는 서버에서 받은 상위 5개의 점수값
            }

        } catch (error) {
            console.error('Error:', error);
        }
        
        //button 클릭 이벤트
        xb.setInteractive({ useHandCursor: true }); // 버튼에 인터랙션 추가
        xb.on("pointerdown", () => {

            // this.game.destroy(); // 게임 창 닫기

            console.log("xb click");
              
        });

    }
    update()
    {

    }
}