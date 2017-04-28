export default (props) => `
  <div class="grid top-section hide-on-print" style="text-align: center">
    <a href="${props.pdf}" download id="download-resume" >
      <i class="fa fa-download" title="Download Resume"></i>
    </a>
    <a href="${props.twitter}"><i class="fa fa-twitter" title="Twitter"></i></a>
    <a href="${props.github}"><i class="fa fa-github" title="Github"></i></a>
  </div>
`
