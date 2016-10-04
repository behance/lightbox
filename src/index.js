import 'style!../sass/lightbox.scss';
import $ from 'jquery';
import Controller from './Controller';
import ChromeView from './ChromeView';

export default {
  init(props) {
    props = Object.assign({
      context: document.body,
      idleTimeInMs: 5000,
      imageSelector: '.js-lightbox',
      imageSrcDataAttr: 'src',
      bgColor: '#fff',
      opacity: '0.94',
      isCircular: true
    }, props);

    const $context = $(props.context);
    const controller = new Controller($context, props);
    new ChromeView($context, controller, props);

    return controller;
  }
};
