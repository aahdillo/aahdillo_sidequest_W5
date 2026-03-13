class BlobPlayer {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.r = 26;
    this.vx = 0;
    this.vy = 0;

    this.accel = 0.4;
    this.maxRun = 3.5;

    this.gravity = 0.5;
    this.frictionAir = 0.98;

    // wobble visuals
    this.t = 0;
    this.tSpeed = 0.01;
    this.wobble = 6;
    this.points = 48;
    this.wobbleFreq = 0.9;
  }

  spawnFromLevel(level) {
    this.x = level.start.x;
    this.y = level.start.y;
    this.r = level.start.r;

    this.vx = 0;
    this.vy = 0;

    this.gravity = level.gravity;
  }

  tryJump() {
    if (this.onGround) {
      this.vy = this.jumpV;
      this.onGround = false;
    }
  }

  update(level) {
    // input
    let move = 0;
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) move -= 1;
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) move += 1;

    this.vx += this.accel * move;
    this.vx *= this.frictionAir;
    this.vx = constrain(this.vx, -this.maxRun, this.maxRun);

    this.vy += this.gravity;

    if (keyIsDown(32)) {
      this.vy -= 1.2;
    }

    this.vy *= 0.98;
    this.vy = constrain(this.vy, -6, 8);

    // collider box
    let box = {
      x: this.x - this.r,
      y: this.y - this.r,
      w: this.r * 2,
      h: this.r * 2,
    };

    // move X
    box.x += this.vx;
    for (const s of level.platforms) {
      if (BlobPlayer.overlap(box, s)) {
        if (this.vx > 0) box.x = s.x - box.w;
        else if (this.vx < 0) box.x = s.x + s.w;
        this.vx = 0;
      }
    }

    // move Y
    box.y += this.vy;
    for (const s of level.platforms) {
      if (BlobPlayer.overlap(box, s)) {
        if (this.vy > 0) {
          box.y = s.y - box.h;
          this.vy = 0;
        } else if (this.vy < 0) {
          box.y = s.y + s.h;
        }
        this.vy = 0;
      }
    }

    // write back
    this.x = box.x + box.w / 2;
    this.y = box.y + box.h / 2;

    // keep inside world horizontally, allow falling below world
    this.x = constrain(this.x, this.r, level.w - this.r);

    this.t += this.tSpeed;
  }

  draw(colHex) {
    fill(color(colHex));
    noStroke();
    push();
    translate(this.x, this.y);
    rotate(map(this.vy, -6, 6, -0.3, 0.3));
    beginShape();
    for (let i = 0; i < this.points; i++) {
      const a = (i / this.points) * TAU;
      const n = noise(
        cos(a) * this.wobbleFreq + 100,
        sin(a) * this.wobbleFreq + 100,
        this.t
      );
      const rr = this.r + map(n, 0, 1, -this.wobble, this.wobble);
      vertex(cos(a) * rr, sin(a) * rr);
    }
    endShape(CLOSE);
    pop();
  }

  static overlap(a, b) {
    return (
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    );
  }
}
