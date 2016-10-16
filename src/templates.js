import 'style!../sass/spinner.scss';

const backdrop = `
  <div class="js-blocking" id="lightbox-blocking">
    <span class="lightbox-spinner"></span>
  </div>
`;

const prevControl = `
  <div class="control prev js-control js-prev">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" width="60" height="60" viewBox="0 0 60 60" xml:space="preserve">
      <circle class="lightbox-icon-bg" cx="30" cy="30" r="30"/>
      <path class="lightbox-icon-arrow" d="M36.8,36.4L30.3,30l6.5-6.4l-3.5-3.4l-10,9.8l10,9.8L36.8,36.4z"/>
    </svg>
  </div>
`;

const nextControl = `
  <div class="control next js-control js-next">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" width="60" height="60" viewBox="0 0 60 60" xml:space="preserve">
      <circle class="lightbox-icon-bg" cx="30" cy="30" r="30"/>
      <path class="lightbox-icon-arrow" d="M24.2,23.5l6.6,6.5l-6.6,6.5l3.6,3.5L37.8,30l-10.1-9.9L24.2,23.5z"/>
    </svg>
  </div>
`;

const closeControl = `
  <div class="control close js-control js-close">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <circle class="lightbox-icon-bg" cx="50" cy="50" r="47.5"/>
      <polygon class="lightbox-icon-close" points="64.5,39.8 60.2,35.5 50,45.7 39.8,35.5 35.5,39.8 45.7,50 35.5,60.2 39.8,64.5 50,54.3 60.2,64.5 64.5,60.2 54.3,50"/>
    </svg>
  </div>
`;

export const lightbox = `
  <div class="js-lightbox-wrap offscreen" id="lightbox-wrap">
    ${backdrop}
    <div class="js-lightbox-inner-wrap" id="lightbox-inner-wrap">
      <div class="js-img-wrap" id="lightbox-img-wrap">
        ${prevControl}
        ${nextControl}
        ${closeControl}
        <div class="lightbox-contents js-contents"></div>
      </div>
    </div>
  </div>
`;
