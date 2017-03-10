import 'style-loader!../sass/lightbox.scss';
import $ from 'jquery';
import Controller from './Controller';
import ChromeView from './ChromeView';

export default {
  init(props) {
    props = Object.assign({
      context: document.body,
      slideContentSelector: '.js-lightbox-slide-content',
      slideSelector: '.js-lightbox',
      bgColor: '#fff',
      opacity: '0.94',
      idleTimeInMs: 5000,
      isCircular: true,
      hoverIconEnabled: true
    }, props);

    const $context = $(props.context);
    const controller = new Controller($context, props);
    new ChromeView($context, controller, props);

    return controller;
  }
};
