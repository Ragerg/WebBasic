const ENEMY_SPEED_MIN_EASY = 1000;
const ENEMY_SPEED_MAX_EASY = 3000;

const ENEMY_SPEED_MIN_HARD = 500;
const ENEMY_SPEED_MAX_HARD = 1000;

$(function () {
  function backgroundSlide() {
    let posi = 0;

    setInterval(function () {
      $("#container").css("background-position", posi-- + "px");
      if (posi === -880) {
        posi = 0;
      }
    }, 10);
  }

  const hero = $("#hero");
  const enemy = $("#enemy");

  // 점프 중인지?
  let isJumping = false;
  let score = 0;

  gameStart();

  function gameStart() {
    // $('#gameover_screen').hide();

    setKeyboardEvent();
    enemyStart();

    checkGameOver();
    backgroundSlide();
  }

  function restartGame() {
    clearInterval(gameInterval); // 이전 게임의 interval을 정지
    score = 0;
    updateScore(score);
  
    $("#gameover_screen").hide(); // 게임 오버 화면 숨기기
  
    gameStart(); // 게임 재시작
  }


  //적과 충돌
  function isColliding(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(
      rect1.bottom < rect2.top + 10 ||
      rect1.top > rect2.bottom + 10 ||
      rect1.right < rect2.left + 10 ||
      rect1.left > rect2.right + 10
    );
  }

  function checkGameOver() {
    setInterval(function () {
      if (isColliding(hero[0], enemy[0])) {
        hero.stop();
        enemy.stop();

        if (!$("#gameover_screen").is(":visible")) {
          $("#gameover_screen").show();
        }
      }
    }, 1000 / 60);
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function enemyStart() {
    // 속도 조절
    const speed = getRandomNumber(1000, 3000);

    // 적이 오른쪽에서 왼쪽으로 이동
    enemy.animate({ right: "850px" }, speed, "linear", function () {
      // 점수 올리자
      score += 100;
      updateScore(score);

      // 적 리셋
      enemy.css("right", "-50px");
      enemyStart();
    });
  }

  function updateScore(score) {
    $("#score").text(score);
  }

  function jump() {
    isJumping = true;
    hero
      .animate({ bottom: "+=140px" }, 500)
      .animate({ bottom: "-=140px" }, 800, function () {
        isJumping = false;
      });
  }

  // 키보드 이벤트 정의
  function setKeyboardEvent() {
    $("html").keydown(function (e) {
      switch (e.key) {
        case " ":
          if (!isJumping) {
            jump();
          }
          break;
      }
      // console.log(e.key);
    });
  }
});
