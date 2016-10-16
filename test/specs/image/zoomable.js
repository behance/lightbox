import $ from 'jquery';
import { onImgLoad } from '../../../src/image/onImgLoad';
import {
  ZOOMABLE_CLASS,
  ZOOMABLE_X_CLASS,
  ZOOMABLE_Y_CLASS,
  getZoomableClasses
} from '../../../src/image/zoomable';

const FIXTURE = `
  <div id="container">
    <!-- NATURAL IMAGE DIM: 250 x 250 -->
    <img src="/base/test/fixtures/images/img_1.png" />
  </div>
`;

describe('image/zoomable', function() {
  describe('getZoomableClasses', function() {
    beforeEach(function(done) {
      setFixtures(FIXTURE);
      this.$cnt = $('#container');
      this.$img = this.$cnt.find('img');
      onImgLoad(this.$img, done);
    });

    it('should return if image is less than or equal to viewarea', function() {
      this.$cnt.css({ width: 250, height: 250 });
      expect(getZoomableClasses(this.$img[0], this.$cnt)).toBeUndefined();
    });

    it('should return a ZOOMABLE_CLASS if image is more than the viewarea', function() {
      this.$cnt.css({ width: 249, height: 250 });
      const classes = getZoomableClasses(this.$img[0], this.$cnt);
      expect(classes).toMatch(ZOOMABLE_CLASS);
      expect(classes).toMatch(ZOOMABLE_X_CLASS);
    });

    it('should return a ZOOMABLE_CLASS if image is more than the viewarea', function() {
      this.$cnt.css({ width: 250, height: 249 });
      const classes = getZoomableClasses(this.$img[0], this.$cnt);
      expect(classes).toMatch(ZOOMABLE_CLASS);
      expect(classes).toMatch(ZOOMABLE_Y_CLASS);
    });
  });
});
