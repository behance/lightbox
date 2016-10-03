import 'style!../sass/lightbox.scss';
import Lightbox from './Lightbox';

export default {
  init(props) {
    return new Lightbox(props);
  }
};
