let particles = [];
let hasInteracted = false;
let instructionAlpha = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textAlign(CENTER, CENTER);
}

function draw() {
  // 背景の透明度を少し下げて「残像（香りの余韻）」を長めに設定
  background(255, 245, 250, 20); 

  // まだ触っていない時だけガイドを表示
  if (!hasInteracted) {
    drawInstruction();
  }

  // タップ中、新しい粒子を生成
  if (mouseIsPressed || (touches.length > 0)) {
    hasInteracted = true;
    particles.push(new FlowerParticle(mouseX, mouseY));
  }

  // 粒子の更新と描画
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }
}

// ガイド文字（最前面）
function drawInstruction() {
  push();
  fill(150, 100, 120, instructionAlpha); 
  textSize(16);
  // 文字がよりはっきり出るように少し太めのフォントを指定
  textFont('sans-serif');
  text("Gently tap to release the fragrance...", width / 2, height / 2);
  
  // 呼吸のようなゆったりした点滅
  instructionAlpha = 150 + 100 * sin(frameCount * 0.03);
  pop();
}

class FlowerParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // 横への広がり
    this.vx = random(-0.8, 0.8);
    
    // 【上昇と下降のランダム】
    // 負の数で上昇、正の数で下降します。ゆっくりした動きに設定。
    this.vy = random(-1.2, 1.2); 

    this.alpha = 255;
    // スプリングフローラルの甘い色合い（ピンク、ラベンダー、淡いイエロー）
    this.color = color(random(230, 255), random(180, 220), random(210, 250));
    this.size = random(10, 30);
    
    // 形状のランダム (0:丸, 1:桜, 2:ユリ風)
    this.type = floor(random(3)); 
    // 回転速度もランダムにして優雅に
    this.rotationSpeed = random(-0.02, 0.02);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // 【ゆっくり消える設定】
    // ここを 0.8 にすることで、長い間画面に花が残ります
    this.alpha -= 0.8; 
    
    // わずかに大きくしていく（香りが空間に馴染む様子）
    this.size += 0.05;
  }

  show() {
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    push();
    translate(this.x, this.y);
    rotate(frameCount * this.rotationSpeed); 
    
    if (this.type === 0) {
      // 1. 香りの粒子（丸）
      ellipse(0, 0, this.size);
    } else if (this.type === 1) {
      // 2. 桜🌸風
      for (let a = 0; a < TWO_PI; a += TWO_PI / 5) {
        let hx = cos(a) * this.size / 2.5;
        let hy = sin(a) * this.size / 2.5;
        ellipse(hx, hy, this.size / 1.5, this.size / 1.2);
      }
    } else {
      // 3. ユリ/星型風
      for (let a = 0; a < TWO_PI; a += TWO_PI / 4) {
        let hx = cos(a) * this.size / 1.8;
        let hy = sin(a) * this.size / 1.8;
        ellipse(hx/2, hy/2, this.size/2, this.size);
      }
    }
    pop();
  }

  finished() {
    return this.alpha < 0;
  }
}