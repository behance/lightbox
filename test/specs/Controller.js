import Controller from '../../src/Controller';

const FIXTURE = `
  <div id="container">
    <div>
      <img />
      <img />
      <img />
    </div>
  </div>
`;

describe('Controller', function() {
  beforeEach(function() {
    const fixture = setFixtures(FIXTURE);
    this.$context = fixture.find('#container');
    this.unit = new Controller(this.$context, {
      slideSelector: 'img'
    });
  });

  afterEach(function() {
    this.unit.destroy();
  });

  describe('open', function() {
    it('should trigger an "open" event', function(done) {
      this.unit.on('open', done);
      this.unit.open(0);
    });
  });

  describe('close', function() {
    it('should trigger an "close" event', function(done) {
      this.unit.on('close', done);
      this.unit.open(0);
      this.unit.close();
    });
  });

  describe('next', function() {
    it('should trigger a "activate" event', function(done) {
      this.unit.on('activate', (slide) => {
        expect(slide.id).toBe(1);
        done();
      });
      this.unit.open(0);
      this.unit.next();
    });
  });

  describe('prev', function() {
    it('should trigger a "prev" event', function(done) {
      this.unit.on('activate', (slide) => {
        expect(slide.id).toBe(0);
        done();
      });
      this.unit.open(1);
      this.unit.prev();
    });
  });

  describe('off', function() {
    it('should remove an event listener', function(done) {
      this.unit.on('open', () => done.fail('should have removed listener'));
      this.unit.off('open');
      setTimeout(done, 0);
      this.unit.open(0);
    });
  });
});
