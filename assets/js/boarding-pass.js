class BoardingPass {
  constructor({ stubId, destination, threshold = 200 }) {
    this.stub = document.getElementById(stubId);
    this.destination = destination;
    this.threshold = threshold;
    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;

    if (!this.stub) return;
    this._bindEvents();
  }

  _bindEvents() {
    this.stub.addEventListener('mousedown', this._onStart.bind(this));
    this.stub.addEventListener('touchstart', this._onStart.bind(this), { passive: true });
    window.addEventListener('mousemove', this._onMove.bind(this));
    window.addEventListener('touchmove', this._onMove.bind(this), { passive: false });
    window.addEventListener('mouseup', this._onEnd.bind(this));
    window.addEventListener('touchend', this._onEnd.bind(this));
  }

  _onStart(e) {
    this.isDragging = true;
    this.startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
    this.stub.classList.add('is-tearing');
    this.stub.style.transition = 'none';
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  }

  _onMove(e) {
    if (!this.isDragging) return;
    var x = e.type === 'mousemove' ? e.pageX : (e.touches ? e.touches[0].pageX : 0);
    var diff = x - this.startX;

    if (diff > 0) {
      this.currentX = diff;
      var rotation = (diff / this.threshold) * 20;
      this.stub.style.transform = 'translateX(' + diff + 'px) rotate(' + rotation + 'deg)';
      
      // Dramatic visual feedback as we approach threshold
      if (diff > this.threshold) {
        var progress = (diff - this.threshold) / 100;
        this.stub.style.opacity = 1 - progress;
        this.stub.style.filter = 'brightness(' + (1 + progress * 0.5) + ')';
      } else {
        this.stub.style.opacity = '1';
        this.stub.style.filter = 'none';
      }
    }
  }

  _onEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    if (this.currentX > this.threshold) {
      // Successfully torn
      this.stub.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
      this.stub.style.transform = 'translateX(1000px) rotate(45deg)';
      this.stub.style.opacity = '0';
      
      // Delay redirection to show animation
      setTimeout(() => { 
        window.location.href = this.destination; 
      }, 400);
    } else {
      // Snap back
      this.stub.classList.remove('is-tearing');
      this.stub.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease';
      this.stub.style.transform = 'none';
      this.stub.style.opacity = '1';
      this.stub.style.filter = 'none';
    }
    this.currentX = 0;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // If we are on the portfolio page, maybe the destination should be different?
  // But per user request, we point to the portfolio site.
  var dest = 'https://clr4takeoff.github.io/portfolio/';
  
  // Optional: check if we are already at the destination
  if (window.location.href.includes('/portfolio/')) {
    // If on portfolio already, maybe go to a specific project or home?
    // The user said "move to portfolio site", so we'll keep it for now.
  }

  new BoardingPass({
    stubId: 'boarding-pass-stub',
    destination: dest
  });
});

