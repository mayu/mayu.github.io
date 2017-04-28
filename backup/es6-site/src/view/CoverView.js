/* eslint max-len: "off" */
const cover = (props) => (`
  <div class="cover">
    <div class="cover-img">
      <img
        src='${props.cover.src}'
        style="
          width: ${props.cover.width};
          top: ${props.cover.top};
          left: ${props.cover.left};
        "
      />
    </div>
    <div class="cover-content">
      <div class="cover-top">
        <div class="cover-name">Sartaj Chowdhury</div>
        <div class="cover-title">
          Senior UI Engineer + Product Designer <br>
          Startup, Enterprise, & Open Source
        </div>
      </div>
      <div class="cover-contact">
        <div><a href="https://sartaj.me">sartaj.me</a></div>
        <div><span>Open Source: </span><a href="https://github.com/sartaj">github.com/sartaj</a></div>
        <div><span>Recommendations: </span><a href="https://linkedin.com/in/sartajchowdhury">linkedin.com/in/sartajchowdhury</a></div>
        <div class="hide-on-screen"><a href="mailto:sartaj@sartaj.me">sartaj@sartaj.me</a> | <a href="tel:9727652286">972-765-2286</a></div>
      </div>
    </div>
  </div>
`)

export default cover
