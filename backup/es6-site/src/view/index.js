/* @flow */

import coverView from './CoverView.js'
import mainPointsView from './MainPointsView.js'
import professionalItemView from './ProfessionalItemView.js'
import personalItemView from './PersonalItemView.js'
import forkOnGithub from './ForkOnGithub.js'
import topSection from './TopSection.js'

const page = (props) => `
  ${forkOnGithub(props)}
  ${topSection(props)}
  <div class="">
      ${coverView(props)}
      <div class="subpage">
        ${mainPointsView(props)}
        <div class="section-title">Professional</div>
        <div class="professional" id="columns">
          ${
            props.professional
            .slice(0, 3)
            .map(job => professionalItemView(job))
            .reduce((a, b) => a + b)
          }
        </div>
      </div>
  </div>
  <div class="page">
      <div class="subpage">
        <div class="professional" id="columns">
          ${
            props.professional
            .slice(3, props.professional.length + 1)
            .map(job => professionalItemView(job))
            .reduce((a, b) => a + b)
          }
        </div>
        <div class="section-title">Projects</div>
        <div class="personal grid">
          ${personalItemView(props.personal)}
        </div>
        <div class="section-title">Education</div>
        <div class="educational grid focusable">
          <div style="font-size: 16pt"><strong>University of Texas at Austin</strong> | 2011</div>
          <div>B.A. Rhetoric & Writing | Business Administration</div>
          <div style="font-style:italic">Focus: Digital Rhetoric and Classical Persuasion</div>
        </div>
      </div>
  </div>
`

export default page
