class Drop {
  constructor({
    x,
    y,
    imageSrc,
    width = 16,
    height = 16,
    velocity = { x: 0, y: 0 }, // px/sec
    collectDelay = 0.25, // seconds
    lifeTime = 30, // seconds before auto-remove/fade
  }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.velocity = velocity
    this.collectDelay = collectDelay
    this.collectElapsed = 0
    this.collectible = collectDelay <= 0
    this.lifeTime = lifeTime
    this.elapsed = 0
    this.alpha = 1
    this.dead = false

    this.image = new Image()
    this.loaded = false
    this.image.onload = () => { this.loaded = true }
    this.image.onerror = (e) => { console.error('Drop image failed to load:', imageSrc, e) }
    this.image.src = imageSrc
  }

  update(deltaTime) {
    if (!deltaTime) return
    // movement (px/sec)
    this.x += (this.velocity.x || 0) * deltaTime
    this.y += (this.velocity.y || 0) * deltaTime

    // collect delay
    if (!this.collectible) {
      this.collectElapsed += deltaTime
      if (this.collectElapsed >= this.collectDelay) this.collectible = true
    }

    // lifetime / fade
    this.elapsed += deltaTime
    if (this.elapsed > this.lifeTime) {
      this.alpha -= 0.5 * deltaTime
      if (this.alpha <= 0) this.dead = true
    }
  }

  draw(c) {
    if (!this.loaded) return
    c.save()
    c.globalAlpha = this.alpha
    c.drawImage(this.image, this.x, this.y, this.width, this.height)
    c.restore()
  }

  collidesWith(entity) {
    return (
      this.x < entity.x + entity.width &&
      this.x + this.width > entity.x &&
      this.y < entity.y + entity.height &&
      this.y + this.height > entity.y
    )
  }
}