class Camera2D {
  constructor(viewW, viewH) {
    this.viewW = viewW;
    this.viewH = viewH;
    this.x = 0;
    this.y = 0;
  }
  update() {
    this.x += 2;
  }

  clampToWorld(worldW, worldH) {
    const maxX = max(0, worldW - this.viewW);
    this.x = constrain(this.x, 0, maxX);
  }

  begin() {
    push();
    translate(-this.x, -this.y);
  }
  end() {
    pop();
  }
}
