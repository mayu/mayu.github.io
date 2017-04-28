const renderProfessional = (personal) => (`
  <div class="grid">
    ${
      personal
        .map(item => `
          <div class="col-half personal-item focusable">
            <strong>${item.title}</strong>
            <br> ${item.description}
          </div>
        `)
        .reduce((a, b) => a + b)
    }
  </div>
`)

export default renderProfessional
