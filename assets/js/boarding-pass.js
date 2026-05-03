class BoardingPass {
  constructor({ stubId, destination, threshold = 150 }) {
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
  }

  _onMove(e) {
    if (!this.isDragging) return;
    var x = e.type === 'mousemove' ? e.pageX : (e.touches ? e.touches[0].pageX : 0);
    var diff = x - this.startX;

    if (diff > 0) {
      this.currentX = diff;
      var rotation = (diff / this.threshold) * 15;
      this.stub.style.transform = 'translateX(' + diff + 'px) rotate(' + rotation + 'deg)';
      if (diff > this.threshold) {
        this.stub.style.opacity = 1 - (diff - this.threshold) / 100;
      }
    }
  }

  _onEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    document.body.style.userSelect = '';

    if (this.currentX > this.threshold) {
      this.stub.style.transition = 'all 0.5s ease-in';
      this.stub.style.transform = 'translateX(500px) rotate(30deg)';
      this.stub.style.opacity = '0';
      setTimeout(() => { window.location.href = this.destination; }, 300);
    } else {
      this.stub.classList.remove('is-tearing');
      this.stub.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      this.stub.style.transform = 'none';
      this.stub.style.opacity = '1';
    }
    this.currentX = 0;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  new BoardingPass({
    stubId: 'boarding-pass-stub',
    destination: 'https://clr4takeoff.github.io/portfolio/'
  });
});
