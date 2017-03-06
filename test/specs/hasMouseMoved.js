import hasMouseMoved from '../../src/hasMouseMoved';
import { lastMousePosition } from '../../src/hasMouseMoved';

describe('image/hasMouseMoved', function() {
  function reset() {
    delete lastMousePosition.x;
    delete lastMousePosition.y;
    this._currentPosition = { clientX: 33, clientY: 33 };
  }

  beforeAll(reset);
  afterEach(reset);

  it('should be false if the mouse has not moved', function() {
    lastMousePosition.x = 33;
    lastMousePosition.y = 33;
    expect(hasMouseMoved(this._currentPosition)).toBe(false);
  });

  it('should be true if the mouse has not moved by x', function() {
    lastMousePosition.x = 20;
    lastMousePosition.y = 33;
    expect(hasMouseMoved(this._currentPosition)).toBe(true);
  });

  it('should be true if the mouse has not moved by y', function() {
    lastMousePosition.x = 33;
    lastMousePosition.y = 20;
    expect(hasMouseMoved(this._currentPosition)).toBe(true);
  });

  it('should be true if the mouse has moved', function() {
    lastMousePosition.x = 7;
    lastMousePosition.y = 7;
    expect(hasMouseMoved(this._currentPosition)).toBe(true);
  });
});
