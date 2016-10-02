const backdrop = `
  <div class="js-blocking" id="lightbox-blocking"></div>
`;

const prevControl = `
  <div class="control prev js-control js-prev">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" width="60" height="60" viewBox="0 0 60 60" xml:space="preserve">
      <circle class="lightbox-icon-bg" cx="30" cy="30" r="30"/>
      <path class="lightbox-icon-arrow" d="M28.6 30l7.9-7.9c0.5-0.5 0.7-1.1 0.7-1.7s-0.2-1.2-0.7-1.7c-0.9-0.9-2.5-0.9-3.4 0l-9.6 9.6c-0.5 0.5-0.7 1.1-0.7 1.7s0.2 1.2 0.7 1.7l9.6 9.6c0.9 0.9 2.5 0.9 3.4 0 0.5-0.5 0.7-1.1 0.7-1.7 0-0.6-0.2-1.2-0.7-1.7L28.6 30z"/>
    </svg>
  </div>
`;

const nextControl = `
  <div class="control next js-control js-next">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" width="60" height="60" viewBox="0 0 60 60" xml:space="preserve">
      <circle class="lightbox-icon-bg" cx="30" cy="30" r="30"/>
      <path class="lightbox-icon-arrow" d="M31.4 30l-7.9 7.9c-0.5 0.5-0.7 1.1-0.7 1.7 0 0.6 0.2 1.2 0.7 1.7 0.9 0.9 2.5 0.9 3.4 0l9.6-9.6c0.5-0.5 0.7-1.1 0.7-1.7s-0.2-1.2-0.7-1.7l-9.6-9.6c-0.9-0.9-2.5-0.9-3.4 0 -0.5 0.5-0.7 1.1-0.7 1.7 0 0.6 0.2 1.2 0.7 1.7L31.4 30z"/>
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
  <div class="js-lightbox-wrap" id="lightbox-wrap">
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
