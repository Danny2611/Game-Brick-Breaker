const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");
//    ----------------PADDLE-----------------
// Create PADDLE
const PADDLE_WIDTH = 90;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;

const paddle = {
    x: canvas.width / 2 - PADDLE_WIDTH / 2,
    y: canvas.height - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 7 // move left or right 5 steps
};

// Draw PADDLE
function drawPaddle() {
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = "#ffcd05"; // draw stroke of rectangle
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Move PADDLE
// KeyCode 37 là nút di chuyển trái, 39 là nút di chuyển phải
let leftPress = false;
let rightPress = false;
let isBallMoving = true; // Biến để theo dõi trạng thái của việc di chuyển quả bóng

document.addEventListener("keydown", keyDownHandler);
function keyDownHandler(e) {
    if (e.keyCode == 37) {
        leftPress = true;
    } else if (e.keyCode == 39) {
        rightPress = true;
    } else if (e.keyCode == 32) {
        toggleBallMovement(); // Gọi hàm để dừng hoặc tiếp tục di chuyển quả bóng khi nhấn nút Space

    }
}

document.addEventListener("keyup", keyUpHandler);
function keyUpHandler(e) {
    if (e.keyCode == 37) {
        leftPress = false;
    } else if (e.keyCode == 39) {
        rightPress = false;
    }
}

function toggleBallMovement() {
    isBallMoving = !isBallMoving; // Đảo ngược trạng thái của việc di chuyển quả bóng
}

//  xử lí điều khiển việc di chuyển của paddle:
function movePaddle() {
    if (isPaddleBackwardsActive) {
        if (rightPress && paddle.x > 0) {
            paddle.x -= paddle.dx;
        } else if (leftPress && paddle.x + paddle.width < canvas.width) {
            paddle.x += paddle.dx;
        }
    } else {
        if (leftPress && paddle.x > 0) {
            paddle.x -= paddle.dx;
        } else if (rightPress && paddle.x + paddle.width < canvas.width) {
            paddle.x += paddle.dx;
        }
    }
}

// ------------------BALL----------------
// Create BALL
const BALL_RADIUS = 9;
const ball = {
    x: canvas.width / 2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 2,
    dx: 3,
    dy: -3
};

// Draw BALL
function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffcd05";
    ctx.fill();
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();
    ctx.closePath();
}

// Di chuyển quả bóng chính
function moveBall(ball) {
    if (isBallMoving) {
        ball.x += ball.dx * ball.speed;
        ball.y += ball.dy * ball.speed;
    }
}

// Di chuyển các quả bóng mới
function moveAllBalls() {
    for (let i = 0; i < balls.length; i++) {
        moveBall(balls[i]);
    }
}

const levelSpeeds = {
    1: 1.7,
    2: 1.8,
    3: 1.9,
    4: 2.0,
    5: 2.0,
    6: 2.0,
    // Thêm các cấp độ và tốc độ tương ứng ở đây
}
const paddleSpeeds = {
    1: 7,
    2: 8,
    3: 9,
    4: 10,
    5: 11,
    6: 11,
    // Thêm các cấp độ và tốc độ tương ứng ở đây
}

const MAX_BALL_SPEED = 5;
// 
/// Hàm dùng để reset trạng thái của quả bóng, bao gồm vị trí ban đầu, vận tốc, bán kính và các thuộc tính khác
function resetBall() {
    // Đặt vị trí ban đầu của quả bóng ở giữa chiều ngang của canvas (màn hình trò chơi)
    ball.x = canvas.width / 2;

    // Đặt vị trí ban đầu của quả bóng ngay trên thanh gạch với một khoảng cách là bán kính của quả bóng
    ball.y = paddle.y - BALL_RADIUS;

    // Thiết lập vận tốc ban đầu của quả bóng theo hướng ngẫu nhiên
    ball.dx = 3 * (Math.random() * 2 - 1);

    // Đặt vận tốc theo chiều dọc của quả bóng
    ball.dy = -3;

    // Đặt bán kính của quả bóng
    ball.radius = 9;

    // Đặt tốc độ của quả bóng theo mức độ hiện tại của trò chơi
    ball.speed = levelSpeeds[LEVEL];

    // Đặt vận tốc di chuyển của thanh gạch theo mức độ hiện tại của trò chơi
    paddle.dx = paddleSpeeds[LEVEL];

    // Vòng lặp này đặt lại bán kính của các quả bóng phụ nếu có
    for (var i = 1; i < balls.length; i++) {
        balls[i].radius = 9;
    }
}


/// Hàm xử lí va chạm giữa quả bóng và các tường
function ballWallCollision() {
    // Xử lí quả bóng chính với tường
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx; // Đảo hướng di chuyển theo trục x nếu quả bóng chạm vào biên trái hoặc phải của canvas
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy; // Đảo hướng di chuyển theo trục y nếu quả bóng chạm vào biên trên của canvas
    }
    if (ball.y + ball.radius > canvas.height) {
        LIFE--; // Giảm mạng khi quả bóng rơi ra khỏi phía dưới của canvas
        resetBall(); // Đặt lại quả bóng chính
    }

    // Xử lí va chạm của các quả bóng phụ với tường
    for (let i = 0; i < balls.length; i++) {
        let currentBall = balls[i];
        // Kiểm tra va chạm với các biên của canvas
        if (currentBall.x + currentBall.radius > canvas.width || currentBall.x - currentBall.radius < 0) {
            currentBall.dx = -currentBall.dx; // Đảo hướng di chuyển theo trục x nếu quả bóng phụ chạm vào biên trái hoặc phải của canvas
        }
        if (currentBall.y - currentBall.radius < 0) {
            currentBall.dy = -currentBall.dy; // Đảo hướng di chuyển theo trục y nếu quả bóng phụ chạm vào biên trên của canvas
        }
        if (currentBall.y + currentBall.radius > canvas.height) {
            // Xóa quả bóng phụ khỏi mảng nếu nó rơi ra khỏi phía dưới canvas
            balls.splice(i, 1);
            // Kiểm tra nếu không còn quả bóng nào, giảm mạng và đặt lại quả bóng chính
            if (balls.length === 0) {
                LIFE--;
                resetBall();
            }
        }
    }
}



// Xử lí quả bóng với thanh đỡ
function ballPaddleColision() {
    // Xử lí quả bóng chính với thanh đỡ
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && ball.y + ball.radius > paddle.y && ball.y < paddle.y + paddle.height) { // Sửa điều kiện va chạm
        ball.dx = ball.dx;
        ball.dy = -ball.dy;
    }
    // xử lí quả bóng mới với thanh đỡ
    for (let i = 0; i < balls.length; i++) {
        let currentBall = balls[i];
        if (currentBall.x < paddle.x + paddle.width && currentBall.x > paddle.x && currentBall.y + currentBall.radius > paddle.y && currentBall.y < paddle.y + paddle.height) {
            currentBall.dx = currentBall.dx;
            currentBall.dy = -currentBall.dy;
        }
    }
}
//-------------------------------------

//---------------BRICK-----------------
// Creat BRICK
const brick = {
    width: 55,
    height: 20,
    offsetLeft: 50,
    offsetTop: 20,
    marginTop: 60,
    fillColor: "#5dcb09",
    strokeColor: "#fff",
    hitCount: 0
};

const brickLayouts = [
    // Cấp độ 1
    [

        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],

    ],
    // Cấp độ 2
    [
        [1, 0, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [1, 1, 1, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
    ],

    // Cấp độ 3
    [
        [1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
    ],

    // Cấp 4
    [
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
    ],

    // Cap 5
    [
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],

    //level 6
    [
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 0, 0, 1, 1, 0],
        [0, 0, 1, 0, 0, 0, 1, 0, 0]
    ]

];

const COLORS = {
    yellow: "hsl(55.52deg 69.6% 50.98%)",
    red: "hsl(359.73deg 93.33% 52.94%)",
    xanh_lam: "hsl(179.62deg 73.15% 57.65%)",
    green: "hsl(112.69deg 83.12% 46.47%)",
    blue: "hsl(204.89deg 59.47% 44.51%)",
    pink: "hsl(298.28deg 87.45% 53.14%)",
    gray: "hsl(0deg 0% 53.73%)"
};
const brickColorsByLevel = [
    // màu level1
    [
        [COLORS.yellow, COLORS.red, COLORS.xanh_lam, COLORS.green],
        [COLORS.yellow, COLORS.red, COLORS.xanh_lam, COLORS.green],
        [COLORS.yellow, COLORS.red, COLORS.xanh_lam, COLORS.green],
        [COLORS.yellow, COLORS.red, COLORS.xanh_lam, COLORS.green]

    ],

    // màu level2
    [
        [COLORS.pink, "", "", "", ""],
        [COLORS.pink, COLORS.xanh_lam, "", "", ""],
        [COLORS.pink, COLORS.xanh_lam, COLORS.red, "", ""],
        [COLORS.pink, COLORS.xanh_lam, COLORS.red, COLORS.green, ""],
        [COLORS.pink, COLORS.xanh_lam, COLORS.red, COLORS.green, COLORS.yellow],
    ],

    // màu level3
    [
        [COLORS.red, COLORS.pink, COLORS.blue, 0, COLORS.green, COLORS.yellow, COLORS.xanh_lam],
        [COLORS.red, COLORS.pink, COLORS.blue, 0, COLORS.green, COLORS.yellow, COLORS.xanh_lam],
        [COLORS.red, COLORS.pink, COLORS.blue, 0, COLORS.green, COLORS.yellow, COLORS.xanh_lam],
        [COLORS.red, 0, COLORS.blue, 0, COLORS.green, 0, COLORS.xanh_lam],
        [COLORS.red, 0, COLORS.blue, 0, COLORS.green, 0, COLORS.xanh_lam],
        [COLORS.red, 0, COLORS.blue, 0, COLORS.green, 0, COLORS.xanh_lam],
        [COLORS.red, 0, COLORS.blue, 0, COLORS.green, 0, COLORS.xanh_lam],
    ],

    // màu level4
    [
        [0, 0, 0, COLORS.gray, 0, 0, 0],
        [0, 0, COLORS.gray, COLORS.pink, COLORS.gray, 0, 0],
        [0, COLORS.gray, COLORS.xanh_lam, COLORS.pink, COLORS.xanh_lam, COLORS.gray, 0],
        [COLORS.gray, COLORS.green, COLORS.xanh_lam, COLORS.pink, COLORS.xanh_lam, COLORS.green, COLORS.gray],
        [0, COLORS.gray, COLORS.xanh_lam, COLORS.pink, COLORS.xanh_lam, COLORS.gray, 0],
        [0, 0, COLORS.gray, COLORS.pink, COLORS.gray, 0, 0],
        [0, 0, 0, COLORS.gray, 0, 0, 0],
    ],

    // level 5
    [
        [0, 0, 0, 0, 0, COLORS.gray, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, COLORS.gray, COLORS.xanh_lam, COLORS.gray, 0, 0, 0, 0],
        [0, 0, 0, COLORS.gray, COLORS.pink, COLORS.xanh_lam, COLORS.yellow, COLORS.gray, 0, 0, 0],
        [0, 0, COLORS.gray, COLORS.green, COLORS.pink, COLORS.xanh_lam, COLORS.yellow, COLORS.green, COLORS.gray, 0, 0],
        [0, COLORS.gray, COLORS.red, COLORS.green, COLORS.pink, COLORS.xanh_lam, COLORS.yellow, COLORS.green, COLORS.red, COLORS.gray, 0],
        [COLORS.gray, COLORS.gray, COLORS.gray, COLORS.gray, COLORS.gray, COLORS.gray, COLORS.gray, COLORS.gray, COLORS.gray, COLORS.gray, COLORS.gray]
    ],

    // màu level6
    [
        [0, 0, 0, COLORS.gray, COLORS.gray, COLORS.gray, 0, 0, 0],
        [0, 0, COLORS.gray, COLORS.xanh_lam, COLORS.gray, COLORS.pink, COLORS.gray, 0, 0],
        [0, COLORS.gray, COLORS.xanh_lam, COLORS.green, COLORS.gray, COLORS.pink, COLORS.yellow, COLORS.gray, 0],
        [0, COLORS.red, COLORS.xanh_lam, COLORS.green, COLORS.gray, COLORS.pink, COLORS.yellow, COLORS.yellow, 0],
        [COLORS.gray, COLORS.xanh_lam, COLORS.green, COLORS.pink, COLORS.gray, COLORS.yellow, COLORS.pink, COLORS.red, COLORS.gray],
        [0, COLORS.red, COLORS.xanh_lam, COLORS.green, COLORS.gray, COLORS.pink, COLORS.yellow, COLORS.pink, 0],
        [0, COLORS.red, COLORS.xanh_lam, COLORS.pink, COLORS.gray, COLORS.green, COLORS.green, COLORS.pink, 0],
        [0, COLORS.gray, COLORS.xanh_lam, 0, 0, 0, COLORS.pink, COLORS.gray, 0],
        [0, 0, COLORS.gray, 0, 0, 0, COLORS.gray, 0, 0]
    ],
];



let bricks = []; // tạo mảng chứa các bricks
let grayBricks = []; // tạo mảng chứa các viên gạch xám

function creatBricks(level) {
    const layout = brickLayouts[level - 1]; // Lấy layout cho cấp độ cụ thể
    brick.row = layout.length; // Số hàng
    brick.col = layout[0].length; // Số cột
    // Reset mảng bricks
    bricks = [];
    grayBricks = []; // Khởi tạo mảng lưu trữ viên gạch màu gray

    for (let r = 0; r < brick.row; r++) {
        bricks[r] = []; // Khởi tạo mảng con cho hàng r
        for (let c = 0; c < brick.col; c++) {
            let status = layout[r][c] === 1; // Xác định status từ layout
            bricks[r][c] = {
                x: c * (brick.offsetLeft + brick.width) + brick.offsetLeft,
                y: r * (brick.offsetTop + brick.height) + brick.offsetTop + brick.marginTop,
                status: status,
                hitCount: 0, // Khởi tạo hitCount cho từng viên gạch
                opacity: 1, // Mức độ mờ của viên gạch (từ 0 đến 1, trong đó 1 là không mờ)
                shake: false // Trạng thái rung lắc của viên gạch
            };
            // Nếu viên gạch là màu gray và còn tồn tại trên màn hình, thêm vào mảng grayBricks
            if (status && brickColorsByLevel[level - 1][r % brickColorsByLevel[level - 1].length][c % brickColorsByLevel[level - 1][0].length] === COLORS.gray) {
                grayBricks.push(bricks[r][c]);
            }
        }
    }
}


// Sử dụng hàm creatBricks để khởi tạo viên gạch cho cấp độ ban đầu
creatBricks(1);

// Sử dụng màu từ mảng brickColors khi vẽ các ô gạch
function drawBricks() {
    const currentBrickColors = brickColorsByLevel[LEVEL - 1];
    // Tính toán vị trí căn giữa cho các viên gạch
    const totalWidth = brick.col * (brick.width + brick.offsetLeft) - brick.offsetLeft;
    const totalHeight = brick.row * (brick.height + brick.offsetTop) - brick.offsetTop;
    const startX = (canvas.width - totalWidth) / 2;
    const startY = 50; // Đặt vị trí y cố định cho các viên gạch

    // Lặp qua tất cả các viên gạch và vẽ chúng
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.col; c++) {
            const brickX = startX + c * (brick.width + brick.offsetLeft);
            const brickY = startY + r * (brick.height + brick.offsetTop);

            // Cập nhật lại vị trí của viên gạch trong mảng bricks
            bricks[r][c].x = brickX;
            bricks[r][c].y = brickY;

            const currentBrick = bricks[r][c];
            if (currentBrick.status) {
                const brickColor = currentBrickColors[r % currentBrickColors.length][c % currentBrickColors[0].length];
                ctx.fillStyle = brickColor;

                // Áp dụng mức độ mờ
                ctx.globalAlpha = currentBrick.opacity;

                // Vẽ viên gạch
                ctx.fillRect(brickX, brickY, brick.width, brick.height);

                // Áp dụng hiệu ứng rung lắc
                if (currentBrick.shake) {
                    const dx = Math.random() * 2 - 1; // Tạo số ngẫu nhiên từ -1 đến 1
                    const dy = Math.random() * 2 - 1; // Tạo số ngẫu nhiên từ -1 đến 1
                    ctx.translate(dx, dy);
                }

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(brickX, brickY, brick.width, brick.height);

                // Đặt lại transform để tránh ảnh hưởng đến các vẽ tiếp theo
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                // Đặt lại độ trong suốt cho các vẽ tiếp theo
                ctx.globalAlpha = 1;
            }
        }
    }
}

let SCORE = 0;
const SCORE_UNIT = 10;
// Set mạng cho người chơi
let LIFE = 5; 



// hàm xử lí va chạm quả bóng với viên gạch
function ballBrickCollision() {
    // Xử lí quả bóng chính với viên gạch
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.col; c++) {
            let b = bricks[r][c];
            if (b.status) {
                  // Tính toán các cạnh của viên gạch và quả bóng
                let brickLeft = b.x;
                let brickRight = b.x + brick.width;
                let brickTop = b.y;
                let brickBottom = b.y + brick.height;

                let ballTop = ball.y - ball.radius;
                let ballBottom = ball.y + ball.radius;
                let ballLeft = ball.x - ball.radius;
                let ballRight = ball.x + ball.radius;

                 // Kiểm tra va chạm giữa quả bóng và viên gạch
                let collision = ballRight >= brickLeft && ballLeft <= brickRight && ballBottom >= brickTop && ballTop <= brickBottom;
                if (collision) {
                     // Xác định tâm của quả bóng
                    let ballCenterX = ball.x;
                    let ballCenterY = ball.y;

                      // Kiểm tra va chạm theo chiều dọc và ngang
                    let verticalCollision = false;
                    let horizontalCollision = false;

                    if ((ballCenterX >= brickLeft && ballCenterX <= brickRight) &&
                        ((ballTop >= brickTop && ballTop <= brickBottom) || (ballBottom >= brickTop && ballBottom <= brickBottom))) {
                        verticalCollision = true;
                    }

                    if ((ballCenterY >= brickTop && ballCenterY <= brickBottom) &&
                        ((ballLeft >= brickLeft && ballLeft <= brickRight) || (ballRight >= brickLeft && ballRight <= brickRight))) {
                        horizontalCollision = true;
                    }

                    // Xử lí hướng di chuyển của quả bóng sau va chạm
                    if (verticalCollision) {
                        ball.dy = -ball.dy;
                    }
                    if (horizontalCollision) {
                        ball.dx = -ball.dx;
                    }

                    // Kiểm tra màu của viên gạch
                    if (brickColorsByLevel[LEVEL - 1][r % brickColorsByLevel[LEVEL - 1].length][c % brickColorsByLevel[LEVEL - 1][0].length] === COLORS.gray) {
                        // Nếu màu là gray và hitCount chưa đạt 2, tăng hitCount lên 1
                        if (b.hitCount < 2) {
                            b.hitCount++;

                            b.opacity = 0.5; // Thiết lập mức độ mờ
                            b.shake = true; // Thiết lập trạng thái rung lắc
                            // Đặt thời gian để kết thúc trạng thái rung lắc sau một khoảng thời gian nhất định
                            setTimeout(() => {
                                b.shake = false;
                            }, 200);

                            // Nếu hitCount đạt 2, đánh dấu viên gạch bị phá hủy và loại bỏ khỏi mảng grayBricks
                            if (b.hitCount === 2) {
                                b.status = false;
                                grayBricks = grayBricks.filter(grayBrick => grayBrick !== b);
                            }
                        }
                    } else {
                        // Nếu màu không phải là gray, phá hủy viên gạch ngay lập tức
                        b.status = false;
                        // Nếu viên gạch không phải màu gray, loại bỏ khỏi mảng grayBricks nếu tồn tại
                        grayBricks = grayBricks.filter(grayBrick => grayBrick !== b);
                    }

                    let randomPowerUp = getRandomPowerUp();
                    spawnPowerUp(b.x + brick.width / 2, b.y + brick.height / 2, brickColorsByLevel[LEVEL - 1][r % brickColorsByLevel[LEVEL - 1].length][c % brickColorsByLevel[LEVEL - 1][0].length], randomPowerUp);
                    SCORE += SCORE_UNIT;

                    // Thoát khỏi vòng lặp khi phát hiện va chạm để tránh xử lý các viên gạch khác cùng vị trí
                    break;
                }
            }
        }
    }
    // Xử lý va chạm cho các quả bóng mới
    for (let i = 0; i < balls.length; i++) {
        let currentBall = balls[i];
        for (let r = 0; r < brick.row; r++) {
            for (let c = 0; c < brick.col; c++) {
                let b = bricks[r][c];
                if (b.status) {
                    // Tính toán các cạnh của viên gạch và quả bóng phụ

                    let brickLeft = b.x;
                    let brickRight = b.x + brick.width;
                    let brickTop = b.y;
                    let brickBottom = b.y + brick.height;

                    let ballTop = currentBall.y - currentBall.radius;
                    let ballBottom = currentBall.y + currentBall.radius;
                    let ballLeft = currentBall.x - currentBall.radius;
                    let ballRight = currentBall.x + currentBall.radius;

                    // Kiểm tra va chạm giữa quả bóng phụ và viên gạch
                    let collision = ballRight >= brickLeft && ballLeft <= brickRight && ballBottom >= brickTop && ballTop <= brickBottom;
                    if (collision) {
                        // Xác định tâm của quả bóng phụ
                        let ballCenterX = currentBall.x;
                        let ballCenterY = currentBall.y;

                            // Kiểm tra va chạm theo chiều dọc và ngang
                        let verticalCollision = false;
                        let horizontalCollision = false;

                        if ((ballCenterX >= brickLeft && ballCenterX <= brickRight) &&
                            ((ballTop >= brickTop && ballTop <= brickBottom) || (ballBottom >= brickTop && ballBottom <= brickBottom))) {
                            verticalCollision = true;
                        }

                        if ((ballCenterY >= brickTop && ballCenterY <= brickBottom) &&
                            ((ballLeft >= brickLeft && ballLeft <= brickRight) || (ballRight >= brickLeft && ballRight <= brickRight))) {
                            horizontalCollision = true;
                        }

                         // Xử lí hướng di chuyển của quả bóng phụ sau va chạm
                        if (verticalCollision) {
                            currentBall.dy = -currentBall.dy;
                        }
                        if (horizontalCollision) {
                            currentBall.dx = -currentBall.dx;
                        }

                        // Kiểm tra màu của viên gạch
                        if (brickColorsByLevel[LEVEL - 1][r % brickColorsByLevel[LEVEL - 1].length][c % brickColorsByLevel[LEVEL - 1][0].length] === COLORS.gray) {
                            // Nếu màu là gray và hitCount chưa đạt 2, tăng hitCount lên 1
                            if (b.hitCount < 2) {
                                b.hitCount++;

                                b.opacity = 0.5; // Thiết lập mức độ mờ
                                b.shake = true; // Thiết lập trạng thái rung lắc
                                // Đặt thời gian để kết thúc trạng thái rung lắc sau một khoảng thời gian nhất định
                                setTimeout(() => {
                                    b.shake = false;
                                }, 200);

                                // Nếu hitCount đạt 2, đánh dấu viên gạch bị phá hủy và loại bỏ khỏi mảng grayBricks
                                if (b.hitCount === 2) {
                                    b.status = false;
                                    grayBricks = grayBricks.filter(grayBrick => grayBrick !== b);
                                }
                            }
                        } else {
                            // Nếu màu không phải là gray, phá hủy viên gạch ngay lập tức
                            b.status = false;
                            // Nếu viên gạch không phải màu gray, loại bỏ khỏi mảng grayBricks nếu tồn tại
                            grayBricks = grayBricks.filter(grayBrick => grayBrick !== b);
                        }

                        let randomPowerUp = getRandomPowerUp();
                        spawnPowerUp(b.x + brick.width / 2, b.y + brick.height / 2, brickColorsByLevel[LEVEL - 1][r % brickColorsByLevel[LEVEL - 1].length][c % brickColorsByLevel[LEVEL - 1][0].length], randomPowerUp);
                        SCORE += SCORE_UNIT;

                        // Thoát khỏi vòng lặp khi phát hiện va chạm để tránh xử lý các viên gạch khác cùng vị trí
                        break;
                    }
                }
            }
        }
    }

}

function getRandomPowerUp() {
    let powerUps = ["increase_paddle_width", "decrease_paddle_width", "increase_ball_quantity", "increase_ball_size", "decrease_ball_size", "paddleBackwards","extraTime","extraLife"]; // Các loại vật phẩm
    let randomIndex = Math.floor(Math.random() * powerUps.length); // Chọn ngẫu nhiên một index
    return powerUps[randomIndex]; // Trả về loại vật phẩm tại index được chọn
}

//--------------------------Xử lí vật phẩm

class PowerUp {
    constructor(x, y, color, type) {
        this.x = x;
        this.y = y;
        this.radius = 10; // Kích thước của vật phẩm
        this.color = color;
        this.type = type; // Loại vật phẩm
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.radius); // Điểm trên cùng
        ctx.lineTo(this.x + this.radius, this.y); // Điểm bên phải
        ctx.lineTo(this.x, this.y + this.radius); // Điểm dưới cùng
        ctx.lineTo(this.x - this.radius, this.y); // Điểm bên trái
        ctx.closePath();

        // Fill và vẽ đường viền
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'black'; // Màu đường viền
        ctx.stroke();
    }
}

function drawPowerUps() {
    for (let i = 0; i < powerUps.length; i++) {
        powerUps[i].draw();
    }
}

let powerUps = []; // Mảng chứa các vật phẩm
let powerUpCounter = 0;
// Tạo và vẽ vật phẩm khi viên gạch bị phá hủy
// Hàm để tạo vật phẩm
function spawnPowerUp(x, y, color, type) {
    let numberOfPowerUps = 0;

    switch (LEVEL) {
        case 1:
            numberOfPowerUps = 0;
            break;
        case 2:
            numberOfPowerUps = 1;
            break;
        case 3:
            numberOfPowerUps = 2;
            break;
        case 4:
            numberOfPowerUps = 3;
            break;
        case 5:
            numberOfPowerUps = 4;
            break;
        case 6:
            numberOfPowerUps = 5;
            break;
        // Thêm các trường hợp xử lý cho các level khác ở đây
        default:
            numberOfPowerUps = 0;
            break;
    }

    if (powerUpCounter >= numberOfPowerUps) {
        return; // Không tạo thêm vật phẩm nếu đã đạt đến số lượng giới hạn
    }

    let powerUp = new PowerUp(x, y, color, type); // Tạo một instance mới của lớp PowerUp
    powerUp.speed = 2; // Thiết lập tốc độ rơi của vật phẩm
    powerUps.push(powerUp); // Thêm vật phẩm vào mảng

    // Tăng biến đếm
    powerUpCounter++;
}


// Xử lý va chạm với vật phẩm
function handlePowerUpCollision() {
    for (let i = 0; i < powerUps.length; i++) {
        let pu = powerUps[i];
        // Kiểm tra va chạm với thanh đỡ
        if (pu.y + pu.radius >= paddle.y && pu.x >= paddle.x && pu.x <= paddle.x + paddle.width) {
            applyPowerUp(pu.type); // Áp dụng vật phẩm
            powerUps.splice(i, 1); // Xóa vật phẩm khỏi mảmovePaddle() ng khi va chạm
            i--; // Giảm chỉ số để tránh lỗi khi xóa phần tử trong vòng lặp
        }
    }
}
let paddleBackwardsActive = false;
let paddleBackwardsTimer = null;
let isPaddleBackwardsActive = false; // Biến để theo dõi trạng thái của vật phẩm di chuyển ngược paddle


// Áp dụng vật phẩm
function applyPowerUp(type) {
    switch (type) {
        case "increase_paddle_width":
            // paddle.width += 20;
            // tăng kíc thước thanh đỡ  thêm 20
            increasePaddleWidth();
            break;
        case "decrease_paddle_width":
            // paddle.width -= 20;
            // giảm kích thước  thanh đỡ xuống 20
            decreasePaddleWidth();
            break;
        case "increase_ball_quantity":
            // tăng số lượng bóng
            increaseBallQuantity();
            break;
        case "increase_ball_size":
            // tăng kích thước bóng
            increaseBallSize();
            break;
        case "decrease_ball_size":
            // giảm kích thước bóng
            decreaseBallSize();
            break;
        case "paddleBackwards":
            activatePaddleBackwards();
            break;
        case "extraLife":
            // Áp dụng vật phẩm cộng thêm 1 mạng
            applyExtraLife();
            break;
        case "extraTime":
            // Áp dụng vật phẩm cộng thêm 1 mạng
            applyExtraTime();
            break;
        // Thêm các trường hợp xử lý cho các loại vật phẩm khác ở đây
    }
}

// Xử lý hiệu ứng của vật phẩm khi thanh đỡ đỡ được
function applyExtraLife() {
    // Tăng số mạng lên 1
    LIFE++;
}

function applyExtraTime() {
    // Tăng số mạng lên 1
   
    timeLeft+=10;
}

function activatePaddleBackwards() {
    isPaddleBackwardsActive = true; // Kích hoạt vật phẩm di chuyển ngược paddle
    // Đảo ngược hướng di chuyển của paddle
    let temp = leftPress;
    leftPress = rightPress;
    rightPress = temp;
    // Thiết lập timeout để vô hiệu hóa vật phẩm sau một khoảng thời gian
    setTimeout(deactivatePaddleBackwards, 5000); // Ví dụ: vô hiệu hóa sau 5 giây
}

function deactivatePaddleBackwards() {
    isPaddleBackwardsActive = false; // Vô hiệu hóa vật phẩm di chuyển ngược paddle
    // Đảo ngược lại hướng di chuyển của paddle để trở về trạng thái ban đầu
    let temp = leftPress;
    leftPress = rightPress;
    rightPress = temp;
}
// Hàm tăng kích thước thanh đỡ
function increasePaddleWidth() {
    paddle.width += 20; // Tăng kích thước thanh đỡ
}

function decreasePaddleWidth() {
    paddle.width -= 20 // Tăng kích thước thanh đỡ
}

// Hàm tăng số lượng quả bóng lên 3 quả
let balls = [];
function increaseBallQuantity() {
    // Tạo thêm 2 quả bóng mới
    for (let i = 0; i < 2; i++) {
        let newBall = {
            x: canvas.width / 2,
            y: paddle.y - BALL_RADIUS,
            radius: BALL_RADIUS,
            speed: 2,
            dx: Math.random() < 0.5 ? -3 : 3, // randomize direction
            dy: -3
        };
        balls.push(newBall);
    }
}


// Hàm tăng kích thước của quả bóng
function increaseBallSize() {
    // Tăng kích thước của tất cả các quả bóng trong mảng balls
    ball.radius += 7;
    for (let i = 0; i < balls.length; i++) {
        balls[i].radius += 8; // Tăng kích thước của quả bóng
    }
}

// Hàm giảm kích thước của quả bóng
function decreaseBallSize() {
    // Giảm kích thước của tất cả các quả bóng trong mảng balls
    let limitSize = 3;
    if (ball.radius > limitSize) {
        ball.radius -= 3;
    }

    for (let i = 0; i < balls.length; i++) {
        balls[i].radius -= 5; // Giảm kích thước của quả bóng
    }
}

// Logic để xử lý vật phẩm rơi xuống
function handlePowerUps() {
    for (let i = 0; i < powerUps.length; i++) {
        let powerUp = powerUps[i];
        powerUp.y += powerUp.speed; // Di chuyển vật phẩm xuống dưới

        // Kiểm tra va chạm với thanh đỡ
        if (powerUp.x + powerUp.width >= paddle.x &&
            powerUp.x <= paddle.x + paddle.width &&
            powerUp.y + powerUp.height >= paddle.y &&
            powerUp.y <= paddle.y + paddle.height) {
            // Xử lý hiệu ứng của vật phẩm khi thanh đỡ đỡ được
            applyPowerUp(powerUp.type);
            // Xóa vật phẩm khỏi mảng khi nó được đỡ
            powerUps.splice(i, 1);
            i--;
        }

        // Kiểm tra xem vật phẩm có đi ra khỏi màn hình không
        if (powerUp.y + powerUp.height >= canvas.height) {
            // Nếu vật phẩm ra khỏi màn hình, xóa nó khỏi mảng
            powerUps.splice(i, 1);
            i--;
        }
    }
}

let timeLeft = 120; // Thời gian ban đầu là 60s
let countdownInterval; // Biến interval đếm ngược

let countdownStarted = false; // Biến kiểm tra xem đếm ngược đã được khởi động hay chưa
let isCountingDown = true; // Biến để theo dõi trạng thái của đếm ngược


function startCountdown() {
    if (!countdownStarted) { // Kiểm tra xem đếm ngược đã được khởi động chưa
        countdownStarted = true; // Đánh dấu rằng đếm ngược đã được khởi động
        isCountingDown = true; // Bắt đầu đếm ngược
        countdownInterval = setInterval(function () {
            if (isCountingDown && isBallMoving) {
                timeLeft--; // Giảm thời gian còn lại
                if (timeLeft <= 0) { // Kiểm tra nếu hết thời gian

                    gameOver(); // Gọi hàm game over
                }
            }
        }, 1000); // Cập nhật thời gian còn lại mỗi 1 giây (1000ms)
    }
}

// ------------SCORE,LIVES---------------
const SCORE_IMG = new Image();
SCORE_IMG.src = "img/score.png";
SCORE_IMG.width = 15;

const CLOCK_IMG = new Image();
CLOCK_IMG.src = "img/clock.png";
CLOCK_IMG.width = 15;

const LIFE_IMG = new Image();
LIFE_IMG.src = "img/live.png";

const LEVEL_IMG = new Image();
LEVEL_IMG.src = "img/level.png";


const MENU_IMG = new Image();
MENU_IMG.src = "img/menu.png";

function showGameStats(text, textX, textY, img, imgX, imgY) {
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);
    ctx.drawImage(img, imgX, imgY, 25, 25);
}
function areThereBricksLeft() {
    let allBricksDestroyed = true; // Tạo biến để kiểm tra tất cả các viên gạch đã bị phá hủy hay chưa
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.col; c++) {
            allBricksDestroyed = allBricksDestroyed && !bricks[r][c].status; // Kiểm tra nếu một viên gạch nào đó còn tồn tại, thì không thể level up
        }
    }
}

// Game Over
let GAME_OVER = false;
function gameOver() {
    if (LIFE <= 0 || (timeLeft <= 0 && !areThereBricksLeft())) { 
        GAME_OVER = true;
        showLose();
    }
}

// Level up
let LEVEL = 1;
const MAX_LEVEL = 6;
function levelUp() {
    let allBricksDestroyed = true; // Tạo biến để kiểm tra tất cả các viên gạch đã bị phá hủy hay chưa
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.col; c++) {
            allBricksDestroyed = allBricksDestroyed && !bricks[r][c].status; // Kiểm tra nếu một viên gạch nào đó còn tồn tại, thì không thể level up
        }
    }

    // Nếu tất cả các viên gạch đã bị phá hủy và cấp độ chưa vượt quá cấp độ tối đa, thì tăng cấp độ
    if (allBricksDestroyed && LEVEL < MAX_LEVEL) {
        creatBricks(LEVEL + 1); // Tạo layout cho cấp độ tiếp theo
        resetBall();
        // ball.speed += 0.2; 
        LEVEL++;
        timeLeft = 120;
        numberOfPowerUps = calculateNumberOfPowerUps(); // Reset numberOfPowerUps khi cập nhật level
        resetPowerUpCounter(); // Reset biến đếm số lượng vật phẩm
        resetPowerUps(); // Xóa tất cả các vật phẩm hiện có
        LIFE = 5;
        // Sau khi cập nhật cấp độ mới, vẽ lại các viên gạch
        drawBricks();
        startCountdown();
    } else if (allBricksDestroyed && LEVEL >= MAX_LEVEL) { // Nếu tất cả các viên gạch đã bị phá hủy và đạt cấp độ tối đa, thông báo chiến thắng
        showWon();
        GAME_OVER = true;
    }
}
// Hàm để tính toán số lượng vật phẩm dựa trên level
function calculateNumberOfPowerUps() {
    let numberOfPowerUps = 0;
    switch (LEVEL) {
        case 1:
            numberOfPowerUps = 0;
            break;
        case 2:
            numberOfPowerUps = 1;
            break;
        case 3:
            numberOfPowerUps = 2;
            break;
        case 4:
            numberOfPowerUps = 3;
            break;
        case 5:
            numberOfPowerUps = 4;
            break;
        case 6:
            numberOfPowerUps = 5;
            break;
        // Thêm các trường hợp xử lý cho các level khác ở đây
        default:
            numberOfPowerUps = 0;
            break;
    }

    return numberOfPowerUps;
}

// Hàm để reset biến đếm số lượng vật phẩm
function resetPowerUpCounter() {
    powerUpCounter = 0;
}

// Hàm để xóa tất cả các vật phẩm hiện có
function resetPowerUps() {
    powerUps = [];
}

const endgame = document.getElementById("endgame");
const won = document.getElementById("won");
const lose = document.getElementById("lose");
const restart = document.getElementById("restart");
restart.addEventListener("click", function () {
    location.reload();
});
function showWon() {
    endgame.style.display = "block";
    won.style.display = "block";
    lose.style.display = "none";
}
function showLose() {
    endgame.style.display = "block";
    won.style.display = "none";
    lose.style.display = "block";
}

//--------------------------------------

const BG_IMG = new Image();
BG_IMG.src = "img/back-ground.jpg";

function draw() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Vẽ thanh đỡ
    drawPaddle();
    // Vẽ quả bóng chính
    drawBall(ball);

    // Vẽ các quả bóng từ mảng balls
    for (let i = 0; i < balls.length; i++) {
        drawBall(balls[i]);
    }
    moveAllBalls();

    drawBricks();
    drawPowerUps();

    showGameStats(SCORE, 85, 45, SCORE_IMG, 45, 25);
    showGameStats(timeLeft, 85, 85, CLOCK_IMG, 45, 65);

    showGameStats(LEVEL, canvas.width - 35, 45, LEVEL_IMG, canvas.width - 75, 25);
    showGameStats(LIFE, canvas.width - 45, 85, LIFE_IMG, canvas.width - 75, 65);
    showGameStats('', canvas.width - 45, 100, MENU_IMG, canvas.width - 75, 105);

}
function update() {
    movePaddle(); // Di chuyển thanh đỡ
    moveBall(ball);// Di chuyển quả bóng

    ballWallCollision();
    // newBallsWallCollision()
    ballPaddleColision(); // Xử lý va chạm quả bóng với thanh đỡ
    ballBrickCollision();// Xử lý va chạm quả bóng với viên gạch
    handlePowerUpCollision(); // Xử lý va chạm với vật phẩm

    gameOver();
    levelUp();
    handlePowerUps(); // Xử lý vật phẩm rơi xuống
    // draw(); 
}
function loop() {
    // clear canvas
    ctx.drawImage(BG_IMG, 0, 0);
    draw();
    update();
    if (!GAME_OVER) {
        requestAnimationFrame(loop);
    }

}
// Thêm sự kiện click vào canvas
MENU_IMG.onload = function () {
    const imageWidth = MENU_IMG.width;
    const imageHeight = MENU_IMG.height;

    // Thêm sự kiện click vào canvas
    canvas.addEventListener('click', function (event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Kiểm tra xem điểm click có nằm trong vùng hình ảnh menu không
        if (mouseX >= canvas.width - 75 && mouseX <= canvas.width - 75 + imageWidth &&
            mouseY >= 105 && mouseY <= 105 + imageHeight) {
            // Hiển thị hoặc ẩn menu level
            // isBallMoving=false
            document.getElementById("notif").style.display = "block";
            document.getElementById("sub-choose").style.display = "block";

            document.getElementById("choose-level").style.display = "none";

            document.getElementById("about-me").style.display = "none";


            // Hiển thị container chứa trò chơi
        }
    });
};



let isGameActive = false;
function chooseLevel(level) {
    LEVEL = level; // Cập nhật level với level được chọn
    document.getElementById("notif").style.display = "none"; // Ẩn menu chọn level
    resetBall()
    creatBricks(level); // Tạo layout cho level đã chọn
    isGameActive = true;
    numberOfPowerUps = calculateNumberOfPowerUps(); // Reset numberOfPowerUps khi cập nhật level
    resetPowerUpCounter(); // Reset biến đếm số lượng vật phẩm
    resetPowerUps(); // Xóa tất cả các vật phẩm hiện có
    SCORE = 0;
    timeLeft = 120;
    LIFE = 5;

    startCountdown();
    loop(); // Bắt đầu vòng lặp trò chơi

}


function startGame() {
    // GAME_OVER = true;
    document.getElementById("start").style.display = "none"; // Ẩn nút "Start"
    document.getElementById("container").style.display = "block"; // Hiển thị container chứa trò chơi


    // resetBall()
}
function chooseNotif1() {
    document.getElementById("choose-level").style.display = "block";
    document.getElementById("about-me").style.display = "none";
    document.getElementById("sub-choose").style.display = "none";

}

function chooseNotif2() {

    document.getElementById("choose-level").style.display = "none";
    document.getElementById("about-me").style.display = "block";


}
function closeButtonAbout() {
    // document.getElementById("sub-choose").style.display = "block";
    // document.getElementById("about-me").style.display = "none";
    document.getElementById("notif").style.display = "none";
}
function closeButtonNotif() {
    if (!isGameActive) {
        document.getElementById("notif").style.display = "none"; // Ẩn menu chọn level
        resetBall()
        creatBricks(1); // Tạo layout cho level đã chọn
        SCORE = 0;
        timeLeft = 120;
        LIFE = 5;

        startCountdown();
        loop(); // Bắt đầu vòng lặp trò chơi
    } else
        if (isGameActive) {
            // Nếu người chơi đã chọn level,     ẩn notification
            document.getElementById("notif").style.display = "none";
        }
}

function closeChooseLevel() {
    document.getElementById("notif").style.display = "none";
    // document.getElementById("about-me").style.display = "none";
}



// startGame();
